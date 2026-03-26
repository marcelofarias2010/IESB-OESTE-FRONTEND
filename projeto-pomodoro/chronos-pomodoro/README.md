# ⏪ Desfazendo o Prop Drilling: A Regra de Ouro

Nas aulas anteriores, construímos intencionalmente um cenário de **Prop
Drilling** (passagem excessiva de propriedades). Você deve ter percebido a dor
de cabeça: se um componente no Nível 4 precisa de um estado, todos os
componentes nos Níveis 2 e 3 precisam recebê-lo e repassá-lo.

Nesta aula, vamos formalizar uma regra de ouro para saber quando usar Estado
Local vs. Contexto Global e, em seguida, desfazer toda a complexidade que
criamos para preparar o terreno para a Context API.

---

## 🚩 A Flag de Alerta: Quando usar Contexto?

Aqui vai a dica prática para o seu dia a dia com React:

- **Pai ➡️ Filho (1 Nível):** Use `useState` + Props. É a forma mais simples e
  performática.
- **Pai ➡️ Filho ➡️ Neto (2 Níveis ou mais):** Acenda o sinal de alerta!
- **A "Regra do Intermediário Inútil":** Se você tem um componente no meio do
  caminho (como a nossa `Home`) que recebe uma _prop_ **apenas** para passá-la
  para frente, sem usá-la em momento algum, é hora de usar a Context API.

A Context API permite que você crie um "estado nuvem". Em vez de passar o estado
de mão em mão, qualquer componente que precise da informação pode simplesmente
"olhar para a nuvem" e pegar o que precisa, pulando todos os intermediários.

---

## 🧹 Limpando a Casa

Vamos reverter as alterações dos componentes para deixá-los "limpos" novamente.
Vamos manter o `initialState` lá no `App.tsx` porque vamos aproveitá-lo em
breve, mas removeremos toda a passagem de props.

### 1. Limpando o `App.tsx`

Remova o envio das props para a `<Home />`.

**Arquivo:** `src/App.tsx`

```tsx
import { Home } from './pages/Home';

import './styles/theme.css';
import './styles/global.css';
import { useState } from 'react';
import type { TaskStateModel } from './models/TaskStateModel';

const initialState: TaskStateModel = {
  tasks: [],
  secondsRemaining: 0,
  formattedSecondsRemaining: '00:00',
  activeTask: null,
  currentCycle: 0,
  config: {
    workTime: 25,
    shortBreakTime: 5,
    longBreakTime: 15,
  },
};

export function App() {
  const [state, setState] = useState(initialState);

  // Removidas as props state e setState
  return <Home />;
}
```

**2. Limpando a** `Home` Remova a tipagem `HomeProps` e a recepção das
variáveis.

**Arquivo:** `src/pages/Home/index.tsx`

```tsx
import { Container } from '../../components/Container';
import { CountDown } from '../../components/CountDown';
import { MainForm } from '../../components/MainForm';
import { MainTemplate } from '../../templates/MainTemplate';

export function Home() {
  return (
    <MainTemplate>
      <Container>
        <CountDown />
      </Container>

      <Container>
        <MainForm />
      </Container>
    </MainTemplate>
  );
}
```

**3. Limpando o** `CountDown` Volte para o texto estático "00:00".

**Arquivo:** `src/components/CountDown/index.tsx`

**4. Limpando o** `MainForm` Remova o botão de teste, a função de alterar estado
e as referências ao estado no HTML (volte o texto para "25min").

**Arquivo:** `src/components/MainForm/index.tsx`

```tsx
import { PlayCircleIcon } from 'lucide-react';
import { Cycles } from '../Cycles';
import { DefaultButton } from '../DefaultButton';
import { DefaultInput } from '../DefaultInput';

export function MainForm() {
  return (
    <form className='form' action=''>
      <div className='formRow'>
        <DefaultInput
          labelText='task'
          id='meuInput'
          type='text'
          placeholder='Digite algo'
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

## 🔜 Próximos Passos

Agora que a aplicação está limpa novamente e sem erros, temos o cenário
perfeito. Todo o nosso planejamento e tipagem do `TaskStateModel` já estão
prontos.

Na próxima aula, vamos, finalmente, introduzir a **Context API** e aprender como
criar um estado global que pode ser acessado de qualquer lugar do nosso app, sem
precisar ficar passando de pai para filho!
