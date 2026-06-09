import type { TaskModel } from '../models/TaskModel';

/**
 * Computes the human-readable status for a given task based on its dates and the current active task.
 *
 * The rules are evaluated in this order:
 * 1. If `completeDate` is set, the task is considered "Completa".
 * 2. Else if `interruptDate` is set, the task is considered "Interrompida".
 * 3. Else if the task id matches the current `activeTask` id, it is "Em Progresso".
 * 4. Otherwise, the task is treated as "Abandonada".
 *
 * @param task - Task to compute the status for.
 * @param activeTask - Currently active task or null when none is running.
 * @returns One of: "Completa", "Interrompida", "Em Progresso" or "Abandonada".
 */
export function getTaskStatus(task: TaskModel, activeTask: TaskModel | null) {
  if (task.completeDate) return 'Completa';
  if (task.interruptDate) return 'Interrompida';
  if (task.id === activeTask?.id) return 'Em Progresso';
  return 'Abandonada';
}