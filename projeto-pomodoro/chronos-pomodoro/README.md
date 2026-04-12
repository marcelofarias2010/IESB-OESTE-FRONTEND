# Tarefa: `TimerWorkerManager` (Singleton) — um único Web Worker na aplicação

## Objetivo

Parar de criar `new Worker(...)` **dentro de componentes** (por exemplo, a cada envio do formulário) e passar a ter **uma única instância** de worker compartilhável em **qualquer** parte do app (outra página, `Provider`, histórico, etc.).

Na prática anterior, cada início de tarefa podia gerar **outro** worker; agora o **padrão Singleton** centraliza isso em uma classe gerenciadora.

## Por que Singleton aqui?

- O Pomodoro precisa de **no máximo um** timer em background coerente com o estado global.
- Quando `secondsRemaining` chegar a zero, quem reage pode estar **fora** do `MainForm` (ex.: outra rota). Todos precisam falar com o **mesmo** worker, não com um criado “só naquele clique”.
- O Singleton **não é específico de React**: é um padrão de projeto usado em várias linguagens. Se quiser se aprofundar, a aula citou a playlist **Padrões de Projeto** do **Otávio Miranda** no YouTube (começando por *Singleton* — teoria e prática).

## Pré-requisitos

- Arquivo `src/workers/timerWorker.js` da aula anterior (com `onmessage` / `postMessage` de teste).
- `MainForm` disparando `START_TASK` ao submeter o formulário.

## Passo 1 — Criar `TimerWorkerManager.ts`

Na pasta `src/workers/`, crie o arquivo `TimerWorkerManager.ts`.

Ideias principais:

1. Variável **no módulo** (`let instance ...`) guarda a única instância da classe (ou `null`).
2. **Construtor privado** — impede `new TimerWorkerManager()` fora da própria classe; só a classe controla a criação.
3. **`static getInstance()`** — se ainda não existir instância, cria; senão, devolve a mesma.
4. O worker é criado com **`new URL('./timerWorker.js', import.meta.url)`** porque o arquivo `.ts` do manager fica **na mesma pasta** que o `timerWorker.js` (caminho relativo ao Vite).
5. Métodos **`postMessage`** e **`onmessage`** repassam para o `Worker` interno sem expor `this.worker` publicamente.
6. **`terminate()`** chama `this.worker.terminate()` e zera `instance`, permitindo que um próximo `getInstance()` crie **outro** worker do zero (ciclo de vida controlado — útil ao interromper tarefa ou ao completar).

Código completo:

```typescript
let instance: TimerWorkerManager | null = null;

export class TimerWorkerManager {
  private worker: Worker;

  private constructor() {
    this.worker = new Worker(new URL('./timerWorker.js', import.meta.url));
  }

  static getInstance() {
    if (!instance) {
      instance = new TimerWorkerManager();
    }

    return instance;
  }

  postMessage(message: any) {
    this.worker.postMessage(message);
  }

  onmessage(cb: (e: MessageEvent) => void) {
    this.worker.onmessage = cb;
  }

  terminate() {
    this.worker.terminate();
    instance = null;
  }
}
```

**Sobre `message: any`:** é aceitável nesta etapa didática; depois trocamos por um tipo ou union de mensagens (`{ type: '...', payload: ... }`).

## Passo 2 — Remover o `Worker` “solto” do `MainForm`

**Apague** o bloco que fazia isto diretamente no formulário (após o `dispatch` de `START_TASK`):

```typescript
const worker = new Worker(
  new URL('../../workers/timerWorker.js', import.meta.url),
);

worker.postMessage('FAVOR');
// ... outros postMessage de teste ...
worker.onmessage = function (event) {
  console.log('PRINCIPAL recebeu:', event.data);
};
```

Motivo: esse código criava um **novo** worker a **cada** início de tarefa e amarrava o worker ao componente.

## Passo 3 — Testar o manager no `MainForm` (temporário)

Para validar que o Singleton se comporta como na aula, **logo após** o `dispatch({ type: TaskActionTypes.START_TASK, payload: newTask })`, use o manager:

```typescript
import { TimerWorkerManager } from '../../workers/TimerWorkerManager';

// dentro de handleCreateNewTask, após o dispatch:
const timerWorkerManager = TimerWorkerManager.getInstance();

timerWorkerManager.postMessage('FAVOR'); // Sim, posso fazer um favor
timerWorkerManager.postMessage('FALA_OI'); // OK: OI!
timerWorkerManager.postMessage('BLALBLA'); // Não entendi!
timerWorkerManager.postMessage('FECHAR'); // Tá bom, vou fechar

timerWorkerManager.onmessage(event => {
  console.log('PRINCIPAL recebeu:', event.data);
});
```

Observe:

- **`onmessage`** aqui é o **método** da classe (recebe um callback), não a propriedade crua do `Worker` — por isso a assinatura fica `onmessage(event => { ... })` em vez de `worker.onmessage = function (...)`.

Na **primeira** vez que você inicia uma tarefa, `getInstance()` cria o worker. Nas **seguintes**, reutiliza a mesma instância **enquanto** você não chamar `terminate()`.

Se quiser reproduzir o experimento da aula (`terminate` → nova instância no próximo `getInstance()`), pode chamar `TimerWorkerManager.getInstance().terminate()` em algum fluxo de teste e iniciar de novo.

## Passo 4 — (Opcional agora) Limpar o `MainForm`

Na continuação do curso, o lugar certo para **ligar** o worker ao estado (`activeTask`, `secondsRemaining`, etc.) tende a ser o **`TaskContextProvider`** (onde já existe efeito que observa mudanças de `state`), e não o formulário.

Quando essa parte for feita, **remova** o bloco de teste do `handleCreateNewTask` e deixe só o `dispatch`. O manager continuará disponível via `TimerWorkerManager.getInstance()` onde o estado global for gerenciado.

## Checklist

- [ ] `TimerWorkerManager.ts` criado em `src/workers/` com construtor privado e `getInstance`.
- [ ] Worker carregado com `new URL('./timerWorker.js', import.meta.url)`.
- [ ] `MainForm` não usa mais `new Worker(new URL('../../workers/...'))`.
- [ ] Teste com `getInstance` + `postMessage` + `onmessage` reproduz as respostas no console.
- [ ] Entendido: `terminate()` zera `instance` para permitir novo worker depois.

## Próximos passos (próximas aulas)

- Gerenciar o ciclo de vida do worker no **provider** conforme o estado: há `activeTask`? precisa de worker rodando? ao interromper / completar, chamar `terminate()` quando fizer sentido.
- Trocar mensagens de brincadeira por protocolo útil (contagem regressiva de segundos).
