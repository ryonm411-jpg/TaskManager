import type {Task, CreateTaskInput, UpdateTaskInput} from '@workspace/shared';

const API_BASE = '/api';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { message?: string }).message ?? `HTTP ${res.status}`);
  }
  
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}
export async function getTasks(status?: string): Promise<Task[]> {
  const url = status ? `${API_BASE}/tasks?status=${status}` : `${API_BASE}/tasks`;
  return handleResponse<Task[]>(await fetch(url));
}
export async function getTask(id: number): Promise<Task> {
  return handleResponse<Task>(await fetch(`${API_BASE}/tasks/${id}`));
}
export async function createTask(input: CreateTaskInput): Promise<Task> {
  return handleResponse<Task>(await fetch(`${API_BASE}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  }));
}
export async function updateTask(id: number, input: UpdateTaskInput): Promise<Task> {
  return handleResponse<Task>(await fetch(`${API_BASE}/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  }));
}
export async function deleteTask(id: number): Promise<void> {
  return handleResponse<void>(await fetch(`${API_BASE}/tasks/${id}`, {
    method: 'DELETE',
  }));

}

export async function summariseTask(id: number): Promise<string> {
  const res = await fetch(`${API_BASE}/tasks/${id}/summarise`, { method: 'POST' });
  const body = await res.json() as { summary?: string; message?: string };
  if (!res.ok) throw new Error(body.message ?? 'Failed to summarise');
  return body.summary!;
}
