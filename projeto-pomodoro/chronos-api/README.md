# Chronos API (Express + Prisma + MySQL)

Este documento descreve, em formato de instrução guiada, todo o processo de:

1. Criação da `chronos-api` (backend Express),
2. Configuração do banco MySQL com Prisma,
3. Integração com o frontend `chronos-pomodoro`,
4. Testes dos endpoints no Postman.

---

## 1) Objetivo da API

A `chronos-api` foi criada para persistir dados do projeto Pomodoro que antes ficavam apenas no frontend/localStorage:

- Configurações do timer (`settings`)
- Histórico de tarefas (`tasks`)

Com isso, o frontend passa a ter integração real com banco de dados MySQL.

---

## 2) Stack adotada

- Node.js + TypeScript
- Express
- Prisma ORM
- MySQL

---

## 3) Estrutura da `chronos-api`

```txt
chronos-api/
  prisma/
    schema.prisma
  src/
    lib/
      prisma.ts
    routes/
      settings.routes.ts
      tasks.routes.ts
    app.ts
    server.ts
  .env
  .env.example
  package.json
  tsconfig.json
```

---

## 4) Configuração de ambiente

### 4.1 Arquivo `.env`

Exemplo funcional:

```env
DATABASE_URL="mysql://root:SenhaDoSeuServidor@localhost:3306/pomodoro_db"
PORT=3333
```

### 4.2 Banco local

Banco utilizado:

- `pomodoro_db`

Se não existir, crie no MySQL local:

```sql
CREATE DATABASE IF NOT EXISTS pomodoro_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;
```

---

## 5) Prisma: schema e migration

### 5.1 Modelos

O `schema.prisma` contém dois modelos:

- `Settings` (configuração global da aplicação)
- `Task` (histórico de tarefas)

### 5.1.1 package.json

#### garanta que seu arquivo package.json tenha o mesmo script

```js
 "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "prisma:migrate": "prisma migrate dev",
    "prisma:studio": "prisma studio",
    "prisma:generate": "prisma generate"
  },
```

### 5.2 Rodar migration

```bash
npm run prisma:migrate -- --name init
```

### 5.3 Gerar client (caso necessário)

```bash
npm run prisma:generate
```

---

## 6) Subir a API

```bash
npm install
npm run dev
```

Servidor:

- `http://localhost:3333`

Health check:

- `GET http://localhost:3333/health`

---

## 7) Endpoints implementados

## 7.1 Health

- `GET /health`

Retorno:

```json
{ "ok": true }
```

## 7.2 Settings

- `GET /settings`
  - Busca configurações atuais
  - Cria automaticamente defaults se ainda não existir registro
- `PUT /settings`
  - Atualiza `workTime`, `shortBreakTime`, `longBreakTime`
  - Valida payload numérico inteiro

## 7.3 Tasks

- `GET /tasks`
  - Lista tarefas ordenadas por `startDate desc`
- `POST /tasks`
  - Cria nova tarefa
- `PATCH /tasks/:id/complete`
  - Marca tarefa como concluída
- `PATCH /tasks/:id/interrupt`
  - Marca tarefa como interrompida
- `DELETE /tasks`
  - Limpa histórico

### Observação técnica importante

Os campos de data são `BigInt` no MySQL.  
Na resposta HTTP eles são serializados para `string`, evitando erro de `JSON.stringify` com BigInt.

---

## 8) Alterações aplicadas no frontend (`chronos-pomodoro`)

Para integrar com a API, os seguintes pontos foram modificados:

## 8.1 Novo serviço HTTP

Arquivo criado:

- `src/services/api.ts`

Funções principais:

- `getSettings`
- `updateSettings`
- `getTasks`
- `createTask`
- `completeTask`
- `interruptTask`
- `clearTasks`

