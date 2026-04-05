# 🚀 Evoluindo o `useReducer`: Trabalhando com Objetos e Payloads

Na aula passada, criamos um Reducer muito simples que alterava um número baseado
em uma _string_ (`'INCREMENT'`, `'DECREMENT'`). Mas, no mundo real, nosso estado
raramente é apenas um número, e nossas ações geralmente precisam carregar
informações extras (como "quantos minutos eu quero adicionar?").

Nesta aula, vamos mudar o nosso estado para um **Objeto** e as nossas ações para
um padrão com **Type** e **Payload**.

---

## 📦 1. Estruturando a Ação (Type e Payload)

Para enviar dados junto com a nossa ação, deixamos de enviar uma _string_ no
`dispatch` e passamos a enviar um **objeto**. Esse objeto tradicionalmente tem
duas propriedades:

- **`type`**: O nome da ação (o que queremos fazer).
- **`payload`** (opcional): A "carga" de dados que a ação carrega (ex: o valor a
  ser somado).

Vamos criar a tipagem no TypeScript para isso:

```tsx
type ActionType = {
  type: string;
  payload?: number; // Opcional, pois ações como "RESET" não precisam de payload
};
```

## 🧠 2. Atualizando a Função Reducer

Agora, o nosso estado inicial não é mais o número `0`, mas sim um objeto:
`{ secondsRemaining: 0 }`. Consequentemente, nossa função Reducer precisa ser
atualizada para:

1. Receber a tipagem `ActionType`.
2. Checar o `action.type` no `switch`.
3. Retornar sempre uma cópia do estado (`...state`) com a propriedade alterada.

**Veja como fica a lógica interna do Reducer:**

```tsx
const [myState, dispatch] = useReducer(
  (state, action: ActionType) => {
    console.log('Estado:', state, 'Action:', action);

    switch (action.type) {
      case 'INCREMENT': {
        // Proteção: se não vier payload, não fazemos nada
        if (!action.payload) return state;

        return {
          ...state,
          secondsRemaining: state.secondsRemaining + action.payload,
        };
      }
      case 'DECREMENT': {
        if (!action.payload) return state;

        return {
          ...state,
          secondsRemaining: state.secondsRemaining - action.payload,
        };
      }
      case 'RESET': {
        // O Reset não precisa de payload, apenas zera o estado
        return {
          secondsRemaining: 0,
        };
      }
    }

    return state; // Retorno de segurança
  },
  // Estado inicial agora é um objeto!
  { secondsRemaining: 0 },
);
```

**Dica de Organização:** Note que envolvemos o conteúdo de cada `case` com
chaves `{ }`. Quando temos muitas linhas dentro de um `case`, isso cria um
"bloco" próprio, facilitando a leitura e evitando conflitos de variáveis.

## 🎛️ 3. Disparando Ações com Payloads

Agora que o nosso Reducer está inteligente, nossos botões vão mudar. O
`dispatch` vai enviar o objeto exato que configuramos:

```tsx
return (
  <TaskContext.Provider value={{ state, setState }}>
    {/* Usamos JSON.stringify para conseguir renderizar um objeto na tela */}
    <h1>O estado é: {JSON.stringify(myState)}</h1>

    <button onClick={() => dispatch({ type: 'INCREMENT', payload: 10 })}>
      Incrementar +10
    </button>

    <button onClick={() => dispatch({ type: 'INCREMENT', payload: 20 })}>
      Incrementar +20
    </button>

    <button onClick={() => dispatch({ type: 'DECREMENT', payload: 50 })}>
      Decrementar -50
    </button>

    <button onClick={() => dispatch({ type: 'RESET' })}>RESET</button>
  </TaskContext.Provider>
);
```

## ✅ Resumo do Fluxo

Se você clicar em **"Incrementar +20"**, veja o que acontece por baixo dos
panos:

1. O botão chama dispatch(`{ type: 'INCREMENT', payload: 20 }`).
2. A função useReducer recebe essa ordem.
3. O `switch` encontra o `case 'INCREMENT'`.
4. O código soma o estado atual (`0`) com o payload (`20`).
5. O novo estado se torna `{ secondsRemaining: 20 }`.
6. A tela é atualizada.

Com essa base, você acabou de dominar a lógica real de como o useReducer
funciona em aplicações profissionais! Na próxima aula, vamos restaurar o nosso
código original do Pomodoro e começar a aplicar essa mesma estratégia de Tipos,
Payloads e Switch Cases para o nosso contexto de Tarefas de verdade. Prepare-se!
