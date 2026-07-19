-- Tasks table for the Task Manager application.
-- Run via: docker-compose up (applied automatically on first start)
-- or manually: psql -h localhost -U postgres -d taskmanager_dev -f schema.sql

CREATE TABLE IF NOT EXISTS tasks (
  id          SERIAL       PRIMARY KEY,
  title       VARCHAR(255) NOT NULL,
  description TEXT,
  status      VARCHAR(20)  NOT NULL DEFAULT 'todo'
                           CHECK (status IN ('todo', 'in-progress', 'done')),
  priority    VARCHAR(10)  NOT NULL DEFAULT 'medium'
                           CHECK (priority IN ('low', 'medium', 'high')),
  due_date    DATE,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
