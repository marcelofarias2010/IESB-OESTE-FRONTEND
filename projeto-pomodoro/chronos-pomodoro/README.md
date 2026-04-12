# Tarefa: worker útil — `useEffect` no Provider, countdown com `setTimeout` recursivo

## Objetivo

Fazer o **timer rodar de verdade** no Web Worker: o **`TaskContextProvider`** envia o **estado** (`state`) ao worker quando há tarefa ativa; o worker calcula o **fim** da sessão, dispara **ticks** a cada segundo (com **`setTimeout` recursivo**, não `setInterval`) e manda os **segundos restantes** de volta. Sem tarefa ativa, o worker é **encerrado** com `terminate()`.

Na próxima iteração do curso você ligará isso ao **`dispatch`** de “task completa” e ao **countdown na UI**; aqui o foco é o **fluxo Provider ↔ Worker** e o **cuidado com `useEffect`**.

## Ideias da aula (resumo)

| Onde | O que acontece |
|------|----------------|
| **Provider** | `TimerWorkerManager.getInstance()`, `useEffect` reage a **`state`**: sem `activeTask` → `terminate()` + log; com `activeTask` → `postMessage(state)`. |
| **Worker** | Recebe `state`, calcula `endDate = startDate + secondsRemaining * 1000`, função **`tick`** recursiva com `setTimeout(..., 1000)`. |
| **Por que não `setInterval`?** | Em abas em segundo plano o navegador pode **atrasar** `setInterval`; o roteiro da aula prefere **`setTimeout` recursivo** e conta baseada em **`Date.now()`**. |
| **`Math.ceil` / `Math.floor`** | Na **primeira** leitura usa-se `ceil` para começar em “60” (ou 60×1 min em teste); nos ticks seguintes, `floor` com o tempo atual. |
| **`isRunning` no worker** | Evita processar **outra** mensagem enquanto um ciclo de timer já está rodando (proteção extra além do Singleton). |

## Aviso sobre `useEffect` e dependências

- Tudo que a função do `useEffect` **lê** e que pode mudar entre execuções costuma ir no **array de dependências** (ex.: `state`, referência estável ao manager).
- Se você colocar no array algo que **o próprio efeito altera** de forma que dispare de novo sem fim, pode gerar **loop infinito** e travar o navegador.
- O **`worker`** retornado por `getInstance()` em geral é estável **enquanto** não chamar `terminate()`; após `terminate()`, o Singleton zera a instância e a próxima chamada pode devolver **outro** objeto — o React precisa reenfileirar o efeito (incluir `worker` nas deps é coerente com o que a aula comentou).

**Registro do `onmessage`:** não chame `worker.onmessage(cb)` **direto no corpo** do componente (isso rodaria a **cada render** e reconfiguraria o handler). Use um **`useEffect`** dedicado. Lembre que no `TimerWorkerManager` **`onmessage` é um método** que recebe o callback: `worker.onmessage(e => { ... })`, e não atribuição `worker.onmessage = ...` (isso quebraria a API da classe).

## Passo 1 — Tempos de teste (1 minuto)

Para não esperar 25 minutos enquanto testa, alinhe o estado inicial em `src/contexts/TaskContext/initialTaskState.ts`:

```typescript
config: {
  workTime: 1,
  shortBreakTime: 1,
  longBreakTime: 1,
},
```

(Valores em **minutos**; o reducer continua convertendo com `duration * 60` para segundos.)

## Passo 2 — `timerWorker.js` (estado, `endDate`, `tick`, `isRunning`)

Arquivo: `src/workers/timerWorker.js`.

- Variável **`let isRunning = false`** no **topo do arquivo** (escopo do worker), para o guard do Singleton na thread do worker.
- Ao receber mensagem: se já estiver rodando, **retorna**.
- Lê `activeTask` e `secondsRemaining` do `state` enviado pelo Provider.
- `endDate` em **milissegundos**: `activeTask.startDate + secondsRemaining * 1000`.
- Primeiro valor exibido: `Math.ceil((endDate - Date.now()) / 1000)`.
- Em **`tick`**: `postMessage(countDownSeconds)`, atualiza com `Math.floor((endDate - now) / 1000)`, agenda o próximo tick com **`setTimeout(tick, 1000)`**.
- Quando o countdown **chegar a 0 ou abaixo**, **não** agende mais `setTimeout` (evita ficar postando valores negativos). O Provider, ao receber `<= 0`, chama `terminate()` e loga conclusão.