```ts
import type { TaskModel } from "../models/TaskModel";
import type { TaskStateModel } from "../models/TaskStateModel";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3333";

type ApiTask = Omit<
  TaskModel,
  "startDate" | "completeDate" | "interruptDate"
> & {
  startDate: string | number;
  completeDate: string | number | null;
  interruptDate: string | number | null;
};

function normalizeTask(task: ApiTask): TaskModel {
  return {
    ...task,
    startDate: Number(task.startDate),
    completeDate: task.completeDate === null ? null : Number(task.completeDate),
    interruptDate:
      task.interruptDate === null ? null : Number(task.interruptDate),
  };
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `API error: ${response.status}`);
  }

  if (response.status === 204) return undefined as T;

  return (await response.json()) as T;
}

export async function getSettings() {
  return request<TaskStateModel["config"]>("/settings");
}

export async function updateSettings(config: TaskStateModel["config"]) {
  return request<TaskStateModel["config"]>("/settings", {
    method: "PUT",
    body: JSON.stringify(config),
  });
}

export async function getTasks() {
  const tasks = await request<ApiTask[]>("/tasks");
  return tasks.map(normalizeTask);
}

export async function createTask(task: TaskModel) {
  return request<ApiTask>("/tasks", {
    method: "POST",
    body: JSON.stringify(task),
  });
}

export async function completeTask(taskId: string, completeDate: number) {
  return request<ApiTask>(`/tasks/${taskId}/complete`, {
    method: "PATCH",
    body: JSON.stringify({ completeDate }),
  });
}

export async function interruptTask(taskId: string, interruptDate: number) {
  return request<ApiTask>(`/tasks/${taskId}/interrupt`, {
    method: "PATCH",
    body: JSON.stringify({ interruptDate }),
  });
}

export async function clearTasks() {
  return request<void>("/tasks", { method: "DELETE" });
}
```

## 8.2 Settings integrado com API

Arquivo:

- `src/pages/Settings/index.tsx`

Mudança:

- Submit agora chama `updateSettings(...)` na API.
- Em sucesso: mantém atualização no estado global.
- Em falha: mostra mensagem de erro.

```tsx
import { SaveIcon } from "lucide-react";
import { Container } from "../../components/Container";
import { DefaultButton } from "../../components/DefaultButton";
import { DefaultInput } from "../../components/DefaultInput";
import { Heading } from "../../components/Heading";
import { MainTemplate } from "../../templates/MainTemplate";
import { useTaskContext } from "../../contexts/TaskContext/useTaskContext";
import { useEffect, useRef } from "react";
import { showMessage } from "../../adapters/showMessage";
import { TaskActionTypes } from "../../contexts/TaskContext/taskActions";
import { updateSettings } from "../../services/api";

export function Settings() {
  const { state, dispatch } = useTaskContext();
  const workTimeInput = useRef<HTMLInputElement>(null);
  const shortBreakTimeInput = useRef<HTMLInputElement>(null);
  const longBreakTimeInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.title = "Configurações - Chronos Pomodoro";
  }, []);

  async function handleSaveSettings(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    showMessage.dismiss();

    const formErrors = [];

    const workTime = Number(workTimeInput.current?.value);
    const shortBreakTime = Number(shortBreakTimeInput.current?.value);
    const longBreakTime = Number(longBreakTimeInput.current?.value);

    if (isNaN(workTime) || isNaN(shortBreakTime) || isNaN(longBreakTime)) {
      formErrors.push("Digite apenas números para TODOS os campos");
    }

    if (workTime < 1 || workTime > 99) {
      formErrors.push("Digite valores entre 1 e 99 para foco");
    }

    if (shortBreakTime < 1 || shortBreakTime > 30) {
      formErrors.push("Digite valores entre 1 e 30 para descanso curto");
    }

    if (longBreakTime < 1 || longBreakTime > 60) {
      formErrors.push("Digite valores entre 1 e 60 para descanso longo");
    }

    if (formErrors.length > 0) {
      formErrors.forEach((error) => {
        showMessage.error(error);
      });
      return;
    }

    const nextConfig = {
      workTime,
      shortBreakTime,
      longBreakTime,
    };

    try {
      await updateSettings(nextConfig);
      dispatch({
        type: TaskActionTypes.CHANGE_SETTINGS,
        payload: nextConfig,
      });
      showMessage.success("Configurações salvas");
    } catch {
      showMessage.error("Não foi possível salvar as configurações na API");
    }
  }

  return (
    <MainTemplate>
      <Container>
        <Heading>Configurações</Heading>
      </Container>

      <Container>
        <p style={{ textAlign: "center" }}>
          Modifique as configurações para tempo de foco, descanso curso e
          descanso longo.
        </p>
      </Container>

      <Container>
        <form onSubmit={handleSaveSettings} action="" className="form">
          <div className="formRow">
            <DefaultInput
              id="workTime"
              labelText="Foco"
              ref={workTimeInput}
              defaultValue={state.config.workTime}
              type="number"
            />
          </div>
          <div className="formRow">
            <DefaultInput
              id="shortBreakTime"
              labelText="Descanso curto"
              ref={shortBreakTimeInput}
              defaultValue={state.config.shortBreakTime}
              type="number"
            />
          </div>
          <div className="formRow">
            <DefaultInput
              id="longBreakTime"
              labelText="Descanso longo"
              ref={longBreakTimeInput}
              defaultValue={state.config.longBreakTime}
              type="number"
            />
          </div>
          <div className="formRow">
            <DefaultButton
              icon={<SaveIcon />}
              aria-label="Salvar configurações"
              title="Salvar configurações"
            />
          </div>
        </form>
      </Container>
    </MainTemplate>
  );
}
```

