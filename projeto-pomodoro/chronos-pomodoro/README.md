## 🚀 Subindo de Nível: Tipagem Avançada para as Actions do Reducer

Agora as coisas vão ficar um pouco mais sérias! Nós já entendemos a base do
`useReducer`, mas no mundo real do desenvolvimento corporativo com TypeScript,
nós não queremos deixar margem para erros.

O nosso objetivo nesta aula é criar uma estrutura robusta onde seja **impossível
disparar uma ação incorreta.** Se uma ação exige um payload, o TypeScript vai te
obrigar a passá-lo. Se ela não exige, ele vai bloquear caso você tente passar.

Para manter nosso código organizado, vamos separar as Actions e o Reducer em
arquivos próprios. Nesta aula, o foco total será na construção das nossas
Actions.

## 🛑 O "Problema" do `enum` e a Solução Inteligente

No vídeo original, pensamos em usar `enum` para definir nossas ações. Porém,
como você bem notou e corrigiu no seu código, ferramentas modernas de build
(como Vite/SWC) utilizam a flag `erasableSyntaxOnly`. Isso significa que elas
esperam que o TypeScript seja apenas uma "camada imaginária" que pode ser
apagada, deixando apenas o JavaScript puro.

O `enum` quebra essa regra, pois ele gera código JavaScript real. A solução
definitiva, moderna e super recomendada é usar um **Objeto Literal com**
`as const`. Ele te dá a mesma segurança e o mesmo autocomplete do `enum`, mas
sem quebrar o seu build!

Vamos criar o nosso arquivo de ações e aplicar essa estrutura.

## 🛠️ 1. Criando as Constantes de Ação

Crie um novo arquivo dentro da pasta do seu contexto para guardar as definições
de ações.

**Arquivo:** `src/contexts/TaskContext/TaskActions.ts`

```tsx
// useReducer <- hook do React que recebe um reducer e um estado inicial
// reducer <- função que recebe o estado atual e uma ação, e retorna o novo estado
// state <- o estado atual
// action <- a ação disparada, geralmente é um objeto com type e (opcionalmente) payload

import type { TaskModel } from '../../models/TaskModel';

// 1. Usando um objeto literal com 'as const' para travar os valores
export const TaskActionTypes = {
  START_TASK: 'START_TASK',
  INTERRUPT_TASK: 'INTERRUPT_TASK',
  RESET_STATE: 'RESET_STATE',
} as const;
```

## 🔒 2. Amarrando o Type ao Payload (A Mágica do TypeScript)

Aqui está o grande "pulo do gato". Em vez de dizer que toda ação tem um `type` e
talvez um `payload`, nós vamos criar blocos específicos usando o operador `|`
(ou).

Nós vamos dizer ao TypeScript:

- "Se o type for `START_TASK` ou `INTERRUPT_TASK`, eu OBRIGATORIAMENTE preciso
  de um `payload` do tipo `TaskModel`."
- "Se o type for `RESET_STATE`, eu NÃO POSSO ter um `payload`."

Adicione os tipos abaixo no mesmo arquivo `TaskActions.ts`:

```tsx
// Ações que OBRIGATORIAMENTE precisam receber dados (payload)
export type TaskActionsWithPayload =
  | {
      type: typeof TaskActionTypes.START_TASK;
      payload: TaskModel;
    }
  | {
      type: typeof TaskActionTypes.INTERRUPT_TASK;
      payload: TaskModel;
    };

// Ações que NÃO DEVEM receber dados extras
export type TaskActionsWithoutPayload = {
  type: typeof TaskActionTypes.RESET_STATE;
};

// Juntando tudo no modelo final que será exportado para o nosso Reducer
export type TaskActionModel =
  | TaskActionsWithPayload
  | TaskActionsWithoutPayload;
```

## 🎯 3. Por que isso é incrível? (O Resultado Prático)

Pode parecer que escrevemos código demais, mas veja o que ganhamos com isso na
hora de usar o `dispatch` (ou dentro do próprio arquivo do Reducer):

- **Sem erros de digitação:** Você não vai mais escrever `'START_TSK'` sem
  querer, pois agora usará TaskActionTypes.START_TASK.
- **Trava de Payload:** Se você tentar fazer
  `dispatch({ type: TaskActionTypes.START_TASK })`, o seu editor de código vai
  gritar um erro vermelho: "_Ei, está faltando o payload do tipo TaskModel!_"
- **Segurança no Switch Case:** Quando criarmos o nosso Reducer (na próxima
  aula), se você estiver dentro do case `TaskActionTypes.RESET_STATE`, e tentar
  acessar action.payload, o TypeScript não vai deixar, pois ele sabe que o Reset
  não tem payload.

Esse é o poder do TypeScript avançado. Você perde um tempinho configurando os
tipos, mas ganha horas de produtividade não tendo que caçar bugs bobos na sua
aplicação.

Na próxima aula, vamos pegar esse modelo maravilhoso de Actions que acabamos de
criar e injetar dentro do nosso novo `TaskReducer`!
