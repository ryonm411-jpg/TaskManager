import { z } from 'zod';



export interface Task {
  id: number;
  title: string;
  description: string | null;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate: string | null;
  createdAt: string; 
  updatedAt: string;
}



export type CreateTaskInput = {
  title: string;
  description?: string;
  status?: Task['status'];
  priority?: Task['priority'];
  dueDate?: string;
};

export type UpdateTaskInput = Partial<CreateTaskInput>;



export const CreateTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().optional(),
  status: z.enum(['todo', 'in-progress', 'done']).optional().default('todo'),
  priority: z.enum(['low', 'medium', 'high']).optional().default('medium'),
  dueDate: z.string().date('Must be a valid date (YYYY-MM-DD)').optional(),
});


export type CreateTaskSchemaType = z.infer<typeof CreateTaskSchema>;