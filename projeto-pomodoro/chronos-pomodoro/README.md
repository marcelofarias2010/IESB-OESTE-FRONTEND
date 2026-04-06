## 🚀 O Grande Momento: Migrando de `useState` para `useReducer` na Prática

Chegou a hora de juntar todas as peças! Nós preparamos o terreno, criamos nossas
Actions super seguras com TypeScript e agora vamos finalmente plugar o
`useReducer` na nossa aplicação.

O grande benefício que você vai notar aqui é a separação de responsabilidades: o
componente só avisa o que aconteceu (fazendo o `dispatch`), e o Reducer decide
como o estado deve ser alterado.

Vamos passo a passo!

## 🔌 1. Atualizando o Provider e o Contexto

Primeiro, vamos ao nosso arquivo principal de estado. Vamos nos despedir do
`useState` e dar as boas-vindas ao useReducer. Como mudamos a ferramenta, a
tipagem do nosso contexto também muda de `setState` para `dispatch`.

**Arquivo:** `src/contexts/TaskContext/TaskContext.ts`

```tsx
import { createContext, type Dispatch } from 'react';
import { initialTaskState } from './initialTaskState';
import type { TaskStateModel } from '../../models/TaskStateModel';
import type { TaskActionModel } from './taskActions';

type TaskContextProps = {
  state: TaskStateModel;
  // Sai o setState, entra o dispatch tipado com as nossas actions!
  dispatch: Dispatch<TaskActionModel>;
};

const initialContextValue = {
  state: initialTaskState,
  dispatch: () => {},
};

export const TaskContext = createContext<TaskContextProps>(initialContextValue);
```

**Arquivo:** `src/contexts/TaskContext/TaskContextProvider.tsx`

```tsx
import { useEffect, useReducer } from 'react';
import { initialTaskState } from './initialTaskState';
import { taskReducer } from './taskReducer';
import { TaskContext } from './TaskContext';

type TaskContextProviderProps = {
  children: React.ReactNode;
};

export function TaskContextProvider({ children }: TaskContextProviderProps) {
  // A mágica acontece aqui: usamos o reducer que vamos criar a seguir
  const [state, dispatch] = useReducer(taskReducer, initialTaskState);

  useEffect(() => {
    console.log(state);
  }, [state]);

  return (
    <TaskContext.Provider value={{ state, dispatch }}>
      {children}
    </TaskContext.Provider>
  );
}
```

## 🧠 2. Centralizando a Lógica no Reducer

Antes, a lógica de calcular o próximo ciclo, converter segundos e criar as
tarefas ficava poluindo o nosso formulário. Agora, toda essa inteligência mora
dentro do `taskReducer`.

O Reducer recebe a ação (`START_TASK` ou `INTERRUPT_TASK`) e aplica a mudança no
estado de forma pura.

**Arquivo:** `src/contexts/TaskContext/taskReducer.ts`

```tsx
import type { TaskStateModel } from '../../models/TaskStateModel';
import { formatSecondsToMinutes } from '../../utils/formatSecondsToMinutes';
import { getNextCycle } from '../../utils/getNextCycle';
import { TaskActionTypes, type TaskActionModel } from './taskActions';

export function taskReducer(
  state: TaskStateModel,
  action: TaskActionModel,
): TaskStateModel {
  switch (action.type) {
    case TaskActionTypes.START_TASK: {
      const newTask = action.payload; // O TS sabe que existe payload aqui!
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
          // Marca a data de interrupção na tarefa ativa
          if (state.activeTask && state.activeTask.id === task.id) {
            return { ...task, interruptDate: Date.now() };
          }
          return task;
        }),
      };
    }
    case TaskActionTypes.RESET_STATE: {
      return state;
    }
  }

  return state;
}
```

## 🧹 3. Limpando o Componente (MainForm)

Agora que o Reducer faz o trabalho pesado, olha como o nosso componente fica
mais limpo! Ele apenas coleta os dados do input, monta o objeto `newTask` e
despacha (`dispatch`) a ação para o contexto.

**Arquivo:** `src/components/MainForm/index.tsx `(trechos principais)

```tsx
// ... imports omitidos

export function MainForm() {
  const { state, dispatch } = useTaskContext();
  const taskNameInput = useRef<HTMLInputElement>(null);

  // ... lógica de getNextCycleType omitida

  function handleCreateNewTask(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (taskNameInput.current === null) return;

    const taskName = taskNameInput.current.value.trim();
    if (!taskName) {
      alert('Digite o nome da tarefa');
      return;
    }

    const newTask: TaskModel = {
      id: Date.now().toString(),
      name: taskName,
      startDate: Date.now(),
      completeDate: null,
      interruptDate: null,
      duration: 1, // Vamos arrumar isso em breve!
      type: nextCyleType,
    };

    // Disparamos a ação com o payload!
    dispatch({ type: TaskActionTypes.START_TASK, payload: newTask });
  }

  function handleInterruptTask() {
    // Disparamos a ação sem payload!
    dispatch({ type: TaskActionTypes.INTERRUPT_TASK });
  }

  // ... return do JSX omitido
```

## 💡 Dica Pro: Funções Helper para o Dispatch

Se o seu `dispatch` ficar muito repetitivo ou complexo ao longo do projeto, um
padrão muito comum no mercado é criar funções separadas (Action Creators) que
retornam o objeto do `dispatch`. Mas, para o tamanho da nossa aplicação atual,
chamar o dispatch diretamente no componente é a abordagem mais direta e
recomendada para não adicionarmos complexidade desnecessária.

**✅ Teste Final** Atualize a página e teste a criação e interrupção de tarefas.
Tudo deve estar funcionando perfeitamente, exatamente como antes, mas agora
rodando em cima de uma arquitetura super robusta, tipada e escalável com
`useReducer`!
