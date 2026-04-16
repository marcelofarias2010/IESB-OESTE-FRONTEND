## Limpar histórico com confirmação, `RESET_STATE` e lista vazia

### Objetivo

- Ao clicar no botão de apagar histórico, pedir **confirmação** (`window.confirm`).
- Se o usuário confirmar, **zerar o estado global** das tasks via `dispatch` com a ação `RESET_STATE`.
- No **reducer**, fazer `RESET_STATE` retornar uma cópia do **`initialTaskState`** (estado inicial), em vez de um objeto “na mão”.
- Como a tabela usa **estado local** (`sortTasksOptions`) derivado de `state.tasks`, usar **`useEffect`** para **reordenar** sempre que `state.tasks` mudar (inclusive após o reset).
- Quando **não houver tasks**, não mostrar a tabela nem o botão de lixeira; exibir uma **mensagem** (parágrafo). Opcionalmente usar `style` inline para alinhamento (bônus da aula).

### Bônus (próxima aula)

O `confirm` do navegador funciona, mas não é o fluxo ideal de UI. Na sequência pode-se substituir por **Toastify** (ou similar) com botões customizados e `onClose` com `reason` para simular OK/Cancelar.

---

### 1) Reducer: `RESET_STATE` → estado inicial

Arquivo: `src/contexts/TaskContext/taskReducer.ts`

No caso `TaskActionTypes.RESET_STATE`, retornamos `{ ...initialTaskState }` para voltar ao estado padrão (tasks vazias, sem task ativa, etc.).

```ts
import type { TaskStateModel } from '../../models/TaskStateModel';
import { formatSecondsToMinutes } from '../../utils/formatSecondsToMinutes';
import { getNextCycle } from '../../utils/getNextCycle';
import { initialTaskState } from './initialTaskState';
import { TaskActionTypes, type TaskActionModel } from './taskActions';

export function taskReducer(
  state: TaskStateModel,
  action: TaskActionModel,
): TaskStateModel {
  switch (action.type) {
    case TaskActionTypes.START_TASK: {
      const newTask = action.payload;
      const nextCycle = getNextCycle(state.currentCycle);
      const secondsRemaining = newTask.duration * 60;

      return {
        ...state,
        activeTask: newTask,
        currentCycle: nextCycle,
        secondsRemaining,
        formattedSecondsRemaining: formatSecondsToMinutes(secondsRemaining),
        tasks: [...state.tasks, newTask],
      };
    }
    case TaskActionTypes.INTERRUPT_TASK: {
      return {
        ...state,
        activeTask: null,
        secondsRemaining: 0,
        formattedSecondsRemaining: '00:00',
        tasks: state.tasks.map(task => {
          if (state.activeTask && state.activeTask.id === task.id) {
            return { ...task, interruptDate: Date.now() };
          }
          return task;
        }),
      };
    }
    case TaskActionTypes.COMPLETE_TASK: {
      return {
        ...state,
        activeTask: null,
        secondsRemaining: 0,
        formattedSecondsRemaining: '00:00',
        tasks: state.tasks.map(task => {
          if (state.activeTask && state.activeTask.id === task.id) {
            return { ...task, completeDate: Date.now() };
          }
          return task;
        }),
      };
    }
    case TaskActionTypes.RESET_STATE: {
      return { ...initialTaskState };
    }
    case TaskActionTypes.COUNT_DOWN: {
      return {
        ...state,
        secondsRemaining: action.payload.secondsRemaining,
        formattedSecondsRemaining: formatSecondsToMinutes(
          action.payload.secondsRemaining,
        ),
      };
    }
  }

  // Sempre deve retornar o estado
  return state;
}
```

---

### 2) History: confirmação, `dispatch`, `useEffect` e UI vazia

Arquivo: `src/pages/History/index.tsx`

Pontos principais:

- `hasTasks = state.tasks.length > 0` para controlar botão, tabela e mensagem.
- `handleResetHistory`: se `confirm(...)` retornar `false`, sai cedo; senão `dispatch({ type: TaskActionTypes.RESET_STATE })`.
- `useEffect` com dependência `[state.tasks]`: quando as tasks do contexto mudam, recalcula `sortTasksOptions.tasks` com `sortTasks`, mantendo `direction` e `field` do estado anterior.
- Botão de lixeira e tabela só renderizam quando `hasTasks`.
- Parágrafo “Ainda não existem tarefas criadas.” quando `!hasTasks`.

