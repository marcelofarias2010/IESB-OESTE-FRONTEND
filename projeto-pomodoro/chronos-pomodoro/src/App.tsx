import { Heading } from './components/Heading';
import { Container } from './components/Container';
import { Menu } from './components/Menu'

import './styles/theme.css';
import './styles/global.css';

export function App() {
  return (
    <>
      <Container>
        <Menu />
      </Container>

      <Container>
        <Heading>MENU</Heading>
      </Container>
    </>
  );
}

export default App;