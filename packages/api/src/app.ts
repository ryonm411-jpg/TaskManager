import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { taskRoutes } from './routes/taskRoute.js'; 
// Load .env file — must happen before anything reads process.env
dotenv.config();

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
