// src/contexts/TaskContext/TaskContextProvider.tsx
// SUBSTITUIR o arquivo existente por este

import { useEffect, useReducer, useRef } from 'react';
import { initialTaskState } from './initialTaskState';
import { taskReducer } from './taskReducer';
import { TaskContext } from './TaskContext';
import { TimerWorkerManager } from '../../workers/TimerWorkerManager';
import { TaskActionTypes } from './taskActions';
import { loadBeep } from '../../utils/loadBeep';
import type { TaskStateModel } from '../../models/TaskStateModel';
import { createTask, completeTask, interruptTask } from '../../services/api';

type TaskContextProviderProps = {
  children: React.ReactNode;
};

export function TaskContextProvider({ children }: TaskContextProviderProps) {
  const [state, dispatch] = useReducer(taskReducer, initialTaskState, () => {
    const storageState = localStorage.getItem('state');
    if (storageState === null) return initialTaskState;

    const parsedStorageState = JSON.parse(storageState) as TaskStateModel;
    return {
      ...parsedStorageState,
      activeTask: null,
      secondsRemaining: 0,
      formattedSecondsRemaining: '00:00',
    };
  });

  const playBeepRef = useRef<ReturnType<typeof loadBeep> | null>(null);
  // Guarda o activeTask anterior para detectar mudanças
  const prevActiveTaskRef = useRef(state.activeTask);

  const worker = TimerWorkerManager.getInstance();

  // Detecta quando uma task é CRIADA (activeTask muda de null para algo)
  useEffect(() => {
    const prev = prevActiveTaskRef.current;
    const curr = state.activeTask;

    if (!prev && curr) {
      // Task foi iniciada → salva na API
      createTask({
        id: curr.id,
        name: curr.name,
        duration: curr.duration,
        type: curr.type,
        startDate: new Date(curr.startDate).toISOString(),
      }).catch(() => {
        console.warn('Não foi possível salvar a task na API.');
      });
    }

    if (prev && !curr) {
      // Task terminou → verifica se foi completada ou interrompida
      const finishedTask = state.tasks.find(t => t.id === prev.id);

      if (finishedTask?.completeDate) {
        completeTask(prev.id).catch(() => {
          console.warn('Não foi possível marcar task como concluída na API.');
        });
      } else if (finishedTask?.interruptDate) {
        interruptTask(prev.id).catch(() => {
          console.warn('Não foi possível marcar task como interrompida na API.');
        });
      }
    }

    prevActiveTaskRef.current = curr;
  }, [state.activeTask, state.tasks]);

  useEffect(() => {
    worker.onmessage(e => {
      const countDownSeconds = e.data;

      if (countDownSeconds <= 0) {
        if (playBeepRef.current) {
          playBeepRef.current();
          playBeepRef.current = null;
        }
        dispatch({ type: TaskActionTypes.COMPLETE_TASK });
        worker.terminate();
      } else {
        dispatch({
          type: TaskActionTypes.COUNT_DOWN,
          payload: { secondsRemaining: countDownSeconds },
        });
      }
    });
  }, [worker]);

  useEffect(() => {
    localStorage.setItem('state', JSON.stringify(state));

    if (!state.activeTask) {
      worker.terminate();
    }

    document.title = `${state.formattedSecondsRemaining} - Chronos Pomodoro`;
    worker.postMessage(state);
  }, [worker, state]);

  useEffect(() => {
    if (state.activeTask && playBeepRef.current === null) {
      playBeepRef.current = loadBeep();
    } else {
      playBeepRef.current = null;
    }
  }, [state.activeTask]);

  return (
    <TaskContext.Provider value={{ state, dispatch }}>
      {children}
    </TaskContext.Provider>
  );
}
