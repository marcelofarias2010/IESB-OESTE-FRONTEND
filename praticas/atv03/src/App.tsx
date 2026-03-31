import { Container } from './components/Container'
import { CountDown } from './components/CountDown'
import { DefaultInput } from './components/DefaultInput'
import { Cycles } from './components/Cycles'
import { DefaultButton } from './components/DefaultButton'
import { Footer } from './components/Footer'

import { PlayCircleIcon } from 'lucide-react'

import './styles/theme.css'
import './styles/global.css'

export function App() {
  return (
    <>
      <Container>
        <CountDown />
      </Container>

      <Container>
        <form className='form'>
          <div className='formRow'>
            <DefaultInput
              id='task'
              labelText='Tarefa'
              type='text'
              placeholder='Digite sua tarefa'
            />
          </div>

          <div className='formRow'>
            <p>Foque e seja produtivo 🚀</p>
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
  )
}