## 8.3 MainForm integrado com API

Arquivo:

- `src/components/MainForm/index.tsx`

Mudança:

- Criação de task chama `POST /tasks`.
- Interrupção de task chama `PATCH /tasks/:id/interrupt`.

```tsx
import { PlayCircleIcon, StopCircleIcon } from "lucide-react";
import { Cycles } from "../Cycles";
import { DefaultButton } from "../DefaultButton";
import { DefaultInput } from "../DefaultInput";
import { useRef } from "react";
import type { TaskModel } from "../../models/TaskModel";
import { useTaskContext } from "../../contexts/TaskContext/useTaskContext";
import { getNextCycle } from "../../utils/getNextCycle";
import { getNextCycleType } from "../../utils/getNextCycleType";
import { TaskActionTypes } from "../../contexts/TaskContext/taskActions";
import { Tips } from "../Tips";
import { showMessage } from "../../adapters/showMessage";
import { createTask, interruptTask } from "../../services/api";

export function MainForm() {
  const { state, dispatch } = useTaskContext();
  const taskNameInput = useRef<HTMLInputElement>(null);
  const lastTaskName = state.tasks[state.tasks.length - 1]?.name || "";

  async function handleCreateNewTask(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    showMessage.dismiss();

    if (taskNameInput.current === null) return;

    const taskName = taskNameInput.current.value.trim();

    if (!taskName) {
      showMessage.warn("Digite o nome da tarefa");
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
    showMessage.success("Tarefa iniciada");

    try {
      await createTask(newTask);
    } catch {
      showMessage.error("A tarefa iniciou, mas não foi persistida na API");
    }
  }

  async function handleInterruptTask() {
    showMessage.dismiss();
    showMessage.error("Tarefa interrompida!");
    const taskId = state.activeTask?.id;
    const interruptDate = Date.now();
    dispatch({ type: TaskActionTypes.INTERRUPT_TASK });

    if (!taskId) return;

    try {
      await interruptTask(taskId, interruptDate);
    } catch {
      showMessage.error(
        "A tarefa foi interrompida localmente, mas a API falhou",
      );
    }
  }

  return (
    <form onSubmit={handleCreateNewTask} className="form" action="">
      <div className="formRow">
        <DefaultInput
          labelText="task"
          id="meuInput"
          type="text"
          placeholder="Digite algo"
          ref={taskNameInput}
          disabled={!!state.activeTask}
          defaultValue={lastTaskName}
        />
      </div>

      <div className="formRow">
        <Tips />
      </div>

      {state.currentCycle > 0 && (
        <div className="formRow">
          <Cycles />
        </div>
      )}

      <div className="formRow">
        {!state.activeTask && (
          <DefaultButton
            aria-label="Iniciar nova tarefa"
            title="Iniciar nova tarefa"
            type="submit"
            icon={<PlayCircleIcon />}
          />
        )}

        {!!state.activeTask && (
          <DefaultButton
            aria-label="Interromper tarefa atual"
            title="Interromper tarefa atual"
            type="button"
            color="red"
            icon={<StopCircleIcon />}
            onClick={handleInterruptTask}
            key="botao_button"
          />
        )}
      </div>
    </form>
  );
}
```

## 8.4 History integrado com API

Arquivo:

- `src/pages/History/index.tsx`

