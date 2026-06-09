const prisma = require('../prisma');

const getSettings = async (req, res) => {
  try {
    let settings = await prisma.settings.findUnique({ where: { userId: req.userId } });

    if (!settings) {
      settings = await prisma.settings.create({
        data: { userId: req.userId, workTime: 25, shortBreakTime: 5, longBreakTime: 15 },
      });
    }

    return res.json(settings);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao buscar settings' });
  }
};

const updateSettings = async (req, res) => {
  try {
    const { workTime, shortBreakTime, longBreakTime } = req.body;

    let settings = await prisma.settings.findUnique({ where: { userId: req.userId } });

    if (!settings) {
      settings = await prisma.settings.create({
        data: {
          userId: req.userId,
          workTime: workTime ?? 25,
          shortBreakTime: shortBreakTime ?? 5,
          longBreakTime: longBreakTime ?? 15,
        },
      });
    } else {
      settings = await prisma.settings.update({
        where: { userId: req.userId },
        data: {
          ...(workTime !== undefined && { workTime }),
          ...(shortBreakTime !== undefined && { shortBreakTime }),
          ...(longBreakTime !== undefined && { longBreakTime }),
        },
      });
    }

    return res.json(settings);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao atualizar settings' });
  }
};

module.exports = { getSettings, updateSettings };