```tsx
import { TrashIcon } from 'lucide-react';
import { Container } from '../../components/Container';
import { DefaultButton } from '../../components/DefaultButton';
import { Heading } from '../../components/Heading';
import { MainTemplate } from '../../templates/MainTemplate';

import styles from './styles.module.css';
import { useTaskContext } from '../../contexts/TaskContext';
import { formatDate } from '../../utils/formatDate';
import { getTaskStatus } from '../../utils/getTaskStatus';
import { sortTasks, type SortTasksOptions } from '../../utils/sortTasks';
import { useEffect, useState } from 'react';
import { TaskActionTypes } from '../../contexts/TaskContext/taskActions';

export function History() {
  const { state, dispatch } = useTaskContext();
  const hasTasks = state.tasks.length > 0;

  const [sortTasksOptions, setSortTaskOptions] = useState<SortTasksOptions>(
    () => {
      return {
        tasks: sortTasks({ tasks: state.tasks }),
        field: 'startDate',
        direction: 'desc',
      };
    },
  );

  useEffect(() => {
    setSortTaskOptions(prevState => ({
      ...prevState,
      tasks: sortTasks({
        tasks: state.tasks,
        direction: prevState.direction,
        field: prevState.field,
      }),
    }));
  }, [state.tasks]);

  function handleSortTasks({ field }: Pick<SortTasksOptions, 'field'>) {
    const newDirection = sortTasksOptions.direction === 'desc' ? 'asc' : 'desc';

    setSortTaskOptions({
      tasks: sortTasks({
        direction: newDirection,
        tasks: sortTasksOptions.tasks,
        field,
      }),
      direction: newDirection,
      field,
    });
  }

  function handleResetHistory() {
    if (!confirm('Tem certeza')) return;

    dispatch({ type: TaskActionTypes.RESET_STATE });
  }

  return (
    <MainTemplate>
      <Container>
        <Heading>
          <span>History</span>
          {hasTasks && (
            <span className={styles.buttonContainer}>
              <DefaultButton
                icon={<TrashIcon />}
                color='red'
                aria-label='Apagar todo o histórico'
                title='Apagar histórico'
                onClick={handleResetHistory}
              />
            </span>
          )}
        </Heading>
      </Container>

      <Container>
        {hasTasks && (
          <div className={styles.responsiveTable}>
            <table>
              <thead>
                <tr>
                  <th
                    onClick={() => handleSortTasks({ field: 'name' })}
                    className={styles.thSort}
                  >
                    Tarefa ↕
                  </th>
                  <th
                    onClick={() => handleSortTasks({ field: 'duration' })}
                    className={styles.thSort}
                  >
                    Duração ↕
                  </th>
                  <th
                    onClick={() => handleSortTasks({ field: 'startDate' })}
                    className={styles.thSort}
                  >
                    Data ↕
                  </th>
                  <th>Status</th>
                  <th>Tipo</th>
                </tr>
              </thead>

              <tbody>
                {sortTasksOptions.tasks.map(task => {
                  const taskTypeDictionary = {
                    workTime: 'Foco',
                    shortBreakTime: 'Descanso curto',
                    longBreakTime: 'Descanso longo',
                  };
                  return (
                    <tr key={task.id}>
                      <td>{task.name}</td>
                      <td>{task.duration}min</td>
                      <td>{formatDate(task.startDate)}</td>
                      <td>{getTaskStatus(task, state.activeTask)}</td>
                      <td>{taskTypeDictionary[task.type]}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        {!hasTasks && (
          <p style={{ textAlign: 'center', fontWeight: 'bold' }}>
            Ainda não existem tarefas criadas.
          </p>
        )}
      </Container>
    </MainTemplate>
  );
}
```

**Comportamento do `confirm`:** OK → `true` (executa o `dispatch`); Cancelar → `false` (retorna antes e não apaga).

---

### Checklist

- [ ] `taskReducer`: `RESET_STATE` retorna `{ ...initialTaskState }`.
- [ ] `History`: `dispatch` e `TaskActionTypes.RESET_STATE` importados.
- [ ] `handleResetHistory` com `confirm` antes do `dispatch`.
- [ ] `useEffect` observando `state.tasks` para sincronizar `sortTasksOptions.tasks`.
- [ ] `hasTasks` controla tabela, botão de apagar e mensagem de lista vazia.