Mudança:

- Limpar histórico chama `DELETE /tasks`.
- Estado local é limpo com action `CLEAR_TASKS`.

## 8.5 Provider com hidratação inicial e sincronização

```tsx
import { TrashIcon } from "lucide-react";
import { Container } from "../../components/Container";
import { DefaultButton } from "../../components/DefaultButton";
import { Heading } from "../../components/Heading";
import { MainTemplate } from "../../templates/MainTemplate";

import styles from "./styles.module.css";
import { useTaskContext } from "../../contexts/TaskContext/useTaskContext";
import { formatDate } from "../../utils/formatDate";
import { getTaskStatus } from "../../utils/getTaskStatus";
import { sortTasks, type SortTasksOptions } from "../../utils/sortTasks";
import { useEffect, useState } from "react";
import { TaskActionTypes } from "../../contexts/TaskContext/taskActions";
import { showMessage } from "../../adapters/showMessage";
import { clearTasks } from "../../services/api";

export function History() {
  const { state, dispatch } = useTaskContext();
  const [confirmClearHistory, setConfirmClearHistory] = useState(false);
  const hasTasks = state.tasks.length > 0;

  const [sortTasksOptions, setSortTaskOptions] = useState<SortTasksOptions>(
    () => {
      return {
        tasks: sortTasks({ tasks: state.tasks }),
        field: "startDate",
        direction: "desc",
      };
    },
  );

  useEffect(() => {
    setSortTaskOptions((prevState) => ({
      ...prevState,
      tasks: sortTasks({
        tasks: state.tasks,
        direction: prevState.direction,
        field: prevState.field,
      }),
    }));
  }, [state.tasks]);

  useEffect(() => {
    document.title = "Histórico - Chronos Pomodoro";
  }, []);

  useEffect(() => {
    if (!confirmClearHistory) return;

    async function run() {
      try {
        await clearTasks();
        dispatch({ type: TaskActionTypes.CLEAR_TASKS });
      } catch {
        showMessage.error("Não foi possível limpar o histórico na API");
      } finally {
        setConfirmClearHistory(false);
      }
    }

    run();
  }, [confirmClearHistory, dispatch]);

  useEffect(() => {
    return () => {
      showMessage.dismiss();
    };
  }, []);

  function handleSortTasks({ field }: Pick<SortTasksOptions, "field">) {
    const newDirection = sortTasksOptions.direction === "desc" ? "asc" : "desc";

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
    showMessage.dismiss();
    showMessage.confirm("Tem certeza?", (confirmation) => {
      setConfirmClearHistory(confirmation);
    });
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
                color="red"
                aria-label="Apagar todo o histórico"
                title="Apagar histórico"
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
                    onClick={() => handleSortTasks({ field: "name" })}
                    className={styles.thSort}
                  >
                    Tarefa ↕
                  </th>
                  <th
                    onClick={() => handleSortTasks({ field: "duration" })}
                    className={styles.thSort}
                  >
                    Duração ↕
                  </th>
                  <th
                    onClick={() => handleSortTasks({ field: "startDate" })}
                    className={styles.thSort}
                  >
                    Data ↕
                  </th>
                  <th>Status</th>
                  <th>Tipo</th>
                </tr>
              </thead>

              <tbody>
                {sortTasksOptions.tasks.map((task) => {
                  const taskTypeDictionary = {
                    workTime: "Foco",
                    shortBreakTime: "Descanso curto",
                    longBreakTime: "Descanso longo",
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
          <p style={{ textAlign: "center", fontWeight: "bold" }}>
            Ainda não existem tarefas criadas.
          </p>
        )}
      </Container>
    </MainTemplate>
  );
}
```

Arquivo:

- `src/contexts/TaskContext/TaskContextProvider.tsx`

Mudança:

- Na inicialização: busca `settings` e `tasks` da API.
- Sincroniza conclusão de tarefas com `PATCH /tasks/:id/complete`.
- Mantém fallback local se API indisponível.

