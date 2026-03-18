# 🧹 Limpeza de Código e Configuração do VS Code

Nesta aula, fazemos uma pausa rápida na lógica do React para organizar a nossa
casa.

Primeiro, vamos remover toda aquela "sujeira" (o código de teste do contador)
que fizemos na aula passada no nosso `App.tsx`. Depois, vamos configurar o
visual do nosso editor de código (VS Code) para deixar o ambiente de
desenvolvimento muito mais agradável.

---

## 🗑️ 1. Limpando o `App.tsx`

Todo aquele código do `useState`, a função `handleClick` e a manipulação do
`<Heading>` foram essenciais para entendermos o conceito de estado, mas eles não
fazem parte do nosso projeto final do Pomodoro.

Vamos apagar essas linhas e voltar o nosso `<DefaultInput>` ao normal,
retornando o seu `labelText` para `'task'`.

**Como deve ficar o seu arquivo:** `src/App.tsx`

```tsx
import { Container } from './components/Container';
import { Logo } from './components/Logo';
import { Menu } from './components/Menu';
import { CountDown } from './components/CountDown';
import { DefaultInput } from './components/DefaultInput';
import { Cycles } from './components/Cycles';
import { DefaultButton } from './components/DefaultButton';
import { PlayCircleIcon } from 'lucide-react';
import { Footer } from './components/Footer';

import './styles/theme.css';
import './styles/global.css';

export function App() {
  return (
    <>
      <Container>
        <Logo />
      </Container>
      <Container>
        <Menu />
      </Container>
      <Container>
        <CountDown />
      </Container>

      <Container>
        <form className='form' action=''>
          <div className='formRow'>
            {/* Voltamos o labelText para 'task' */}
            <DefaultInput
              labelText='task'
              id='meuInput'
              type='text'
              placeholder='Digite algo'
            />
          </div>

          <div className='formRow'>
            <p>Lorem ipsum dolor sit amet.</p>
          </div>

          <div className='formRow'>
            <Cycles />
          </div>

          <div className='formRow'>
            <DefaultButton icon={<PlayCircleIcon />} />
          </div>
        </form>
      </Container>

      <Container>
        <Footer />
      </Container>
    </>
  );
}
```
