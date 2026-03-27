// src/App.tsx

// 1º: Importamos as variáveis (o tema)
import './styles/theme.css';
// 2º: Importamos os estilos globais
import './styles/global.css';
// import Heading from './components/Heading';
import Container from './components/Container';
import { Logo } from './components/Logo';
import { Menu } from './components/Menu';
import { CountDown } from './components/CountDown';
import { DefaultInput } from './components/DefaultInput';
import { Cycles } from './components/Cycles';
import { DefaultButton } from './components/DefaultButton';
import { PlayCircleIcon } from 'lucide-react';
import { Footer } from './components/Footer';

// import { Heading } from './components/Heading';
// import { Timer } from 'lucide-react';

// import { Container } from './components/Container/index';
// import { Heading } from './components/Heading/index.tsx';



export function App() {
  return (
    <>
      {/* Seção 1: Logo */}
      <Container>
        <Logo />
      </Container>

      {/* Seção 2: Menu */}
      <Container>
        <Menu />
      </Container>
      <Container>
        <CountDown />
      </Container>

      {/* Nossa nova estrutura de formulário */}
      <Container>
        <form className='form' action=''>
          {/* Grupo 1: Label e Input */}
          <div className='formRow'>
            <DefaultInput
              labelText='task'
              id='meuInput'
              type='text'
              placeholder='Digite algo'
            /* Tente adicionar a palavra "disabled" (sem aspas) aqui para ver o estado desativado! */
            />
          </div>

          {/* Grupo 2: Texto de apoio */}
          <div className='formRow'>
            <p>Lorem ipsum dolor sit amet.</p>
          </div>

          {/* Grupo 3: Ciclos */}
          <div className='formRow'>
            <Cycles />
          </div>

          {/* Grupo 4: Botão */}
          <div className='formRow'>
            {/* Mantivemos apenas o botão principal de Play */}
            <DefaultButton icon={<PlayCircleIcon />} />
          </div>
        </form>
      </Container>

      {/* Nosso novo rodapé entra aqui, no seu próprio Container! */}
      <Container>
        <Footer />
      </Container>
    </>
  );
}