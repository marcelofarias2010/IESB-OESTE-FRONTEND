# Tarefa: persistir o estado no `localStorage` e reidratar com “timer zerado”

## Objetivo

Salvar o **`TaskStateModel` inteiro** no **`localStorage`** sempre que o estado mudar (como já fazemos com o **tema**). Ao recarregar a página, **reidratar** o estado a partir da string salva.

**Importante:** ao voltar do `localStorage`, **não** restaurar tarefa ativa nem contador em andamento — isso evita o timer “continuar” após F5 e bugs com worker/áudio. O histórico de `tasks`, `currentCycle`, `config`, etc. permanece.

Na narrativa do produto: se o usuário atualizar a página no meio de um ciclo, a tarefa pode ser tratada como **abandonada** (fica no histórico sem `completeDate`/`interruptDate` adequados — refinamento nas próximas aulas).

## Conceitos

| Ideia | O que é |
|-------|---------|
| **Salvar** | `localStorage.setItem('state', JSON.stringify(state))` quando `state` muda. |
| **Reidratar** | Na inicialização do `useReducer`, ler a string, fazer `JSON.parse`, devolver objeto tipado como `TaskStateModel`. |
| **Inicialização “preguiçosa”** | O **terceiro argumento** de `useReducer` é uma função executada **uma vez** — ideal para ler `localStorage` sem repetir trabalho a cada render. |
| **Reset ao reidratar** | Sobrescrever `activeTask`, `secondsRemaining` e `formattedSecondsRemaining` para o app voltar “parado” após reload. |

## Passo 1 — Chave no `localStorage`

Use uma chave fixa, por exemplo **`state`** (como no código atual). No DevTools → **Application** → **Local Storage**, você verá o JSON da aplicação.

## Passo 2 — Salvar sempre que o estado mudar

No `TaskContextProvider`, dentro de um `useEffect` que depende de **`[worker, state]`** (ou só `[state]`, conforme sua organização), persista:

```ts
localStorage.setItem('state', JSON.stringify(state));
```

O restante desse efeito (worker, `document.title`, etc.) pode ficar no mesmo bloco que você já usa.

## Passo 3 — `useReducer` com função inicializadora (lazy init)

Terceiro parâmetro de `useReducer`:

```ts
useReducer(taskReducer, initialTaskState, () => { ... });
```

Dentro da função:

1. `const storageState = localStorage.getItem('state');`
2. Se for `null`, retorne **`initialTaskState`**.
3. Caso contrário, `JSON.parse(storageState) as TaskStateModel`.
4. Retorne um objeto com **spread** do parseado, mas **forçando**:

   - `activeTask: null`
   - `secondsRemaining: 0`
   - `formattedSecondsRemaining: '00:00'`

Assim o reload não reativa timer nem tarefa “em progresso” de forma inconsistente.

**Opcional:** envolver `JSON.parse` em `try/catch` e, em caso de JSON inválido, retornar `initialTaskState`.

## Código-fonte atual — `src/contexts/TaskContext/TaskContextProvider.tsx`

```tsx
import { useEffect, useReducer, useRef } from 'react';
import { initialTaskState } from './initialTaskState';
import { taskReducer } from './taskReducer';
import { TaskContext } from './TaskContext';
import { TimerWorkerManager } from '../../workers/TimerWorkerManager';
import { TaskActionTypes } from './taskActions';
import { loadBeep } from '../../utils/loadBeep';
import type { TaskStateModel } from '../../models/TaskStateModel';

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
```

## Como validar

1. Crie tarefas, altere tema, navegue — confira `localStorage.state` no DevTools.
2. Dê **F5** com timer rodando: o contador deve **não** continuar de onde parou; lista de `tasks` e configuração devem persistir.
3. Limpe só a chave `state` (ou todo o storage do site) e recarregue: app volta ao estado inicial sem erro.
4. Tema salvo separadamente (`theme`) continua funcionando independente.

## Próximos passos (fora desta tarefa)

- Página de **histórico** e **configurações**.
- Marcar tarefas como **abandonadas** quando fizer sentido no modelo de negócio.
- Botão para limpar só o estado do Pomodoro sem apagar o tema.

## Checklist

- [ ] `localStorage.setItem('state', JSON.stringify(state))` em efeito que reage ao `state`.
- [ ] `useReducer` com função inicializadora lendo e parseando `state`.
- [ ] Após parse, zerar `activeTask`, `secondsRemaining` e `formattedSecondsRemaining`.
- [ ] Teste de F5 e de storage vazio.
