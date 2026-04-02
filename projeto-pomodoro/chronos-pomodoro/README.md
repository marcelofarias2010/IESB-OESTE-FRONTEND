## 🧹 Hora da Faxina: Organizando o Contexto em Múltiplos Arquivos

Se você olhou para o nosso arquivo de contexto na última aula e pensou "_nossa,
tem muita coisa acontecendo num lugar só_", você tem toda a razão!

Para manter o nosso projeto escalável e profissional, vamos aplicar o princípio
de responsabilidade única. Isso significa pegar aquele "arquivão" e dividi-lo em
pedaços menores, onde cada arquivo faz exatamente uma única coisa.

Vamos criar quatro arquivos separados dentro da nossa pasta
`src/contexts/TaskContext`. Acompanhe o passo a passo:

## 📦 1. Separando o Estado Inicial (`initialTaskState.ts`)

Como esse arquivo conterá apenas um objeto puro e nenhuma interface visual, a
extensão será apenas `.ts` (sem o `x`).

Crie o arquivo e mova o nosso objeto de estado inicial para lá:

**Arquivo:** `src/contexts/TaskContext/initialTaskState.ts`

```tsx
import type { TaskStateModel } from '../../models/TaskStateModel';

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

## 🪢 2. Separando a Criação do Contexto (`TaskContext.ts`)

Aqui vai ficar apenas a tipagem do contexto e a inicialização dele com o
`createContext`. Novamente, como não temos JSX, usamos a extensão `.ts`.

**Arquivo:** `src/contexts/TaskContext/TaskContext.ts`

```tsx
import { createContext } from 'react';
import type { TaskStateModel } from '../../models/TaskStateModel';
import { initialTaskState } from './initialTaskState';

type TaskContextProps = {
  state: TaskStateModel;
  setState: React.Dispatch<React.SetStateAction<TaskStateModel>>;
};

const initialContextValue = {
  state: initialTaskState,
  setState: () => {},
};

export const TaskContext = createContext<TaskContextProps>(initialContextValue);
```

## 🚀 3. Separando o Provider (`TaskContextProvider.tsx`)

O Provider é um componente React de verdade que engloba os nossos `children`,
então a extensão dele precisa ser `.tsx`. Ele vai importar o contexto e o estado
inicial que acabamos de separar.

**Arquivo:** `src/contexts/TaskContext/TaskContextProvider.tsx`

```tsx
import { useState } from 'react';
import { initialTaskState } from './initialTaskState';
import { TaskContext } from './TaskContext';

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

## 🎣 4. Separando o Hook Customizado (`useTaskContext.ts`)

Por fim, vamos isolar o nosso hook. Ele facilita o consumo do nosso contexto nos
outros componentes.

**Arquivo:** `src/contexts/TaskContext/useTaskContext.ts`

```tsx
import { useContext } from 'react';
import { TaskContext } from './TaskContext';

export function useTaskContext() {
  return useContext(TaskContext);
}
```

## 🔄 5. Atualizando os Imports

Agora que mudamos a casa de todo mundo, você vai notar que os seus componentes
`CountDown` e `MainForm` (e possivelmente o App ou onde você colocou o Provider)
vão ficar com as importações quebradas.

Basta ir nesses arquivos, apagar as importações antigas e puxar novamente do
local correto. Por exemplo, no seu `CountDown`, o import ficará assim:

```tsx
import { useTaskContext } from '../../contexts/TaskContext/useTaskContext';
// ...
```

_(Obs: Aproveitei para remover aquele botão de teste do `MainForm` no código
final que você tem no repositório, deixando o formulário limpo novamente)._

Com essa refatoração, nosso código está muito mais limpo, fácil de ler e pronto
para crescer. Agora que o terreno está perfeitamente organizado, você está
pronto para finalmente começarmos a migrar esse nosso `useState` para a magia e
o poder do useReducer na próxima aula?
