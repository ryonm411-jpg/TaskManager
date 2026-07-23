import type { Task, CreateTaskInput, UpdateTaskInput } from '@workspace/shared';
import { TaskRepository } from '../repository/taskRepository.js'; 
import Anthropic from '@anthropic-ai/sdk';

let anthropic: Anthropic | null = null;
function getAnthropic(): Anthropic {
  if (!anthropic) anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  return anthropic;
}


export class TaskService {
 
  constructor(private repo = new TaskRepository()) {}

  async getTasks(status?: string): Promise<Task[]> {
    const validStatuses = ['todo', 'in-progress', 'done'];
    if (status && !validStatuses.includes(status)) {
      throw new Error(`Invalid status filter: ${status}`);
    }
    return this.repo.getAllTasks(status);
  };

  async getTask(id: number): Promise<Task | null> {
    return this.repo.getTaskById(id);
  };

  async create(input: CreateTaskInput): Promise<Task> {
    return this.repo.createTask(input);
  };

  async update(id: number, input: UpdateTaskInput): Promise<Task | null> {
    const existingTask = await this.getTask(id);
    if (!existingTask) {
      return null;
    }
    return this.repo.updateTask(id, input);
  };

  async deleteTask(id: number): Promise<boolean> {
    return this.repo.deleteTask(id);
  }

    async summariseTask(id: number): Promise<string> {
    const task = await this.repo.getTaskById(id);
    if (!task) throw new Error('Task not found');
    const prompt = [
      `Summarise this task in one sentence for a project manager:`,
      `Title: ${task.title}`,
      task.description ? `Description: ${task.description}` : '',
      `Status: ${task.status}  Priority: ${task.priority}`,
    ].filter(Boolean).join('\n');
    const message = await getAnthropic().messages.create({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 100,
      messages: [{ role: 'user', content: prompt }],
    });
    const block = message.content[0];
    if (block.type !== 'text') throw new Error('Unexpected response from Claude');
    return block.text;
  }

};
