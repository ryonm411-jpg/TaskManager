import type { Task, CreateTaskInput, UpdateTaskInput } from '@workspace/shared';
import { TaskRepository } from '../repository/taskRepository'; 

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
    return this.repo.delete(id);
  }
};
