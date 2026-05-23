import cors from 'cors';
import express from 'express';
import { authRouter } from './routes/auth.routes.js';
import { settingsRouter } from './routes/settings.routes.js';
import { tasksRouter } from './routes/tasks.routes.js';
import { requireAuth } from './middleware/auth.middleware.js';

export const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  return res.json({ ok: true });
});

app.use('/auth', authRouter);
app.use('/settings', requireAuth, settingsRouter);
app.use('/tasks', requireAuth, tasksRouter);
