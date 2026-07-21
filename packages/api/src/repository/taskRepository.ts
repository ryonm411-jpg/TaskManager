import type { Task, CreateTaskInput, UpdateTaskInput } from '@workspace/shared';
import pool from '../config/db.js'; 

export class TaskRepository {
  
  async getAllTasks(status?: string): Promise<Task[]> {
    if (status) {
      const result = await pool.query(
        `SELECT id, title, description, status, priority,
                due_date AS "dueDate",
                created_at AS "createdAt",
                updated_at AS "updatedAt"
         FROM tasks WHERE status = $1
         ORDER BY created_at DESC`,
        [status] // 
      );
      return result.rows;
    }

    const result = await pool.query(
      `SELECT id, title, description, status, priority,
              due_date AS "dueDate",
              created_at AS "createdAt",
              updated_at AS "updatedAt"
       FROM tasks
       ORDER BY created_at DESC`
    );
    return result.rows;
  }

  async getTaskById(id: number): Promise<Task | null> {
    const result = await pool.query(
      `SELECT id, title, description, status, priority,
              due_date AS "dueDate",
              created_at AS "createdAt",
              updated_at AS "updatedAt"
       FROM tasks WHERE id = $1`,
      [id]
    );
    return result.rows[0] ?? null;
  }

  async createTask(task: CreateTaskInput): Promise<Task> {
    const result = await pool.query(
      `INSERT INTO tasks (title, description, status, priority, due_date)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, title, description, status, priority,
                 due_date AS "dueDate",
                 created_at AS "createdAt",
                 updated_at AS "updatedAt"`,
      [
        task.title,
        task.description ?? null,
        task.status ?? 'todo',
        task.priority ?? 'medium',
        task.dueDate ?? null,
      ]
    );
    return result.rows[0];
  }

  async updateTask(id: number, input: UpdateTaskInput): Promise<Task | null> {
    const fields: string[] = [];
    const values: unknown[] = [];
    let paramIndex = 1;

    if (input.title !== undefined) {
      fields.push(`title = $${paramIndex++}`);
      values.push(input.title);
    }
    if (input.description !== undefined) {
      fields.push(`description = $${paramIndex++}`);
      values.push(input.description);
    }
    if (input.status !== undefined) {
      fields.push(`status = $${paramIndex++}`);
      values.push(input.status);
    }
    if (input.priority !== undefined) {
      fields.push(`priority = $${paramIndex++}`);
      values.push(input.priority);
    }
    if (input.dueDate !== undefined) {
      fields.push(`due_date = $${paramIndex++}`);
      values.push(input.dueDate);
    }

    if (fields.length === 0) return this.getTaskById(id);

    fields.push(`updated_at = NOW()`);
    values.push(id);

    const result = await pool.query(
      `UPDATE tasks SET ${fields.join(', ')}
       WHERE id = $${paramIndex}
       RETURNING id, title, description, status, priority,
                 due_date AS "dueDate",
                 created_at AS "createdAt",
                 updated_at AS "updatedAt"`,
      values
    );
    return result.rows[0] ?? null;
  }

 
  async deleteTask(id: number): Promise<boolean> {
    const result = await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  }
}
