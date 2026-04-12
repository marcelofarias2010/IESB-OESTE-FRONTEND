# Tarefa: Web Worker de teste (`timerWorker`) e comunicação com o `MainForm`

## Objetivo

Introduzir um **Web Worker** no projeto para rodar lógica em um **thread separado** da interface. Nesta etapa o foco é **aprender o protocolo de mensagens** (`postMessage` / `onmessage`) com comandos fictícios. O cronômetro real do Pomodoro virá depois, reaproveitando a mesma ideia.

## O que você vai entender ao final

- Por que usar `new URL('...', import.meta.url)` no Vite para referenciar o arquivo do worker.
- Como a **thread principal** envia dados ao worker e como o worker **responde**.
- Onde ver no DevTools as mensagens do worker (`console.log` no worker aparece na aba do worker, não misturado com o da página).

## Pré-requisitos

- `MainForm` disparando `START_TASK` ao enviar o formulário.
- Navegador com suporte a Web Workers (Chrome/Firefox/Edge atuais).

## Passo 1 — Criar o arquivo do worker

Crie a pasta `src/workers/` (se ainda não existir) e o arquivo `src/workers/timerWorker.js` com o conteúdo abaixo.

O worker **escuta** mensagens da thread principal, faz um `switch` no texto recebido e **devolve** uma string. No caso `FECHAR`, ele ainda manda uma resposta e encerra o worker com `self.close()`.

```javascript
self.onmessage = function (event) {
  console.log('WORKER recebeu:', event.data);

  switch (event.data) {
    case 'FAVOR': {
      self.postMessage('Sim, posso fazer um favor');
      break;
    }
    case 'FALA_OI': {
      self.postMessage('OK: OI!');
      break;
    }
    case 'FECHAR': {
      self.postMessage('Tá bom, vou fechar');
      self.close();
      break;
    }
    default:
      self.postMessage('Não entendi');
  }
};
```

## Passo 2 — Instanciar o worker ao iniciar uma tarefa

No arquivo `src/components/MainForm/index.tsx`, **logo após** o `dispatch` que inicia a tarefa (`TaskActionTypes.START_TASK`), adicione o bloco abaixo **dentro** da função `handleCreateNewTask`.

- `new URL('../../workers/timerWorker.js', import.meta.url)` informa ao **Vite** o caminho correto do arquivo em tempo de build.
- Várias chamadas a `postMessage` servem para **testar** cada ramo do `switch` no worker.
- `worker.onmessage` na thread principal **recebe** as respostas e imprime no console.

```typescript
dispatch({ type: TaskActionTypes.START_TASK, payload: newTask });

const worker = new Worker(
  new URL('../../workers/timerWorker.js', import.meta.url),
);

worker.postMessage('FAVOR'); // Sim, posso fazer um favor
worker.postMessage('FALA_OI'); // OK: OI!
worker.postMessage('BLALBLA'); // Não entendi!
worker.postMessage('FECHAR'); // Tá bom, vou fechar

worker.onmessage = function (event) {
  console.log('PRINCIPAL recebeu:', event.data);
};
```

**Importante:** nesta versão didática, **cada vez** que você inicia uma tarefa um **novo** worker é criado. Para o Pomodoro de verdade, o próximo passo será decidir **uma** instância, mandar **segundos restantes** e tratar **parar / limpar** sem vazar workers. Por ora, o objetivo é só validar a comunicação.

## Passo 3 — Validar no navegador

1. Abra o app, abra o **DevTools** (F12) → aba **Console**.
2. Inicie uma tarefa (envie o formulário).
3. Você deve ver linhas como `PRINCIPAL recebeu:` com as respostas esperadas, na ordem dos `postMessage`.
4. Opcional: no Chrome, em **Console**, use o filtro ou o menu de contexto para inspecionar o **worker** e ver os logs `WORKER recebeu:`.

## Checklist

- [ ] Arquivo `src/workers/timerWorker.js` criado com o `switch` completo.
- [ ] `MainForm` instancia o worker com `new URL(..., import.meta.url)` após o `dispatch` de `START_TASK`.
- [ ] Quatro testes de `postMessage` e handler `onmessage` na thread principal.
- [ ] Console mostra as respostas ao iniciar uma tarefa.

## Próximos passos (fora desta tarefa)

Substituir os comandos de brincadeira por mensagens tipadas (ex.: `{ type: 'TICK', secondsLeft: n }`), sincronizar com o estado do `useReducer` e encerrar o worker ao interromper a tarefa.