```tsx
import { useEffect, useReducer, useRef } from "react";
import { initialTaskState } from "./initialTaskState";
import { taskReducer } from "./taskReducer";
import { TaskContext } from "./TaskContext";
import { TimerWorkerManager } from "../../workers/TimerWorkerManager";
import { TaskActionTypes } from "./taskActions";
import { loadBeep } from "../../utils/loadBeep";
import type { TaskStateModel } from "../../models/TaskStateModel";
import { completeTask, getSettings, getTasks } from "../../services/api";

type TaskContextProviderProps = {
  children: React.ReactNode;
};

export function TaskContextProvider({ children }: TaskContextProviderProps) {
  const [state, dispatch] = useReducer(taskReducer, initialTaskState, () => {
    const storageState = localStorage.getItem("state");

    if (storageState === null) return initialTaskState;

    const parsedStorageState = JSON.parse(storageState) as TaskStateModel;

    return {
      ...parsedStorageState,
      activeTask: null,
      secondsRemaining: 0,
      formattedSecondsRemaining: "00:00",
    };
  });

  const playBeepRef = useRef<ReturnType<typeof loadBeep> | null>(null);
  const syncedCompletionIdsRef = useRef<Set<string>>(new Set());

  const worker = TimerWorkerManager.getInstance();

  useEffect(() => {
    worker.onmessage((e) => {
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
    localStorage.setItem("state", JSON.stringify(state));

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

  useEffect(() => {
    async function hydrateFromApi() {
      try {
        const [apiSettings, apiTasks] = await Promise.all([
          getSettings(),
          getTasks(),
        ]);

        dispatch({
          type: TaskActionTypes.CHANGE_SETTINGS,
          payload: {
            workTime: apiSettings.workTime,
            shortBreakTime: apiSettings.shortBreakTime,
            longBreakTime: apiSettings.longBreakTime,
          },
        });
        dispatch({ type: TaskActionTypes.HYDRATE_TASKS, payload: apiTasks });

        syncedCompletionIdsRef.current = new Set(
          apiTasks
            .filter((task) => task.completeDate !== null)
            .map((task) => task.id),
        );
      } catch {
        // Se a API estiver indisponível, mantém funcionamento local.
      }
    }

    hydrateFromApi();
  }, []);

  useEffect(() => {
    const tasksToSync = state.tasks.filter(
      (task) =>
        task.completeDate !== null &&
        !syncedCompletionIdsRef.current.has(task.id),
    );

    tasksToSync.forEach((task) => {
      if (task.completeDate === null) return;
      syncedCompletionIdsRef.current.add(task.id);
      completeTask(task.id, task.completeDate).catch(() => {
        syncedCompletionIdsRef.current.delete(task.id);
      });
    });
  }, [state.tasks]);

  return (
    <TaskContext.Provider value={{ state, dispatch }}>
      {children}
    </TaskContext.Provider>
  );
}
```

## 8.6 Novas actions no estado global

Arquivos:

- `src/contexts/TaskContext/taskActions.ts`
- `src/contexts/TaskContext/taskReducer.ts`

Actions adicionadas:

- `CLEAR_TASKS`
- `HYDRATE_TASKS`

---

taskActions.ts

```tsx
// useReducer <- hook do React que recebe um reducer e um estado inicial
// reducer <- função que recebe o estado atual e uma ação, e retorna o novo estado
// state <- o estado atual
// action <- a ação disparada, geralmente é um objeto com type e (opcionalmente) payload
// type <- o tipo da ação, geralmente uma string (pode ser enum, constante, etc)
// payload <- os dados extras enviados junto com a action, se necessário para atualizar o estado

import type { TaskModel } from "../../models/TaskModel";
import type { TaskStateModel } from "../../models/TaskStateModel";

// 1. Trocamos 'enum' por um objeto literal com 'as const'
export const TaskActionTypes = {
  START_TASK: "START_TASK",
  INTERRUPT_TASK: "INTERRUPT_TASK",
  RESET_STATE: "RESET_STATE",
  CLEAR_TASKS: "CLEAR_TASKS",
  HYDRATE_TASKS: "HYDRATE_TASKS",
  COUNT_DOWN: "COUNT_DOWN",
  COMPLETE_TASK: "COMPLETE_TASK",
  CHANGE_SETTINGS: "CHANGE_SETTINGS",
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
      payload: TaskStateModel["config"];
    }
  | {
      type: typeof TaskActionTypes.HYDRATE_TASKS;
      payload: TaskModel[];
    };

export type TaskActionsWithoutPayload =
  | {
      type: typeof TaskActionTypes.RESET_STATE;
    }
  | {
      type: typeof TaskActionTypes.CLEAR_TASKS;
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
```

