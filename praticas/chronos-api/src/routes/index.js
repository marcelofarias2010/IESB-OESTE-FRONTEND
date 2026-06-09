const { Router } = require('express');
const { healthCheck } = require('../controllers/healthController');
const { register, login, forgotPassword, resetPassword, me } = require('../controllers/authController');
const { getSettings, updateSettings } = require('../controllers/settingsController');
const { createTask, completeTask, interruptTask, listTasks, clearTasks } = require('../controllers/taskController');
const { authMiddleware } = require('../middlewares/auth');

const router = Router();

// Health (pública)
router.get('/health', healthCheck);

// Auth (pública)
router.post('/auth/register', register);
router.post('/auth/login', login);
router.post('/auth/forgot-password', forgotPassword);
router.post('/auth/reset-password', resetPassword);

// Auth (protegida)
router.get('/auth/me', authMiddleware, me);

// Settings (protegidas)
router.get('/settings', authMiddleware, getSettings);
router.put('/settings', authMiddleware, updateSettings);

// Tasks (protegidas)
router.post('/tasks', authMiddleware, createTask);
router.get('/tasks', authMiddleware, listTasks);
router.delete('/tasks', authMiddleware, clearTasks);
router.patch('/tasks/:taskId/complete', authMiddleware, completeTask);
router.patch('/tasks/:taskId/interrupt', authMiddleware, interruptTask);

module.exports = router;
