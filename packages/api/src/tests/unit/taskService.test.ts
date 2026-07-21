import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TaskService } from '../../service/taskService.js'; // Fixed plural path


vi.mock('../../repository/taskRepository.js', () => ({
  TaskRepository: vi.fn().mockImplementation(() => ({
    getAllTasks: vi.fn(),
    getTaskById: vi.fn(),
    createTask: vi.fn(),
    updateTask: vi.fn(),
    deleteTask: vi.fn(),
  })),
}));

const mockTask = {
  id: 1,
  title: 'Write tests',
  description: 'They should be good',
  status: 'todo' as const,
  priority: 'high' as const,
  dueDate: null,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

describe('TaskService Unit Tests', () => {
  let taskService: TaskService;
  let mockRepo: {
    getAllTasks: ReturnType<typeof vi.fn>;
    getTaskById: ReturnType<typeof vi.fn>;
    createTask: ReturnType<typeof vi.fn>;
    updateTask: ReturnType<typeof vi.fn>;
    deleteTask: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    vi.clearAllMocks();
    taskService = new TaskService();
    mockRepo = (taskService as any).repo;
  });

  describe('create', () => {
    it('should create a new task and return the task object', async () => {
      const input = { title: 'shush' };
      
      mockRepo.createTask.mockResolvedValue(mockTask);

      const task = await taskService.create(input);
      expect(mockRepo.createTask).toHaveBeenCalledWith(input);
      expect(mockRepo.createTask).toHaveBeenCalledTimes(1);
      expect(task.title).toBe('Write tests');
      expect(task.description).toBe('They should be good');
      expect(task.status).toBe('todo');
    });
  });

  describe('getAllTasks', () => {
    it('should return all tasks when no status filter is provided', async () => {
      mockRepo.getAllTasks.mockResolvedValue([mockTask]);
      const tasks = await taskService.getTasks();
      expect(mockRepo.getAllTasks).toHaveBeenCalledTimes(1);
      expect(mockRepo.getAllTasks).toHaveBeenCalledWith(undefined);
      expect(tasks).toHaveLength(1);
      expect(tasks[0].title).toBe('Write tests');
    });

    it('should call getAllTasks with valid status filter', async () => {
      mockRepo.getAllTasks.mockResolvedValue([mockTask]);
      const tasks = await taskService.getTasks('todo');
      expect(mockRepo.getAllTasks).toHaveBeenCalledWith('todo');
      expect(tasks).toHaveLength(1);
    });

    it('should throw an error when an invalid status filter is provided', async () => {
      await expect(taskService.getTasks('shush')).rejects.toThrowError(
        'Invalid status filter: shush'
      );
      expect(mockRepo.getAllTasks).not.toHaveBeenCalled();
    });
  }); 

  describe('getTaskById', () => {
    it('should return the task with the given ID', async () => {
      mockRepo.getTaskById.mockResolvedValue(mockTask);
      const task = await taskService.getTask(1);
      expect(mockRepo.getTaskById).toHaveBeenCalledWith(1);
      expect(task?.title).toBe('Write tests');
    });

    it('should return null if the task does not exist', async () => {
      mockRepo.getTaskById.mockResolvedValue(null);
      const task = await taskService.getTask(999);
      expect(task).toBeNull();
    });
  });

  describe('updateTask', () => {
    it('should return the updated task when it exists', async () => {
      const input = { title: 'Updated title', description: 'Updated description' };
      mockRepo.getTaskById.mockResolvedValue(mockTask);
      mockRepo.updateTask.mockResolvedValue({
        ...mockTask,
        title: 'Updated title',
        description: 'Updated description',
      });

      const updatedTask = await taskService.update(1, input);
      expect(updatedTask?.title).toBe('Updated title');
      expect(updatedTask?.description).toBe('Updated description');
      expect(mockRepo.updateTask).toHaveBeenCalledWith(1, input);
    });

    it('should return null when the task does not exist', async () => {
      const input = { title: 'Updated title' };
      mockRepo.getTaskById.mockResolvedValue(null);

      const updatedTask = await taskService.update(999, input);
      expect(updatedTask).toBeNull();
      expect(mockRepo.updateTask).not.toHaveBeenCalled();
    });
  });

  describe('deleteTask', () => {
    it('should return true when the task is successfully deleted', async () => {
      mockRepo.deleteTask.mockResolvedValue(true);
      const result = await taskService.deleteTask(1);
      expect(result).toBe(true);
      expect(mockRepo.deleteTask).toHaveBeenCalledWith(1);
    });

    it('should return false when the task does not exist', async () => {
      mockRepo.deleteTask.mockResolvedValue(false);
      const result = await taskService.deleteTask(999);
      expect(result).toBe(false);
    });
  });
});
