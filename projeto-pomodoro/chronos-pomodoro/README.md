# ☁️ Criando a Context API e o Provider

Nesta aula, vamos construir a base do nosso Estado Global usando a **Context
API**. Em vez de usar o Contexto "cru" diretamente nos componentes, vamos seguir
as melhores práticas do mercado: criaremos um componente _Provider_ dedicado e
um _Custom Hook_ (Hook customizado) para facilitar o acesso aos dados.

Vamos fazer tudo em um arquivo só por enquanto para fins didáticos, mas não se
assuste com o erro de _Fast Refresh_ no console — nós separaremos os arquivos no
futuro!

---

## 🏗️ 1. O Arquivo do Contexto (`TaskContext.tsx`)

Crie uma pasta `contexts` dentro de `src` e crie o arquivo `TaskContext.tsx`.
Este arquivo fará três coisas:

1. Definir o tipo (formato) do nosso contexto.
2. Criar o Contexto em si.
3. Criar o componente `TaskContextProvider` (que será o "Pai de Todos").
4. Criar o Hook `useTaskContext` (que será usado pelos Filhos para acessar os
   dados).

**Arquivo:** `src/contexts/TaskContext.tsx`

```tsx
import { createContext, useContext } from 'react';
import type { TaskStateModel } from '../models/TaskStateModel';

// 1. Tipagem do Contexto: Ele terá o `state` e a função `setState`
export type TaskContextProps = {
  state: TaskStateModel;
  setState: React.Dispatch<React.SetStateAction<TaskStateModel>>;
};

// 2. Criando o Valor Inicial "Fake"
// (Isso é usado apenas se tentarmos acessar o contexto FORA do Provider, o que não faremos)
const initialContextValue: TaskContextProps = {
  state: {
    tasks: [],
    secondsRemaining: 0,
    formattedSecondsRemaining: '00:00',
    activeTask: null,
    currentCycle: 0,
    config: { workTime: 25, shortBreakTime: 5, longBreakTime: 15 },
  },
  setState: () => {}, // Função vazia de placeholder
};

// 3. Criando o Contexto em si
export const TaskContext = createContext<TaskContextProps>(initialContextValue);

// ==========================================

// 4. Criando o Componente Provider (O "Pai de Todos")
type TaskContextProviderProps = {
  children: React.ReactNode;
};

export function TaskContextProvider({ children }: TaskContextProviderProps) {
  // Por enquanto, vamos passar o valor falso (initialContextValue)
  // Na próxima aula, traremos o `useState` REAL para cá!
  return (
    <TaskContext.Provider value={initialContextValue}>
      {children}
    </TaskContext.Provider>
  );
}

// ==========================================

// 5. Criando o Custom Hook (Para os "Filhos" usarem)
export function useTaskContext() {
  return useContext(TaskContext);
}
```

## 🌍 2. Envolvendo a Aplicação com o Provider (`App.tsx`)

Agora, vamos voltar ao `App.tsx`. Precisamos dizer que tudo o que está dentro do
`App` tem acesso à nossa nuvem de dados. Para isso, "abraçamos" a `<Home />` com
o nosso novo `TaskContextProvider`.

**Arquivo:** `src/App.tsx`

```tsx
import { Home } from './pages/Home';
import { useState } from 'react';
import type { TaskStateModel } from './models/TaskStateModel';

// Importamos o nosso novo Provider
import { TaskContextProvider } from './contexts/TaskContext';

import './styles/theme.css';
import './styles/global.css';

const initialState: TaskStateModel = {
  // ... (mantenha o initialState aqui por enquanto)
};

export function App() {
  const [state, setState] = useState(initialState);

  // Abraçamos a Home com o Provider!
  return (
    <TaskContextProvider>
      <Home />
    </TaskContextProvider>
  );
}
```

## 📥 3. Consumindo a Nuvem no Componente Filho (`CountDown.tsx`)

Chegou a hora mágica. Vamos até um componente que está lá no fundo da árvore
(Nível 3) e vamos acessar os dados do contexto **diretamente**, sem precisar
pedir para a `Home`!

Usaremos o nosso Custom Hook `useTaskContext`.

**Arquivo:** `src/components/CountDown/index.tsx`

```tsx
import styles from './styles.module.css';

// Importamos APENAS o nosso Hook customizado!
import { useTaskContext } from '../../contexts/TaskContext';

export function CountDown() {
  // Pegamos a "nuvem" inteira
  const taskContext = useTaskContext();

  // Vamos dar um console.log para provar que a mágica aconteceu
  console.log(taskContext);

  return <div className={styles.container}>00:00</div>;
}
```

## 🎯 O que provamos hoje?

Abra o console do seu navegador. Você verá que o `CountDown` conseguiu imprimir
o objeto completo (`state` e `setState`)! Ele buscou essa informação diretamente
do `TaskContextProvider` que está lá no `App.tsx`, passando reto pela `Home`.

**O Problema Atual:** Se você reparar, o valor que está chegando no `CountDown`
é o nosso valor falso (`initialContextValue` que definimos no passo 2), e não o
estado real que está vivendo no `App.tsx`.