```javascript
let isRunning = false;

self.onmessage = function (event) {
  if (isRunning) return;

  isRunning = true;

  const state = event.data;
  const { activeTask, secondsRemaining } = state;

  const endDate = activeTask.startDate + secondsRemaining * 1000;
  const now = Date.now();
  let countDownSeconds = Math.ceil((endDate - now) / 1000);

  function tick() {
    self.postMessage(countDownSeconds);

    const nowInner = Date.now();
    countDownSeconds = Math.floor((endDate - nowInner) / 1000);

    if (countDownSeconds <= 0) {
      self.postMessage(0);
      return;
    }

    setTimeout(tick, 1000);
  }

  tick();
};
```

**Debug:** você pode conferir `endDate` com `new Date(endDate)` no console para ver a hora exata prevista de término.

## Passo 3 — `TaskContextProvider.tsx`

Arquivo: `src/contexts/TaskContext/TaskContextProvider.tsx`.

1. Importe `TimerWorkerManager`.
2. `const worker = TimerWorkerManager.getInstance()` no corpo do componente.
3. **`useEffect`** só para registrar o retorno do worker: chamar **`worker.onmessage(e => { ... })`** (método do manager), logar `e.data`; se `countDownSeconds <= 0`, logar algo como `'Worker COMPLETED'` e chamar **`worker.terminate()`** (método do **manager**, que também zera o Singleton).
4. **`useEffect`** que depende de **`[worker, state]`**:
   - Se **`!state.activeTask`**: logar algo como `'Worker terminado por falta de activeTask'`, chamar **`worker.terminate()`**, e **`return`** (não enviar `postMessage` depois de matar o worker).
   - Caso contrário: **`worker.postMessage(state)`**.

```tsx
import { useEffect, useReducer } from 'react';
import { initialTaskState } from './initialTaskState';
import { taskReducer } from './taskReducer';
import { TaskContext } from './TaskContext';
import { TimerWorkerManager } from '../../workers/TimerWorkerManager';

type TaskContextProviderProps = {
  children: React.ReactNode;
};

export function TaskContextProvider({ children }: TaskContextProviderProps) {
  const [state, dispatch] = useReducer(taskReducer, initialTaskState);
  const worker = TimerWorkerManager.getInstance();

  useEffect(() => {
    worker.onmessage(e => {
      const countDownSeconds = e.data;
      console.log(countDownSeconds);

      if (countDownSeconds <= 0) {
        console.log('Worker COMPLETED');
        worker.terminate();
      }
    });
  }, [worker]);

  useEffect(() => {
    if (!state.activeTask) {
      console.log('Worker terminado por falta de activeTask');
      worker.terminate();
      return;
    }

    worker.postMessage(state);
  }, [worker, state]);

  return (
    <TaskContext.Provider value={{ state, dispatch }}>
      {children}
    </TaskContext.Provider>
  );
}
```

## Fluxos que você deve conseguir reproduzir

1. **Iniciar tarefa:** console mostra countdown (ex.: 60 → 59 → … com `config` em 1 minuto).
2. **Deixar chegar a 0:** aparece `Worker COMPLETED`, worker encerrado.
3. **Interromper antes do fim:** estado perde `activeTask`, efeito manda `terminate` com log de falta de tarefa ativa.

## O que ainda não é desta tarefa (deixado para depois)

- **`dispatch`** com ação do tipo **“task completada”** ao receber `0` no Provider (a aula menciona que virá em seguida).
- Atualizar **`secondsRemaining` / `formattedSecondsRemaining`** no estado a **cada** tick para o **CountDown** na tela (hoje o worker só loga no console).

## Checklist

- [ ] `initialTaskState` com tempos de teste se quiser ciclos de 1 minuto.
- [ ] Worker com `isRunning`, `endDate`, `tick` + `setTimeout` recursivo e parada em `<= 0`.
- [ ] Provider: `worker.onmessage(cb)` dentro de `useEffect`; segundo `useEffect` com `terminate` + `return` quando não há `activeTask`, e `postMessage(state)` só quando há tarefa.
- [ ] Testou os três fluxos: contagem, conclusão, interrupção.

## Se se perder na lógica

São várias peças (Provider, `useEffect`, worker, tempo em ms, Singleton). Vale **reassistir** o trecho da aula e seguir o fluxo do dado: **state** → `postMessage` → worker → `postMessage` de volta → `onmessage` no Provider.
