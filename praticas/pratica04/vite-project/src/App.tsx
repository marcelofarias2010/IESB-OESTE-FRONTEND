import { Container } from './components/Container';
import { Logo } from './components/Logo';
import { Menu } from './components/Menu';
import { CountDown } from './components/CountDown';
import { DefaultInput } from './components/DefaultInput';

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
            {/* Agora passamos o labelText e podemos passar qualquer prop nativa! */}
            <DefaultInput
              id='meuInput'
              type='text'
              labelText='Fim do Mundo'
              /* Tente adicionar: disabled ou placeholder="Digite algo" */
            />
          </div>

          <div className='formRow'>
            <p>Explosão do Mundo</p>
          </div>

          <div className='formRow'>
            <p>Ciclos</p>
            <p>0 0 0 0 0 0 0</p>
          </div>

          <div className='formRow'>
  <DefaultInput
    labelText='task'
    id='meuInput'
    type='text'
    placeholder='Digite algo'
    /* Tente adicionar a palavra "disabled" (sem aspas) aqui para ver o estado desativado! */
  />
</div>;
        </form>
      </Container>
    </>
  );
}