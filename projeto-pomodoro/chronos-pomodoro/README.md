# ⚓ Capturando Dados sem Renderizar: A Técnica do `useRef`

Vamos explorar os Uncontrolled Components e conhecer mais um Hook poderoso do
React: o useRef!

Na aula passada, vimos que os **Inputs Controlados** (com `useState`) fazem o
componente atualizar a tela a cada tecla digitada. Embora isso geralmente não
seja um problema de performance, existe uma outra forma de capturar dados de um
formulário: os **Inputs Não-Controlados** usando o Hook `useRef`.

---

## 🧐 O que é o `useRef`?

O `useRef` é como uma "caixa forte" dentro do seu componente. Você pode guardar
qualquer valor lá dentro (um número, um objeto, ou até mesmo um elemento HTML
inteiro!).

A grande sacada do `useRef` é dupla:

1. O valor sobrevive entre as renderizações do componente.
2. **Alterar o valor do `useRef` NÃO faz o componente ser renderizado
   novamente.**

Sempre acessamos ou alteramos o valor salvo dentro de um ref através da
propriedade `.current`.

---

## 🛠️ Implementando o Input Não-Controlado (`MainForm.tsx`)

Em vez de guardarmos cada letra digitada, vamos usar o `useRef` para "agarrar" o
elemento `<input>` real do HTML. Quando o usuário clicar em "Enviar", nós
olhamos para esse input e pegamos o que está escrito lá dentro, de uma vez só!

**Arquivo:** `src/components/MainForm/index.tsx`

```tsx
import { PlayCircleIcon } from 'lucide-react';
import { Cycles } from '../Cycles';
import { DefaultButton } from '../DefaultButton';
import { DefaultInput } from '../DefaultInput';
import { useTaskContext } from '../../contexts/useTaskContext';

// 1. Trocamos o import do useState pelo useRef
import { useRef } from 'react';

export function MainForm() {
  const { setState } = useTaskContext();

  // 2. Criamos a referência e tipamos para o TypeScript saber que é um input
  const taskNameInput = useRef<HTMLInputElement>(null);

  function handleCreateNewTask(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // 4. No momento do envio, acessamos o elemento HTML (.current) e pegamos o valor (.value)
    console.log('DEU CERTO', taskNameInput.current?.value);
  }

  return (
    <form onSubmit={handleCreateNewTask} className='form' action=''>
      <div className='formRow'>
        <DefaultInput
          labelText='task'
          id='meuInput'
          type='text'
          placeholder='Digite algo'
          // 3. Removemos o 'value' e o 'onChange', e passamos a nossa ref para o input
          ref={taskNameInput}
        />
      </div>

      {/* ... (restante do código: Cycles, DefaultButton, etc) ... */}
    </form>
  );
}
```

## 🕵️‍♂️ Como a Mágica Acontece (Passo a Passo)

1. Quando o React desenha a tela, ele vê a propriedade ref={taskNameInput} no
   seu <DefaultInput />.
2. O React pega o elemento HTML real do input (<input type="text"...>) e guarda
   dentro de taskNameInput.current.
3. O usuário digita "Estudar React". O componente não é re-renderizado.
4. O usuário clica em enviar.
5. A função handleCreateNewTask é chamada.
6. Nós lemos taskNameInput.current.value, que neste exato segundo contém a
   string "Estudar React".

## ⚖️ Qual usar? `useState` (Controlado) ou `useRef` (Não-Controlado)?

Como regra geral no mercado de React:

- **Use** `useState` **(Controlado) quando:** Você precisar reagir imediatamente
  ao que o usuário digita. Exemplos: mostrar uma mensagem de erro enquanto ele
  digita uma senha curta, formatar um CPF automaticamente (`123.4...`), ou
  desabilitar um botão até que o campo esteja preenchido.

**Use** `useRef` **(Não-Controlado) quando:** Você só se importa com o valor
**no momento do envio** do formulário. É mais simples, escreve menos código e
evita renderizações desnecessárias.

Como no nosso Pomodoro nós só precisamos saber o nome da tarefa quando o usuário
clica no "Play", a técnica do `useRef` cai como uma luva. E é com ela que
seguiremos!
