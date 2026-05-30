// useReducer <- hook do React que recebe um reducer e um estado inicial
// reducer <- função que recebe o estado atual e uma ação, e retorna o novo estado
// state <- o estado atual
// action <- a ação disparada, geralmente é um objeto com type e (opcionalmente) payload
// type <- o tipo da ação, geralmente uma string (pode ser enum, constante, etc)
// payload <- os dados extras enviados junto com a action, se necessário para atualizar o estado

import type { TaskModel } from '../../models/TaskModel';
import type { TaskStateModel } from '../../models/TaskStateModel';

// 1. Trocamos 'enum' por um objeto literal com 'as const'
export const TaskActionTypes = {
  START_TASK: 'START_TASK',
  INTERRUPT_TASK: 'INTERRUPT_TASK',
  RESET_STATE: 'RESET_STATE',
  COUNT_DOWN: 'COUNT_DOWN',
  COMPLETE_TASK: 'COMPLETE_TASK',
  CHANGE_SETTINGS: 'CHANGE_SETTINGS',
} as const;

export type TaskActionTypes =
  (typeof TaskActionTypes)[keyof typeof TaskActionTypes];

export type TaskActionsWithPayload =
  | {
    type: typeof TaskActionTypes.START_TASK;
    payload: TaskModel;
  }
  | {
    type: typeof TaskActionTypes.COUNT_DOWN;
    payload: { secondsRemaining: number };
  }
  | {
    type: typeof TaskActionTypes.CHANGE_SETTINGS;
    payload: TaskStateModel['config'];
  };

export type TaskActionsWithoutPayload =
  | {
    type: typeof TaskActionTypes.RESET_STATE;
  }
  | {
    type: typeof TaskActionTypes.INTERRUPT_TASK;
  }
  | {
    type: typeof TaskActionTypes.COMPLETE_TASK;
  };

export type TaskActionModel =
  | TaskActionsWithPayload
  | TaskActionsWithoutPayload;
