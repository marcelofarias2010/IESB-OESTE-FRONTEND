import { Container } from './components/Container';
import { Logo } from './components/Logo';
import { Menu } from './components/Menu';
import { CountDown } from './components/CountDown';

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

      {/* Nossa nova estrutura de formulário */}
      <Container>
        <form className='form' action=''>
          {/* Grupo 1: Label e Input */}
          <div className='formRow'>
            <label htmlFor='meuInput'>task</label>
            <input id='meuInput' type='text' />
          </div>

          {/* Grupo 2: Texto de apoio */}
          <div className='formRow'>
            <p>Lorem ipsum dolor sit amet.</p>
          </div>

          {/* Grupo 3: Ciclos */}
          <div className='formRow'>
            <p>Ciclos</p>
            <p>0 0 0 0 0 0 0</p>
          </div>

          {/* Grupo 4: Botão */}
          <div className='formRow'>
            <button>Enviar</button>
          </div>
        </form>
      </Container>
    </>
  );
}