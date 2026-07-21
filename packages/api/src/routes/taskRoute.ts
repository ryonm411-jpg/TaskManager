import { Router } from 'express';
import * as taskController from '../controllers/taskController.js';

export const taskRoutes = Router();

taskRoutes.get('/tasks', taskController.getAllTasks);
taskRoutes.get('/tasks/:id', taskController.getTaskById);
taskRoutes.post('/tasks', taskController.createTask);
taskRoutes.put('/tasks/:id', taskController.updateTask);
taskRoutes.delete('/tasks/:id', taskController.deleteTask);
