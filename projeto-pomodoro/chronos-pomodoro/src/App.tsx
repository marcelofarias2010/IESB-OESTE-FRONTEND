import { Container } from './components/Container';
import { Logo } from './components/Logo';
import { Menu } from './components/Menu';
import { CountDown } from './components/CountDown';
import { DefaultInput} from './components/DefaultInput'
import { Cycles } from './components/Cycles';
import { DefaultButton } from './components/DefaultButton';

import { Footer } from './components/Footer';

import './styles/theme.css';
import './styles/global.css';
import { toast, ToastContainer } from 'react-toastify';
import { FaCheckCircle } from 'react-icons/fa';

const notifysucesso = () => toast.success("sucesso!")

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
                        <p>Iniciativo pomodoro tem como aumentar a produtividade de maneira simples.</p>
                    </div>

                    <div className='formRow'>
                        <Cycles />
                    </div>
                    botões
                    <div className='formRow'>
                        <DefaultButton
                            icon={<FaCheckCircle />
                            }
                            onClick={notifysucesso}
                            color='green'
                        />

                    </div>
                </form>
            </Container>

            <Container>
                <Footer />
            </Container>

            <ToastContainer
                toastClassName="toast"
            />
        </>
    );
}