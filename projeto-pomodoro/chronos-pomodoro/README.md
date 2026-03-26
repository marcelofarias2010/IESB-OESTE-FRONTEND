# 🗂️ Organizando a Casa: Separando o Contexto em Arquivos

Colocar tudo em um arquivo só foi ótimo para entendermos como as engrenagens da
Context API se conectam. Mas, na vida real (e para o Vite parar de reclamar no
console), precisamos separar as responsabilidades.

Vamos "fatiar" aquele nosso arquivo gigante do contexto em quatro arquivos
menores e mais focados.

---

## ✂️ 1. O Estado Inicial (`InitialTaskState.ts`)

Vamos isolar o objeto que define como o nosso estado começa. Como este arquivo
não tem JSX (não renderiza HTML), a extensão é apenas `.ts`.

**Arquivo:** `src/contexts/InitialTaskState.ts` _(ou na pasta models/onde
preferir, seguindo a aula)_

```typescript
import type { TaskStateModel } from '../models/TaskStateModel';

export const initialTaskState: TaskStateModel = {
  tasks: [],
  secondsRemaining: 0,
  formattedSecondsRemaining: '00:00',
  activeTask: null,
  currentCycle: 0,
  config: {
    workTime: 25,
    shortBreakTime: 5,
    longBreakTime: 15,
  },
};
```

## 🧠 2. A Criação do Contexto (`TaskContext.ts`)

Aqui vai ficar apenas a tipagem e a criação do contexto em si. Novamente, sem
JSX, então usamos a extensão `.ts`.

**Arquivo:** `src/contexts/TaskContext.ts`

```tsx
import { createContext } from 'react';
import type { TaskStateModel } from '../models/TaskStateModel';
import { initialTaskState } from './InitialTaskState';

export type TaskContextProps = {
  state: TaskStateModel;
  setState: React.Dispatch<React.SetStateAction<TaskStateModel>>;
};

const initialContextValue = {
  state: initialTaskState,
  setState: () => {},
};

export const TaskContext = createContext<TaskContextProps>(initialContextValue);
```

## 🛡️ 3. O Componente Provider (`TaskContextProvider.tsx`)

Este é o componente que vai "abraçar" a aplicação e fornecer o useState de
verdade. Como ele retorna JSX (o `<TaskContext.Provider>`), a extensão precisa
ser `.tsx`.

**Arquivo:** `src/contexts/TaskContextProvider.tsx`

```tsx
import { useState } from 'react';
import { TaskContext } from './TaskContext';
import { initialTaskState } from './InitialTaskState';

type TaskContextProviderProps = {
  children: React.ReactNode;
};

export function TaskContextProvider({ children }: TaskContextProviderProps) {
  const [state, setState] = useState(initialTaskState);

  return (
    <TaskContext.Provider value={{ state, setState }}>
      {children}
    </TaskContext.Provider>
  );
}
```

## 🪝 4. O Custom Hook (`useTaskContext.ts`)

Por fim, o atalho para os componentes filhos consumirem o contexto.

**Arquivo:** `src/contexts/useTaskContext.ts`

```tsx
import { useContext } from 'react';
import { TaskContext } from './TaskContext';

export function useTaskContext() {
  return useContext(TaskContext);
}
```

## 🧹 5. Limpando a Bagunça do Formulário (`MainForm.tsx`)

Aquele botão de teste ("Alterar para 21:00") cumpriu seu papel, mas agora é hora
de voltar ao mundo real. Vamos apagá-lo e preparar a função real que vai lidar
com o envio do formulário (`onSubmit`).

**Arquivo:** `src/components/MainForm/index.tsx`

```tsx
import { PlayCircleIcon } from 'lucide-react';
import { Cycles } from '../Cycles';
import { DefaultButton } from '../DefaultButton';
import { DefaultInput } from '../DefaultInput';
import { useTaskContext } from '../../contexts/useTaskContext'; // <-- Atualize a importação!

export function MainForm() {
  // Já deixamos o Hook preparado aqui, usaremos em breve
  const { setState } = useTaskContext();

  // Função que vai interceptar o recarregamento da página ao enviar o form
  function handleCreateNewTask(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log('DEU CERTO');
  }

  return (
    <form onSubmit={handleCreateNewTask} className='form' action=''>
      <div className='formRow'>
        <DefaultInput
          labelText='task'
          id='meuInput'
          type='text'
          placeholder='Digite algo'
        />
      </div>

      <div className='formRow'>
        <p>Próximo intervalo é de 25min</p>
      </div>

      <div className='formRow'>
        <Cycles />
      </div>

      <div className='formRow'>
        <DefaultButton icon={<PlayCircleIcon />} />
      </div>
    </form>
  );
}
```

## 🔌 6. Corrigindo as Importações no `App` e no `CountDown`

Como mudamos os arquivos de lugar, não se esqueça de atualizar as importações (o
VS Code geralmente ajuda com isso se você apagar o caminho e digitar de novo).

**No** `src/App.tsx:`

```tsx
// Atualize para puxar do arquivo específico do Provider
import { TaskContextProvider } from './contexts/TaskContextProvider';
```

**No** `src/components/CountDown/index.tsx:`

```tsx
// Atualize para puxar do arquivo específico do Hook
import { useTaskContext } from '../../contexts/useTaskContext';
```

## 🎯 Conclusão

Pronto! Seu terminal deve estar livre de erros, o _Fast Refresh_ voltou a
funcionar perfeitamente e a nossa base arquitetural está impecável.

A partir de agora, não teremos mais dados falsos de teste: vamos começar a
construir a lógica real da nossa aplicação Pomodoro!
