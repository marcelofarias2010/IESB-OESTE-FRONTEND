import { Router } from 'express';
import { prisma } from '../lib/prisma.js';

export const settingsRouter = Router();

settingsRouter.get('/', async (req, res) => {
  const userId = req.userId!;

  let row = await prisma.userSettings.findUnique({ where: { userId } });

  if (!row) {
    row = await prisma.userSettings.create({
      data: { userId, workTime: 25, shortBreakTime: 5, longBreakTime: 15 },
    });
  }

  return res.json({
    workTime: row.workTime,
    shortBreakTime: row.shortBreakTime,
    longBreakTime: row.longBreakTime,
  });
});

settingsRouter.put('/', async (req, res) => {
  const userId = req.userId!;
  const { workTime, shortBreakTime, longBreakTime } = req.body as {
    workTime: number;
    shortBreakTime: number;
    longBreakTime: number;
  };

  if (
    !Number.isInteger(workTime) ||
    !Number.isInteger(shortBreakTime) ||
    !Number.isInteger(longBreakTime)
  ) {
    return res.status(400).json({ message: 'Valores inválidos' });
  }

  const row = await prisma.userSettings.upsert({
    where: { userId },
    update: { workTime, shortBreakTime, longBreakTime },
    create: { userId, workTime, shortBreakTime, longBreakTime },
  });

  return res.json({
    workTime: row.workTime,
    shortBreakTime: row.shortBreakTime,
    longBreakTime: row.longBreakTime,
  });
});
