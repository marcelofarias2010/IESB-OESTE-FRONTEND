# ⌨️ Capturando Dados: O Padrão de Inputs Controlados

Vamos explorar a forma mais clássica e poderosa de lidar com inputs no React: os
Controlled Components (Componentes Controlados)!

Na aula passada, nós conseguimos interceptar o envio do formulário, mas ainda
não sabemos o que o usuário digitou. Nesta aula, vamos aprender a técnica mais
comum no React para ler o valor de um campo de texto: o **Input Controlado**
(_Controlled Component_).

---

## 🎭 O que é um Input Controlado?

No HTML tradicional, o próprio `<input>` guarda o que você digita nele. No
React, nós gostamos de ter o controle de tudo. Um Input Controlado é aquele em
que o React (através de um estado) é a "única fonte da verdade".

Para transformar um input comum em um input controlado, precisamos de duas
coisas:

1. Uma propriedade `value` atrelada a uma variável de estado.
2. Um evento `onChange` que atualiza esse estado a cada tecla digitada.

Se você colocar apenas o `value` sem o `onChange`, o React vai travar o seu
input e você não conseguirá digitar nada nele!

---

## 🛠️ Implementando o Input Controlado (`MainForm.tsx`)

Vamos criar um estado chamado `taskName` e conectá-lo ao nosso
`<DefaultInput />`.

**Arquivo:** `src/components/MainForm/index.tsx`

```tsx
import { PlayCircleIcon } from 'lucide-react';
import { Cycles } from '../Cycles';
import { DefaultButton } from '../DefaultButton';
import { DefaultInput } from '../DefaultInput';
import { useTaskContext } from '../../contexts/useTaskContext';

// 1. Importe o useState
import { useState } from 'react';

export function MainForm() {
  const { setState } = useTaskContext();

  // 2. Crie o estado para guardar o que o usuário digita
  const [taskName, setTaskName] = useState('');

  function handleCreateNewTask(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // 5. Agora podemos ver o valor exato no momento do envio!
    console.log('DEU CERTO', taskName);
  }

  return (
    <form onSubmit={handleCreateNewTask} className='form' action=''>
      <div className='formRow'>
        <DefaultInput
          labelText='task'
          id='meuInput'
          type='text'
          placeholder='Digite algo'
          // 3. Forçamos o input a exibir o que está no estado
          value={taskName}
          // 4. A cada tecla (e.target.value), atualizamos o estado
          onChange={e => setTaskName(e.target.value)}
        />
      </div>

      <div className='formRow'>
        <p>Próximo intervalo é de 25min</p>
      </div>

      <div className='formRow'>
        <Cycles />
      </div>

      <div className='formRow'>
        <DefaultButton icon={<PlayCircleIcon />} />
      </div>
    </form>
  );
}
```

## 🕵️‍♂️ Como a Mágica Acontece (Passo a Passo)

1. O usuário aperta a tecla "A".
2. O evento `onChange` é disparado. Ele captura a letra "A" (através de
   `e.target.value`).
3. A função `setTaskName('A')` é chamada.
4. O React percebe que o estado mudou e re-renderiza o componente
   `<MainForm />`.
5. O componente desenha o input novamente, mas agora passando `value={'A'}`.
6. A letra "A" aparece na tela.

Tudo isso acontece em milissegundos **para cada** tecla que você digita!

## ⚠️ Um Alerta (Mas não precisa surtar!)

Como vimos no passo a passo acima, um input controlado faz o componente ser
renderizado novamente a cada única tecla digitada.

**Isso vai deixar meu site lento?** Na imensa maioria das vezes: **NÃO**. Para
formulários normais (tela de login, cadastro, pomodoro, etc.), os navegadores
modernos lidam com essas renderizações com as mãos amarradas nas costas.

No entanto, se você estiver construindo um formulário absurdamente gigante (ex:
uma planilha com 100 campos na mesma tela), essa técnica pode causar lentidão.

Para esses casos raros (e também para conhecermos outras ferramentas do React),
existe uma segunda forma de capturar dados de inputs sem causar
re-renderizações. É a técnica dos Inputs Não-Controlados usando Refs.
