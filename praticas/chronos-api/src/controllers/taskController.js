const prisma = require('../prisma');

const createTask = async (req, res) => {
  try {
    const { id, name, duration, type, startDate } = req.body;

    if (!name || !duration || !type || !startDate) {
      return res.status(400).json({ error: 'Campos obrigatórios: name, duration, type, startDate' });
    }

    const task = await prisma.task.create({
      data: {
        id: id || undefined,
        name,
        duration: Number(duration),
        type,
        startDate: new Date(startDate),
        userId: req.userId,
      },
    });

    return res.status(201).json(task);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao criar task' });
  }
};

const completeTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { completeDate } = req.body;

    const task = await prisma.task.findFirst({ where: { id: taskId, userId: req.userId } });
    if (!task) return res.status(404).json({ error: 'Task não encontrada' });

    const updated = await prisma.task.update({
      where: { id: taskId },
      data: { completeDate: new Date(completeDate) },
    });

    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao concluir task' });
  }
};

const interruptTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { interruptDate } = req.body;

    const task = await prisma.task.findFirst({ where: { id: taskId, userId: req.userId } });
    if (!task) return res.status(404).json({ error: 'Task não encontrada' });

    const updated = await prisma.task.update({
      where: { id: taskId },
      data: { interruptDate: new Date(interruptDate) },
    });

    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao interromper task' });
  }
};

const listTasks = async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      where: { userId: req.userId },
      orderBy: { startDate: 'desc' },
    });
    return res.json(tasks);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao listar tasks' });
  }
};

const clearTasks = async (req, res) => {
  try {
    await prisma.task.deleteMany({ where: { userId: req.userId } });
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao limpar histórico' });
  }
};

module.exports = { createTask, completeTask, interruptTask, listTasks, clearTasks };
