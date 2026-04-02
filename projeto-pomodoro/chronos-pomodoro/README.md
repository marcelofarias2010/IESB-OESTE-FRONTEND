## 🚀 Unindo Forças: Context API + `useState`

Agora que a nossa estrutura base está praticamente pronta, chegou a hora de dar
um "superpoder" para a nossa aplicação.

Até agora, nós tínhamos o estado (`useState`) morando no componente principal e
precisávamos ficar repassando essas informações (prop drilling) componente por
componente. O que vamos fazer agora é **combinar o** `useState` **com o
nosso**`Contexto`.

Dessa forma, o Contexto servirá como um "alto-falante" para passar os valores
para todos os componentes, e o `useState` será o cérebro que mantém o estado
atualizado lá dentro.

## 🛠️ 1. Movendo o Estado para o Provider

A primeira coisa a fazer é "limpar" o componente principal `(App)` e mover a
responsabilidade de gerenciar o estado para dentro do nosso
`TaskContextProvider`. É por isso que é tão importante envolver nossa aplicação
com esse Provider!

Arquivo: `src/contexts/TaskContext/index.tsx`

```tsx
import { createContext, useContext, useState } from 'react';
import type { TaskStateModel } from '../../models/TaskStateModel';

const initialState: TaskStateModel = {
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

type TaskContextProps = {
  state: TaskStateModel;
  setState: React.Dispatch<React.SetStateAction<TaskStateModel>>;
};

// Valor inicial de fallback (caso alguém use o contexto fora do provider)
const initialContextValue = {
  state: initialState,
  setState: () => {},
};

export const TaskContext = createContext<TaskContextProps>(initialContextValue);

type TaskContextProviderProps = {
  children: React.ReactNode;
};

export function TaskContextProvider({ children }: TaskContextProviderProps) {
  // O Estado agora mora DENTRO do Provider!
  const [state, setState] = useState(initialState);

  return (
    // Passamos tanto o state quanto a função de atualizar (setState) para todos os filhos
    <TaskContext.Provider value={{ state, setState }}>
      {children}
    </TaskContext.Provider>
  );
}

// Hook customizado para facilitar o uso
export function useTaskContext() {
  return useContext(TaskContext);
}
```

## ⏱️ 2. Consumindo o Estado no Relógio

Agora que o Provider está distribuindo o estado, qualquer componente pode
pegá-lo facilmente usando o nosso hook customizado `useTaskContext`. Vamos ver
isso na prática no nosso relógio.

Não precisamos mais receber props. O componente se conecta diretamente ao
contexto!

**Arquivo:** `src/components/CountDown/index.tsx`

```tsx
import styles from './styles.module.css';
import { useTaskContext } from '../../contexts/TaskContext';

export function CountDown() {
  // Puxamos apenas o 'state' de dentro do nosso contexto
  const { state } = useTaskContext();

  return (
    <div className={styles.container}>{state.formattedSecondsRemaining}</div>
  );
}
```

_Se você testar agora e mudar o valor inicial de `formattedSecondsRemaining` lá
no seu initialState (ex: para '21:00'), verá que o relógio na tela atualiza
automaticamente!_

## ⚡ 3. Atualizando o Estado de Longe (MainForm)

Para provar que nosso estado global realmente funciona, vamos criar um botão de
teste no formulário. A ideia é: clicar em um botão num componente (`MainForm`) e
ver a alteração refletir instantaneamente em outro (`CountDown`).

**Arquivo:** `src/components/MainForm/index.tsx`

```tsx
import { PlayCircleIcon } from 'lucide-react';
import { Cycles } from '../Cycles';
import { DefaultButton } from '../DefaultButton';
import { DefaultInput } from '../DefaultInput';
import { useTaskContext } from '../../contexts/TaskContext';

export function MainForm() {
  // Puxamos a função 'setState' do contexto
  const { setState } = useTaskContext();

  function handleCreateNewTask(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log('DEU CERTO');
  }

  // Função de teste para atualizar o estado global
  function handleClick() {
    setState(prevState => {
      return {
        ...prevState,
        formattedSecondsRemaining: '21:00', // Força o relógio a mostrar 21:00
      };
    });
  }

  return (
    <form onSubmit={handleCreateNewTask} className='form' action=''>
      {/* Botão de teste */}
      <button onClick={handleClick} type='button'>
        Clicar
      </button>

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

## ✅ Faça o Teste!

Vá até o navegador, atualize a página (o relógio mostrará `00:00`). Clique no
botão "Clicar" que acabamos de criar. Magicamente, o relógio mudará para
`21:00`!

Isso confirma que o nosso estado está totalmente globalizado e acessível. O
componente A conversa com o componente B perfeitamente através do Contexto.

Na próxima aula, vamos dar uma organizada geral nos arquivos para que nosso
projeto fique mais limpo e profissional, separando o que precisa ser separado.
