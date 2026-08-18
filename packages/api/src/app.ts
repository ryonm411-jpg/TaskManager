import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { taskRoutes } from './routes/taskRoute.js'; 

// Resolve .env relative to this file (packages/api/src/app.ts → packages/api/.env)
dotenv.config({ path: path.resolve(__dirname, '../.env') });


const app = express();

// Parse incoming JSON request bodies
app.use(express.json());


// Allow cross-origin requests from the React dev server (port 5173)
app.use(cors());


// Health check — returns 200 instantly. Used for smoke tests and load balancers.
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});


app.use('/api', taskRoutes);

export default app;