taskReducer.ts

```tsx
import type { TaskStateModel } from "../../models/TaskStateModel";
import { formatSecondsToMinutes } from "../../utils/formatSecondsToMinutes";
import { getNextCycle } from "../../utils/getNextCycle";
import { initialTaskState } from "./initialTaskState";
import { TaskActionTypes, type TaskActionModel } from "./taskActions";

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
        formattedSecondsRemaining: "00:00",
        tasks: state.tasks.map((task) => {
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
        formattedSecondsRemaining: "00:00",
        tasks: state.tasks.map((task) => {
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
    case TaskActionTypes.CLEAR_TASKS: {
      return {
        ...state,
        tasks: [],
        activeTask: null,
        secondsRemaining: 0,
        formattedSecondsRemaining: "00:00",
        currentCycle: 0,
      };
    }
    case TaskActionTypes.HYDRATE_TASKS: {
      return {
        ...state,
        tasks: action.payload,
        activeTask: null,
        secondsRemaining: 0,
        formattedSecondsRemaining: "00:00",
        currentCycle: action.payload.length,
      };
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
    case TaskActionTypes.CHANGE_SETTINGS: {
      return { ...state, config: { ...action.payload } };
    }
  }

  // Sempre deve retornar o estado
  return state;
}
```

## 9) Variável do frontend para URL da API

Arquivo:

- `chronos-pomodoro/.env.example`

Conteúdo:

```env
VITE_API_URL=http://localhost:3333
```

Se não definir `VITE_API_URL`, o frontend usa fallback para `http://localhost:3333`.

---

## 10) Roteiro de testes no Postman

Crie um Environment chamado `Chronos Local`:

- `baseUrl = http://localhost:3333`
- `taskId =` (vazio inicialmente)

## Ordem de testes

1. `GET {{baseUrl}}/health`
2. `GET {{baseUrl}}/settings`
3. `PUT {{baseUrl}}/settings`
4. `POST {{baseUrl}}/tasks`
5. `PATCH {{baseUrl}}/tasks/{{taskId}}/complete`
6. `GET {{baseUrl}}/tasks`
7. `DELETE {{baseUrl}}/tasks`
8. `GET {{baseUrl}}/tasks` (confirmar vazio)

## Payloads sugeridos

### PUT /settings

```json
{
  "workTime": 30,
  "shortBreakTime": 10,
  "longBreakTime": 20
}
```

### POST /tasks

```json
{
  "id": "{{$timestamp}}",
  "name": "Task via Postman",
  "duration": 30,
  "type": "workTime",
  "startDate": {{$timestamp}}
}
```

### PATCH /tasks/:id/complete

```json
{
  "completeDate": {{$timestamp}}
}
```

### PATCH /tasks/:id/interrupt (alternativo)

```json
{
  "interruptDate": {{$timestamp}}
}
```

## Script de teste no Postman para salvar `taskId`

Na request de `POST /tasks`, aba **Tests**:

```javascript
const json = pm.response.json();
pm.environment.set("taskId", json.id);
```

---

## 11) Troubleshooting

## Prisma P1000 (credencial inválida)

Erro:

`Authentication failed against database server`

Ação:

- Revisar `DATABASE_URL` no `.env`
- Confirmar usuário/senha do MySQL

## Porta ocupada (EADDRINUSE)

Erro:

`listen EADDRINUSE :::3333`

Ação:

- Fechar processo anterior da API
- Ou trocar `PORT` no `.env`

## Falha ao serializar BigInt

Erro:

`Do not know how to serialize a BigInt`

Ação:

- Garantir serialização para `string` nos retornos de `Task`.

---

## 12) Comandos úteis

```bash
# API
npm run dev
npm run build

# Prisma
npm run prisma:migrate -- --name init
npm run prisma:generate
npm run prisma:studio
```

---

## 13) Status atual

Checklist de conclusão:

- [x] API Express criada
- [x] Prisma + MySQL configurados
- [x] Migration aplicada
- [x] Endpoints de settings/tasks funcionando
- [x] Frontend integrado com API
- [x] Roteiro Postman documentado
