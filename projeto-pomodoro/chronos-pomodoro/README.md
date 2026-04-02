# 🧠 Introdução ao `useReducer`: Simplificando Estados Complexos

Nas últimas aulas, você deve ter notado que as nossas funções de iniciar e
interromper tarefas ficaram gigantes. Toda vez que queríamos alterar o estado
(`setState`), precisávamos nos preocupar em espalhar o estado anterior
(`...prevState`), manter as outras propriedades intactas e fazer lógicas
complexas de atualização de array.

Se precisássemos iniciar uma tarefa a partir de outro lugar da aplicação,
teríamos que duplicar todo esse código! É para resolver exatamente esse problema
de "estados complexos" que o React nos oferece o hook **`useReducer`**.

Com o `useReducer`, o componente não precisa saber _como_ o estado é alterado.
Ele apenas grita: **"Ei, inicie uma nova tarefa!"** (dispara uma ação). O
Reducer, que é uma função centralizada, escuta essa ação, sabe exatamente o que
fazer e devolve o novo estado pronto.

Para você entender esse conceito sem fritar a cabeça com a complexidade do nosso
Pomodoro, vamos dar um passo atrás e criar o Reducer mais simples do mundo: um
contador.

---

## 🧹 1. Limpando o Terreno (O Efeito "Homens de Preto")

Vamos temporariamente esconder a nossa aplicação para focar apenas no conceito.
Abra o seu arquivo de Contexto. Comente o `useEffect` e troque o `{children}` do
retorno por elementos de teste.

**Arquivo:** `src/contexts/TaskContext/index.tsx`

```tsx
// Comente o useEffect por enquanto
// useEffect(() => {
//   console.log(state);
// }, [state]);

return (
  <TaskContext.Provider value={{ state, setState }}>
    {/* Esconda o {children} e coloque um H1 para testarmos */}
    <h1>Testando...</h1>
  </TaskContext.Provider>
);
```

Se você olhar o navegador agora, a aplicação sumiu e você só verá o
"Testando...". Perfeito!

## ⚙️ 2. A Estrutura Básica do `useReducer`

O `useReducer` funciona de forma muito parecida com o `useState`. Ele recebe
dois parâmetros:

1. Uma **função Reducer** (que recebe o estado atual e a ação disparada).
2. O **estado inicial** (no nosso caso, o número `0`).

Ele nos devolve duas coisas (assim como o `useState`):

1. A variável com o valor do **estado** (chamaremos de `numero`).
2. Uma função para **disparar ações**, que convencionalmente chamamos de
   `dispatch`.

Vamos importar o `useReducer` do React e criar a nossa estrutura:

```tsx
import { useReducer, useState } from 'react';
// ... outras importações ...

export function TaskContextProvider({ children }: TaskContextProviderProps) {
  const [state, setState] = useState(initialTaskState);

  // 1. Criando o nosso reducer simples
  const [numero, dispatch] = useReducer((state, action) => {

    // Regra de Ouro: O reducer SEMPRE precisa retornar um estado (seja ele novo ou o atual)
    return state;

  }, 0);

// ...
```

## 🎯 3. Disparando Ações e o `switch/case`

Como alteramos esse número? Usamos a função `dispatch` passando o nome da ação
que queremos que aconteça. Normalmente, passamos strings em letras maiúsculas
(como `'INCREMENT'`).

Dentro da função reducer, usamos um `switch` para checar qual ação foi disparada
(o parâmetro `action`) e, com base nisso, retornamos a matemática correta.

Atualize o seu código para incluir a lógica do `switch` e os botões na tela:

```tsx
const [numero, dispatch] = useReducer((state, action) => {
  console.log('Estado atual:', state, 'Ação disparada:', action);

  // Avalia qual ação foi disparada
  switch (action) {
    case 'INCREMENT':
      return state + 1; // Se for incrementar, devolve o estado + 1
    case 'DECREMENT':
      return state - 1; // Se for decrementar, devolve o estado - 1
    case 'INITIAL_STATE':
      return 0; // Se for zerar, devolve 0 diretamente
  }

  // Fallback: se dispararem uma ação que não existe, devolve o estado como estava.
  return state;
}, 0);

return (
  <TaskContext.Provider value={{ state, setState }}>
    <h1>O número é: {numero}</h1>

    {/* Botões que disparam (dispatch) as ações para o nosso reducer */}
    <button onClick={() => dispatch('INCREMENT')}>Incrementar</button>
    <button onClick={() => dispatch('DECREMENT')}>Decrementar</button>
    <button onClick={() => dispatch('INITIAL_STATE')}>ZERAR</button>
  </TaskContext.Provider>
);
```

## ✅ 4. Testando o Comportamento

Vá para o navegador, abra o seu `Console (F12)` e clique nos botões!

- Ao clicar em **Incrementar**, o `dispatch('INCREMENT')` manda a mensagem para
  o Reducer. O Reducer vê o `case 'INCREMENT'`, soma 1 ao estado e atualiza a
  tela.
- Ao clicar em **ZERAR**, o `dispatch` manda a mensagem `'INITIAL_STATE'`. O
  Reducer entende a regra e altera o estado para 0, não importando o quão alto o
  número estava antes.

Toda a lógica matemática ficou presa dentro do Reducer. Os botões não fazem
ideia de como a conta é feita, eles apenas dão a ordem!

**🔮 Próximos Passos** Isso foi muito fácil porque lidamos com um simples número
e uma string de ação. Mas no mundo real, nosso estado é um objeto gigante (com
arrays e tarefas) e nossas ações precisam carregar dados (ex: os dados da tarefa
digitada no input).

Na próxima aula, vamos evoluir esse conceito para trabalhar com **Objetos e
Payloads**, deixando tudo pronto para refatorar o nosso Pomodoro de verdade!
