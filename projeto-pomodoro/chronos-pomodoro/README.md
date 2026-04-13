# Tarefa: contador na UI — ações `COUNT_DOWN` e `COMPLETE_TASK`

## Objetivo

Fazer o **countdown visível** na aplicação: a cada tick o worker manda os **segundos restantes**; o **Provider** dá **`dispatch`** para atualizar `secondsRemaining` e `formattedSecondsRemaining`. Quando o valor chega em **0 ou menos**, **não** se dispara mais `COUNT_DOWN` — só **`COMPLETE_TASK`**, que zera o estado ativo, marca **`completeDate`** na tarefa e encerra o worker, igual ao fluxo de “timer acabou”.

## Contexto da aula

- **`postMessage` no `TimerWorkerManager`:** tipar como `TaskStateModel` (o estado completo que já vai para o worker).
- **`COUNT_DOWN`:** precisa de **payload** com os segundos (ex.: `{ secondsRemaining: number }`). Dá para amarrar ao tipo do estado com `Pick<TaskStateModel, 'secondsRemaining'>`, mas um tipo explícito com uma propriedade `secondsRemaining: number` é equivalente e simples.
- **`COMPLETE_TASK`:** **sem payload**, como `INTERRUPT_TASK` — quem manda é o estado atual (`activeTask` no reducer).
- **Um `dispatch` por mensagem:** se no `onmessage` você disparar `COUNT_DOWN` com `0` **e** depois `COMPLETE_TASK`, ou dois dispatches que brigam, pode aparecer **bug estranho** (contador “piscando”, valores negativos no estado). A regra: **`countDownSeconds > 0`** → só `COUNT_DOWN`; **`<= 0`** → só `COMPLETE_TASK` + `terminate()`.

## Passo 1 — `taskActions.ts`

Inclua as constantes e os tipos:

```typescript
export const TaskActionTypes = {
  START_TASK: 'START_TASK',
  INTERRUPT_TASK: 'INTERRUPT_TASK',
  RESET_STATE: 'RESET_STATE',
  COUNT_DOWN: 'COUNT_DOWN',
  COMPLETE_TASK: 'COMPLETE_TASK',
} as const;

export type TaskActionsWithPayload =
  | {
      type: typeof TaskActionTypes.START_TASK;
      payload: TaskModel;
    }
  | {
      type: typeof TaskActionTypes.COUNT_DOWN;
      payload: { secondsRemaining: number };
    };

export type TaskActionsWithoutPayload =
  | { type: typeof TaskActionTypes.RESET_STATE }
  | { type: typeof TaskActionTypes.INTERRUPT_TASK }
  | { type: typeof TaskActionTypes.COMPLETE_TASK };
```

Arquivo completo esperado: união `TaskActionModel` = `TaskActionsWithPayload | TaskActionsWithoutPayload`.

## Passo 2 — `taskReducer.ts`

### `COUNT_DOWN`

Atualiza só o tempo exibido, mantendo o resto do estado:

```typescript
case TaskActionTypes.COUNT_DOWN: {
  return {
    ...state,
    secondsRemaining: action.payload.secondsRemaining,
    formattedSecondsRemaining: formatSecondsToMinutes(
      action.payload.secondsRemaining,
    ),
  };
}
```

### `COMPLETE_TASK`

Espelha **`INTERRUPT_TASK`**, trocando **`interruptDate`** por **`completeDate`** na tarefa ativa. Garanta **zeragem explícita** para não ficar `1` ou `-1` no contador:

```typescript
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
```

## Passo 3 — `TimerWorkerManager.ts`

Tipagem do que a thread principal envia ao worker (alinhado ao estado da aplicação):

```typescript
import type { TaskStateModel } from '../models/TaskStateModel';

// ...

postMessage(message: TaskStateModel) {
  this.worker.postMessage(message);
}
```

## Passo 4 — `TaskContextProvider.tsx`

No **`worker.onmessage`** (dentro de `useEffect`, como na tarefa anterior), use **`if / else`** para **nunca** misturar os dois dispatches na mesma lógica de forma perigosa:

```tsx
useEffect(() => {
  worker.onmessage(e => {
    const countDownSeconds = e.data;

    if (countDownSeconds <= 0) {
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
```

O segundo `useEffect` com `[worker, state]` continua responsável por: sem `activeTask` → `terminate()` + `return`; com `activeTask` → `worker.postMessage(state)`.

**Debug (opcional):** um `console.log(state)` nesse efeito ajuda a conferir `completeDate` / `interruptDate` nas tarefas; depois você pode remover para não poluir o console.

## Como validar

1. Inicie uma tarefa: o **CountDown** deve **decrescer** na tela (lê `state.formattedSecondsRemaining`).
2. Ao chegar em **zero**: botão de **play** volta, input **libera**, **Tips** mostra o próximo ciclo; no log opcional, aparece algo como **worker terminado por falta de active task** (efeito que roda com `activeTask === null`).
3. Na lista de `tasks` (React DevTools ou log): a tarefa concluída tem **`completeDate` preenchido** e **`interruptDate` null**; se **interromper** antes do fim, **`interruptDate`** preenchido e **`completeDate` null**.

## Observação para próximas aulas

Com **rotas / outras páginas**, pode ser necessário **revisar** onde o Provider e o worker conversam com o estado global; por ora a lógica acima vale para a **Home** atual.

## Checklist

- [ ] `COUNT_DOWN` e `COMPLETE_TASK` em `TaskActionTypes` e `TaskActionModel`.
- [ ] Reducer com os dois `case`s e `COMPLETE_TASK` espelhando `INTERRUPT_TASK` com `completeDate`.
- [ ] `onmessage` com `if (countDownSeconds <= 0)` → só `COMPLETE_TASK` + `terminate`; senão só `COUNT_DOWN`.
- [ ] `TimerWorkerManager.postMessage` tipado com `TaskStateModel`.
