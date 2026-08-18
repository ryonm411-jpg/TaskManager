import { TaskService } from '../service/taskService.js';
import { Request, Response } from 'express';
import { CreateTaskSchema, UpdateTaskSchema } from '@workspace/shared';



const taskService = new TaskService();

function formatServerError(error: unknown, action: string): { status: number; message: string } {
    let detail = '';
    if (error instanceof Error) {
        detail = error.message;
    } else if (typeof error === 'string') {
        detail = error;
    } else if (error && typeof error === 'object') {
        detail = (error as { message?: string }).message || String(error);
    }

    if (!detail || detail === '[object Object]' || detail === 'Unknown error') {
        detail = 'An internal server or database error occurred';
    }

    if (detail.startsWith('Invalid status filter')) {
        return { status: 400, message: detail };
    }

    return {
        status: 500,
        message: `${action}: ${detail}`,
    };
}

export const getAllTasks = async (req: Request, res: Response): Promise<void> => {
    try {
        const tasks = await taskService.getTasks(req.query.status as string | undefined);
        res.json(tasks);
    } catch (error: unknown) {
        const { status, message } = formatServerError(error, 'Failed to retrieve tasks');
        res.status(status).json({ message, error: message });
    }

};

export const getTaskById = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id as string, 10);
        if (isNaN(id)) {
            res.status(400).json({ error: 'Invalid task ID' });
            return;
        }
        const task = await taskService.getTask(id);
        if (!task) {
            res.status(404).json({ error: 'Task not found' });
            return;
        }
        res.json(task);
    } catch (error: unknown) {
        const { status, message } = formatServerError(error, `Failed to retrieve task #${req.params.id}`);
        res.status(status).json({ message, error: message });
    }
};

export const createTask = async (req: Request, res: Response): Promise<void> => {
    const validatedTask = CreateTaskSchema.safeParse(req.body);
    if (!validatedTask.success) {
        res.status(400).json({
            message: 'Validation failed',
            errors: validatedTask.error.format()
        });
        return;
    }
    try {

        const newTask = await taskService.create(validatedTask.data);
        res.status(201).json(newTask);
    } catch (error: unknown) {
        const { status, message } = formatServerError(error, 'Failed to create task');
        res.status(status).json({ message, error: message });
    }
};

export const updateTask = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
        res.status(400).json({ message: 'Invalid task ID' });
        return;
    }
    const validation = UpdateTaskSchema.safeParse(req.body);
    if (!validation.success) {
        res.status(400).json({
            message: 'Validation failed',
            errors: validation.error.format(),
        });
        return;
    }
    try {


        const updatedTask = await taskService.update(id, validation.data);
        if (!updatedTask) {
            res.status(404).json({ error: 'Task not found' });
            return;
        }
        res.json(updatedTask);
    } catch (error: unknown) {
        const { status, message } = formatServerError(error, `Failed to update task #${id}`);
        res.status(status).json({ message, error: message });
    }
};

export const deleteTask = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id as string, 10);
        if (isNaN(id)) {
            res.status(400).json({ error: 'Invalid task ID' });
            return;
        }
        const deletedTask = await taskService.deleteTask(id);
        if (!deletedTask) {
            res.status(404).json({ error: 'Task not found' });
            return;
        }
        res.status(204).send();
    } catch (error: unknown) {
        const { status, message } = formatServerError(error, `Failed to delete task #${req.params.id}`);
        res.status(status).json({ message, error: message });
    }
}

export const summariseTask = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
        res.status(400).json({ message: 'Invalid task ID' });
        return;
    }
    try {
        const summary = await taskService.summariseTask(id);
        res.json({ summary });
    } catch (error: unknown) {
        const rawMessage = error instanceof Error ? error.message : String(error);
        if (rawMessage === 'Task not found') {
            res.status(404).json({ message: 'Task not found' });
            return;
        }
        const { message } = formatServerError(error, `Failed to summarise task #${id}`);
        res.status(502).json({ message, error: message });
    }
}
