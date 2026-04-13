# Tarefa: tocar áudio ao completar o ciclo — `loadBeep`, Safari e `useRef`

## Objetivo

Tocar o arquivo **`src/assets/audios/gravitational_beep.mp3`** quando o contador chega a **zero** (worker manda `<= 0` → `COMPLETE_TASK`), respeitando as regras de **autoplay** dos navegadores — em especial o **Safari**, que costuma bloquear `audio.play()` se não houver vínculo com **gesto do usuário**.

## Contexto: por que não é só `new Audio().play()`?

- Em **Chrome / Edge / Firefox / Opera**, muitas vezes basta carregar e chamar `play()` depois.
- No **Safari**, se o usuário clicou em **Iniciar**, passou o tempo e só então o código tenta `play()`, o navegador pode tratar como reprodução **sem** interação recente e **bloquear**.
- **HTTPS:** em desenvolvimento local, o Safari pode ser mais rígido; em produção com **HTTPS** (ex.: deploy com certificado) o comportamento costuma alinhar com o que você vê nos outros navegadores.

Estratégia da aula: no momento em que existe **`activeTask`** (logo após o usuário iniciar o ciclo), **carregar** o áudio com `load()` e disparar um **`play()` imediato** (ainda “perto” da cadeia do clique). Isso **prepara** o mesmo elemento de áudio para um segundo `play()` no **fim** do timer, quando **não** há clique.

## Arquivos envolvidos

| Arquivo | Papel |
|---------|--------|
| `src/utils/loadBeep.ts` | Importa o `.mp3` via bundler, cria `Audio`, chama `load()`, retorna função que faz `currentTime = 0` e `play().catch(...)`. |
| `src/contexts/TaskContext/TaskContextProvider.tsx` | `useRef` guarda a função retornada por `loadBeep`; um `useEffect` depende só de `state.activeTask`; o `onmessage` do worker chama o beep antes de `COMPLETE_TASK` quando `countDownSeconds <= 0`. |
| `src/assets/audios/gravitational_beep.mp3` | Som usado na aula (pode trocar por outro `.mp3` mantendo o import). |

## Passo 1 — `loadBeep` (`src/utils/loadBeep.ts`)

1. Importe o MP3 (caminho relativo a partir de `src/utils/`):

   `import gravitationalBeep from '../assets/audios/gravitational_beep.mp3';`

2. Dentro de `loadBeep()`:
   - `const audio = new Audio(gravitationalBeep);`
   - `audio.load();`
   - **Retorne** uma função sem argumentos que:
     - defina `audio.currentTime = 0` (para repetir o mesmo arquivo do início);
     - chame `audio.play().catch(error => console.log('Erro ao tocar áudio', error));`

Assim você separa **carregar** (e expor o “player”) de **tocar** quando quiser.

### Código-fonte completo — `src/utils/loadBeep.ts`

```typescript
import gravitationalBeep from '../assets/audios/gravitational_beep.mp3';

/**
 * Prepares a short notification sound for playback in the browser.
 *
 * Browsers (especially Safari) often block `HTMLMediaElement.play()` unless
 * audio was “unlocked” in a user-gesture context. This helper loads the asset
 * once and returns a zero-argument function that rewinds to the start and plays.
 *
 * @returns A function that resets `currentTime` to 0 and calls `play()`; rejects are logged.
 */
export function loadBeep() {
  const audio = new Audio(gravitationalBeep);
  audio.load();

  return () => {
    audio.currentTime = 0;
    audio.play().catch(error => console.log('Erro ao tocar áudio', error));
  };
}
```

## Passo 2 — Por que `useRef` e não `let` no corpo do componente?

A cada atualização de estado, o **Provider** renderiza de novo. Variáveis declaradas no corpo da função **resetam**. A função retornada por `loadBeep()` precisa **persistir** entre renders até o fim do ciclo → use **`useRef`**.

Tipagem sugerida:

```typescript
const playBeepRef = useRef<ReturnType<typeof loadBeep> | null>(null);
```

`ReturnType<typeof loadBeep>` é o tipo da função “tocar” retornada por `loadBeep`.

## Passo 3 — `useEffect` só quando `activeTask` muda

