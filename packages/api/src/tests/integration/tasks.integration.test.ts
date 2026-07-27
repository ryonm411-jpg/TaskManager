/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import request from 'supertest';
import app from '../../app.js';
import pool from '../../config/db.js';

describe('Task API Integration Tests', () => {
  beforeEach(async () => {
    await pool.query('TRUNCATE tasks RESTART IDENTITY CASCADE');
  });


  afterAll(async () => {
    await pool.end();
  });

  describe('GET /api/tasks', () => {
    it('should return 200 and an array of tasks', async () => {
      await pool.query(
        'INSERT INTO tasks (title, description, status, priority) VALUES ($1, $2, $3, $4)',
        ['Test Task', 'This is a test task', 'todo', 'medium']
      );

      const response = await request(app).get('/api/tasks');
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].title).toBe('Test Task');
    });
  });


  describe('GET /api/tasks/:id', () => {
    it('should return 200 when the task with id exists', async () => {
      await pool.query(
        'INSERT INTO tasks (title, description, status, priority) VALUES ($1, $2, $3, $4)',
        ['Test Task', 'This is a test task', 'todo', 'medium']
      );

      const response = await request(app).get('/api/tasks/1');
      expect(response.status).toBe(200);
      expect(response.body.title).toBe('Test Task');
    });

    it('should return 404 when the task with id does not exist', async () => {
      const response = await request(app).get('/api/tasks/999');
      expect(response.status).toBe(404);
    });

    it('should return 400 when the task id is invalid', async () => {
      const response = await request(app).get('/api/tasks/invalid-id');
      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/tasks', () => {
    it('should return 201 and the created task when input is valid', async () => {
      const newTask = { title: 'Write real integration tests', priority: 'high' };

      const response = await request(app).post('/api/tasks').send(newTask);
      expect(response.status).toBe(201);
      expect(response.body.title).toBe('Write real integration tests');
      expect(response.body.id).toBeDefined();

      const dbCheck = await pool.query('SELECT title FROM tasks WHERE id = $1', [response.body.id]);
      expect(dbCheck.rows).toHaveLength(1);
      expect(dbCheck.rows[0].title).toBe('Write real integration tests');
    });

    it('should return 400 when input is invalid', async () => {
      const response = await request(app).post('/api/tasks').send({ title: '' });
      expect(response.status).toBe(400);
    });
  });

  describe('PUT /api/tasks/:id', () => {
    it('should return 200 and the updated task when input is valid', async () => {
      await pool.query(
        'INSERT INTO tasks (title, description, status, priority) VALUES ($1, $2, $3, $4)',
        ['Old Title', 'Old Desc', 'todo', 'medium']
      );

      const response = await request(app).put('/api/tasks/1').send({ title: 'Updated title' });
      expect(response.status).toBe(200);
      expect(response.body.title).toBe('Updated title');
      const taskId = response.body.id;
      const dbCheck = await pool.query(
        'SELECT * FROM tasks WHERE id = $1',
        [taskId]
      );

      expect(dbCheck.rows[0].title)
        .toBe('Updated title');
    });

    it('should return 400 when input is invalid', async () => {
      await pool.query(
        'INSERT INTO tasks (title, description, status, priority) VALUES ($1, $2, $3, $4)',
        ['Test Task', 'Desc', 'todo', 'medium']
      );

      const response = await request(app).put('/api/tasks/1').send({ title: '' });
      expect(response.status).toBe(400);
    });

    it('should return 404 when the task with id does not exist', async () => {
      const response = await request(app).put('/api/tasks/999').send({ title: 'Updated title' });
      expect(response.status).toBe(404);
    });
  });


  describe('DELETE /api/tasks/:id', () => {
    it('should return 204 when the task with id exists and is deleted', async () => {
      const seed = await pool.query(
        'INSERT INTO tasks (title) VALUES ($1) RETURNING id',
        ['Task to delete']
      );
      const targetId = seed.rows[0].id;

      const response = await request(app).delete(`/api/tasks/${targetId}`);
      expect(response.status).toBe(204);

      const dbCheck = await pool.query('SELECT * FROM tasks WHERE id = $1', [targetId]);
      expect(dbCheck.rows).toHaveLength(0);
    });

    it('should return 404 when the task with id does not exist', async () => {
      const response = await request(app).delete('/api/tasks/999');
      expect(response.status).toBe(404);
    });
  });
});
