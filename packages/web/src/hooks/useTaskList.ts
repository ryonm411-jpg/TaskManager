import { useState, useEffect, useCallback } from 'react';
import type { Task, CreateTaskInput, UpdateTaskInput } from '@workspace/shared';
import * as tasksApi from '../api/tasksApi';


export function useTaskList() {
  const [tasks, setTasks]       = useState<Task[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError]       = useState<string | null>(null);


  const fetchTasks = useCallback(async (status?: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await tasksApi.getTasks(status);
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const createTask = async (input: CreateTaskInput): Promise<void> => {
    const newTask = await tasksApi.createTask(input);
   
    setTasks(prev => [newTask, ...prev]);
  };

  const updateTask = async (id: number, input: UpdateTaskInput): Promise<void> => {
    const updated = await tasksApi.updateTask(id, input);
    setTasks(prev => prev.map(t => t.id === id ? updated : t));
  };

  const deleteTask = async (id: number): Promise<void> => {
    await tasksApi.deleteTask(id);
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  return { tasks, isLoading, error, fetchTasks, createTask, updateTask, deleteTask };
}
