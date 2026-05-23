import { Router } from 'express';
import { prisma } from '../lib/prisma.js';

export const tasksRouter = Router();

function serializeTask(
  task: Awaited<ReturnType<typeof prisma.task.findFirst>>,
) {
  if (!task) return task;

  return {
    ...task,
    startDate: task.startDate.toString(),
    completeDate: task.completeDate?.toString() ?? null,
    interruptDate: task.interruptDate?.toString() ?? null,
  };
}

tasksRouter.get('/', async (req, res) => {
  const userId = req.userId!;

  const tasks = await prisma.task.findMany({
    where: { userId },
    orderBy: { startDate: 'desc' },
  });

  return res.json(tasks.map(serializeTask));
});

tasksRouter.post('/', async (req, res) => {
  const userId = req.userId!;
  const { id, name, duration, type, startDate } = req.body as {
    id: string;
    name: string;
    duration: number;
    type: string;
    startDate: number;
  };

  if (!id || !name || !Number.isInteger(duration) || !Number.isInteger(startDate)) {
    return res.status(400).json({ message: 'Payload inválido para criação de task' });
  }

  const task = await prisma.task.create({
    data: {
      id,
      userId,
      name,
      duration,
      type,
      startDate: BigInt(startDate),
    },
  });

  return res.status(201).json(serializeTask(task));
});

tasksRouter.patch('/:id/complete', async (req, res) => {
  const userId = req.userId!;
  const { id } = req.params;
  const { completeDate } = req.body as { completeDate: number };

  if (!Number.isInteger(completeDate)) {
    return res.status(400).json({ message: 'completeDate inválido' });
  }

  const existing = await prisma.task.findFirst({ where: { id, userId } });
  if (!existing) {
    return res.status(404).json({ message: 'Tarefa não encontrada' });
  }

  const task = await prisma.task.update({
    where: { id },
    data: { completeDate: BigInt(completeDate) },
  });

  return res.json(serializeTask(task));
});

tasksRouter.patch('/:id/interrupt', async (req, res) => {
  const userId = req.userId!;
  const { id } = req.params;
  const { interruptDate } = req.body as { interruptDate: number };

  if (!Number.isInteger(interruptDate)) {
    return res.status(400).json({ message: 'interruptDate inválido' });
  }

  const existing = await prisma.task.findFirst({ where: { id, userId } });
  if (!existing) {
    return res.status(404).json({ message: 'Tarefa não encontrada' });
  }

  const task = await prisma.task.update({
    where: { id },
    data: { interruptDate: BigInt(interruptDate) },
  });

  return res.json(serializeTask(task));
});

tasksRouter.delete('/', async (req, res) => {
  const userId = req.userId!;
  await prisma.task.deleteMany({ where: { userId } });
  return res.status(204).send();
});
