/* eslint-disable @typescript-eslint/no-explicit-any */
import {describe, it, expect, vi, beforeEach} from 'vitest';
import request from 'supertest';

vi.mock('../../config/db.js', () => ({
    default: {
        query: vi.fn() },
    }));

import app from '../../app.js';
import pool from '../../config/db.js';

const mockTask = {
  id: 1,
  title: 'Write tests',
  description: null,
  status: 'todo',
  priority: 'medium',
  dueDate: null,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

describe('Task API Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
    describe('GET / api/tasks', () => {
        it('should return 200 and an array of tasks', async () => {
            vi.mocked(pool.query).mockResolvedValue({ rows: [mockTask] } as any);
            const response = await request(app).get('/api/tasks');
            expect(response.status).toBe(200);
            expect(response.body).toEqual([mockTask]);
        });
    });
    describe('GET / api/tasks/:id', () => {
        it('should return 200 when the task with id exists', async () => {
            vi.mocked(pool.query).mockResolvedValue({ rows: [mockTask] } as any);
            const response = await request(app).get('/api/tasks/1');
            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockTask);
        });
        it('should return 404 when the task with id does not exist', async () => {
            vi.mocked(pool.query).mockResolvedValue({ rows: [] } as any);
            const response = await request(app).get('/api/tasks/999');
            expect(response.status).toBe(404);
        });
        it('should return 400 when the task id is invalid', async () => {
            const response = await request(app).get('/api/tasks/invalid-id');
            expect(response.status).toBe(400);
            expect(pool.query).not.toHaveBeenCalled();
        });
    });

    describe('POST / api/tasks', () => {
        it('should return 201 and the created task when input is valid', async () => {
            vi.mocked(pool.query).mockResolvedValue({ rows: [mockTask] } as any);
            const response = await request(app).post('/api/tasks').send({title: 'Write tests'});
            expect(response.status).toBe(201);
            expect(response.body).toEqual(mockTask);
        });
        it('should return 400 when input is invalid', async () => {
            const response = await request(app).post('/api/tasks').send({title: ''});
            expect(response.status).toBe(400);
            expect(pool.query).not.toHaveBeenCalled();
        });
    });
    describe('PUT / api/tasks/:id', () => {
        it('should return 200 and the updated task when input is valid', async () => {
            vi.mocked(pool.query).mockResolvedValueOnce({ rows: [mockTask] } as any).mockResolvedValueOnce({ rows: [{...mockTask, title: 'Updated title'}] } as any);
            const response = await request(app).put('/api/tasks/1').send({title: 'Updated title'});
            expect(response.status).toBe(200);
            expect(response.body.title).toBe('Updated title');
        });
        it('should return 400 when input is invalid', async () => {
            const response = await request(app).put('/api/tasks/1').send({title: ''});
            expect(response.status).toBe(400);
            expect(pool.query).not.toHaveBeenCalled();
        })
        it('should return 404 when the task with id does not exist', async () => {
            vi.mocked(pool.query).mockResolvedValueOnce({ rows: [] } as any);
            const response = await request(app).put('/api/tasks/999').send({title: 'Updated title'});
            expect(response.status).toBe(404);
        });
    });
    describe('DELETE / api/tasks/:id', () => {
        it('should return 200 when the task with id exists and is deleted', async () => {
            vi.mocked(pool.query).mockResolvedValue({ rowCount: 1 } as any);
            const response = await request(app).delete('/api/tasks/1');
            expect(response.status).toBe(204);
        });
        it('should return 404 when the task with id does not exist', async () => {
            vi.mocked(pool.query).mockResolvedValue({ rowCount: 0 } as any);
            const response = await request(app).delete('/api/tasks/999');
            expect(response.status).toBe(404);
        });
    });
});