Não use o efeito que roda a **cada segundo** (`COUNT_DOWN`) para carregar o beep — isso dispararia lógica demais e confundiria o fluxo.

Use **`useEffect(..., [state.activeTask])`**:

1. Se **não** há `activeTask`: `playBeepRef.current = null` e `return` (interrompeu ou zerou estado).
2. Se há `activeTask` e **`playBeepRef.current === null`**:
   - `const play = loadBeep();`
   - `playBeepRef.current = play;`
   - chame **`play()` uma vez** na sequência (desbloqueio Safari / “primeiro play” logo após o usuário iniciar).

**Cuidado com o `else`:** não faça `if (activeTask && ref === null) { ... } else { ref = null }`, porque quando a tarefa **continua ativa** e a ref **já foi preenchida**, o `else` esvaziaria a ref no meio do ciclo. O correto é: **só** zera a ref quando **`!state.activeTask`**.

## Passo 4 — Tocar de novo no `onmessage` ao completar

No efeito que registra `worker.onmessage`, quando **`countDownSeconds <= 0`**:

1. Se `playBeepRef.current` existir, chame `playBeepRef.current()` e depois `playBeepRef.current = null`.
2. Em seguida `dispatch(COMPLETE_TASK)` e `worker.terminate()` (como já estava o fluxo do timer).

Ordem sugerida: **som → completar estado → matar worker**.

### Código-fonte completo — `src/contexts/TaskContext/TaskContextProvider.tsx`

```tsx
import { useEffect, useReducer, useRef } from 'react';
import { initialTaskState } from './initialTaskState';
import { taskReducer } from './taskReducer';
import { TaskContext } from './TaskContext';
import { TimerWorkerManager } from '../../workers/TimerWorkerManager';
import { TaskActionTypes } from './taskActions';
import { loadBeep } from '../../utils/loadBeep';

type TaskContextProviderProps = {
  children: React.ReactNode;
};

export function TaskContextProvider({ children }: TaskContextProviderProps) {
  const [state, dispatch] = useReducer(taskReducer, initialTaskState);
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

    if (!state.activeTask) {
      worker.terminate();
      return;
    }

    worker.postMessage(state);
  }, [worker, state]);

  useEffect(() => {
    if (!state.activeTask) {
      playBeepRef.current = null;
      return;
    }

    if (playBeepRef.current === null) {
      const play = loadBeep();
      playBeepRef.current = play;
      // Safari: primeiro play ainda “perto” do clique em Iniciar ajuda a destravar autoplay depois.
      play();
    }
  }, [state.activeTask]);

  return (
    <TaskContext.Provider value={{ state, dispatch }}>
      {children}
    </TaskContext.Provider>
  );
}
```

## Comportamento esperado

- Ao **iniciar** uma tarefa: carrega o áudio e toca **uma vez** (pode ser um “tu” bem curto no início do arquivo — normal no som gravitacional da aula).
- Ao **terminar** sozinho: log de countdown chega a 0, toca de novo, estado completa, worker encerra.
- Ao **interromper** antes do fim: `activeTask` vira `null`, ref é limpa; ao **iniciar outra** tarefa, o fluxo de carregar + primeiro `play()` repete.

## Limpeza

Remova `console.log` de depuração (“carregando áudio”, “tocando áudio”, etc.) no código final. Para achar sobras: busca no projeto por `console.log`.

## Checklist

- [ ] `gravitational_beep.mp3` presente em `src/assets/audios/`.
- [ ] `loadBeep` com `load()`, retorno que faz `currentTime = 0` e `play().catch(...)`.
- [ ] `playBeepRef` com `ReturnType<typeof loadBeep> | null`.
- [ ] Efeito com deps `[state.activeTask]` sem esvaziar a ref enquanto a tarefa segue ativa.
- [ ] Primeiro `play()` logo após `loadBeep` ao iniciar tarefa.
- [ ] Segundo `play()` no ramo `countDownSeconds <= 0` antes do `COMPLETE_TASK`.

## Safari e HTTPS (lembrete)

Teste em Safari com **HTTPS** em produção ou ambiente equivalente; em `http://localhost` algumas versões se comportam diferente. Se o som falhar só no Safari, revise se o **primeiro** `play()` ainda ocorre no fluxo imediatamente após o usuário **iniciar** a tarefa.
