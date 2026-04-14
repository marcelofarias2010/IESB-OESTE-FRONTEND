# Tarefa: atualizar o título da aba com o contador + preencher input com última tarefa

## Objetivo da aula

Nesta etapa você vai aplicar dois ajustes simples, mas com impacto real de usabilidade:

1. **Mostrar o tempo restante no título da aba do navegador**  
   Exemplo: `24:59 - Chronos Pomodoro`.
2. **Preencher automaticamente o campo da task com o nome da última tarefa criada**  
   Assim o usuário não precisa digitar tudo de novo se for repetir/editar.

---

## O que foi feito no `TaskContextProvider`

Arquivo: `src/contexts/TaskContext/TaskContextProvider.tsx`

A lógica aproveita o efeito que já reagia ao estado e adiciona:

```ts
document.title = `${state.formattedSecondsRemaining} - Chronos Pomodoro`;
```

Isso garante atualização contínua do título conforme o `formattedSecondsRemaining` muda.

### Código-fonte atual

```tsx
import { useEffect, useReducer, useRef } from 'react';
import { initialTaskState } from './initialTaskState';
import { taskReducer } from './taskReducer';
import { TaskContext } from './TaskContext';
import { TimerWorkerManager } from '../../workers/TimerWorkerManager';
import { TaskActionTypes } from './taskActions';
import { loadBeep } from '../../utils/loadBeep';

type TaskContextProviderProps = {
  children: React.ReactNode;
};

export function TaskContextProvider({ children }: TaskContextProviderProps) {
  const [state, dispatch] = useReducer(taskReducer, initialTaskState);
  const playBeepRef = useRef<ReturnType<typeof loadBeep> | null>(null);

  const worker = TimerWorkerManager.getInstance();

  useEffect(() => {
    worker.onmessage(e => {
      const countDownSeconds = e.data;

      if (countDownSeconds <= 0) {
        if (playBeepRef.current) {
          playBeepRef.current();
          playBeepRef.current = null;
        }
        dispatch({
          type: TaskActionTypes.COMPLETE_TASK,
        });
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
```

> Observação da aula: o título da aba pode ter leve atraso visual em alguns navegadores. É normal.

---

## O que foi feito no `MainForm`

Arquivo: `src/components/MainForm/index.tsx`

Foi criado `lastTaskName` pegando o último item do array `state.tasks`:

```ts
const lastTaskName = state.tasks[state.tasks.length - 1]?.name || '';
```

Depois, esse valor foi ligado ao input via `defaultValue`:

```tsx
defaultValue={lastTaskName}
```

Como o input está sendo usado de forma não-controlada (`ref`), o correto aqui é mesmo `defaultValue` (e não `value`).

### Código-fonte atual

```tsx
import { PlayCircleIcon, StopCircleIcon } from 'lucide-react';
import { Cycles } from '../Cycles';
import { DefaultButton } from '../DefaultButton';
import { DefaultInput } from '../DefaultInput';
import { useRef } from 'react';
import type { TaskModel } from '../../models/TaskModel';
import { useTaskContext } from '../../contexts/TaskContext';
import { getNextCycle } from '../../utils/getNextCycle';
import { getNextCycleType } from '../../utils/getNextCycleType';
import { TaskActionTypes } from '../../contexts/TaskContext/taskActions';
import { Tips } from '../Tips';
import { showMessage } from '../../adapters/showMessage';

export function MainForm() {
  const { state, dispatch } = useTaskContext();
  const taskNameInput = useRef<HTMLInputElement>(null);
  const lastTaskName = state.tasks[state.tasks.length - 1]?.name || '';

  function handleCreateNewTask(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    showMessage.dismiss();

    if (taskNameInput.current === null) return;

    const taskName = taskNameInput.current.value.trim();

    if (!taskName) {
      showMessage.warn('Digite o nome da tarefa');
      return;
    }

    const nextCycle = getNextCycle(state.currentCycle);
    const nextCyleType = getNextCycleType(nextCycle);

    const newTask: TaskModel = {
      id: Date.now().toString(),
      name: taskName,
      startDate: Date.now(),
      completeDate: null,
      interruptDate: null,
      duration: state.config[nextCyleType],
      type: nextCyleType,
    };

    dispatch({ type: TaskActionTypes.START_TASK, payload: newTask });
    showMessage.success('Tarefa iniciada');
  }

  function handleInterruptTask() {
    showMessage.dismiss();
    showMessage.error('Tarefa interrompida!');
    dispatch({ type: TaskActionTypes.INTERRUPT_TASK });
  }

  return (
    <form onSubmit={handleCreateNewTask} className='form' action=''>
      <div className='formRow'>
        <DefaultInput
          labelText='task'
          id='meuInput'
          type='text'
          placeholder='Digite algo'
          ref={taskNameInput}
          disabled={!!state.activeTask}
          defaultValue={lastTaskName}
        />
      </div>

      <div className='formRow'>
        <Tips />
      </div>

      {state.currentCycle > 0 && (
        <div className='formRow'>
          <Cycles />
        </div>
      )}

      <div className='formRow'>
        {!state.activeTask && (
          <DefaultButton
            aria-label='Iniciar nova tarefa'
            title='Iniciar nova tarefa'
            type='submit'
            icon={<PlayCircleIcon />}
          />
        )}

        {!!state.activeTask && (
          <DefaultButton
            aria-label='Interromper tarefa atual'
            title='Interromper tarefa atual'
            type='button'
            color='red'
            icon={<StopCircleIcon />}
            onClick={handleInterruptTask}
            key='botao_button'
          />
        )}
      </div>
    </form>
  );
}
```

---

## Como validar

1. Inicie uma task.
2. Veja o título da aba mudando para algo como `00:59 - Chronos Pomodoro`.
3. Navegue para outra rota (ex.: About) e confirme que o título continua atualizando.
4. Volte para Home e confirme que o nome da última task aparece no campo.
5. Inicie outra task e veja o campo manter sempre a mais recente.

---

## Resultado esperado para o usuário final

- Mesmo fora da Home, a aba mostra que o timer continua rodando.
- O campo da task “lembra” a última descrição, reduzindo repetição de digitação.
