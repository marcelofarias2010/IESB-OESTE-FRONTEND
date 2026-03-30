import { Container } from './Components/Container';
import { Logo } from './Components/Logo';
import { Menu } from './Components/Menu';
import { CountDown } from './Components/Coutdown';
import { DefaultInput } from './Components/DefaultInput';
import { Cycles } from './Components/Cycles';
import { DefaultButton } from './Components/DefaultButton';
import { PlayCircleIcon } from 'lucide-react';
import { Footer } from './Components/Footer'; // <-- Importado!

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