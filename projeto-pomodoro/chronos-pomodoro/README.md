# 🚀 Iniciando a Lógica: Capturando o Envio do Formulário

Agora que a nossa arquitetura de estado (Context API) está organizada, vamos dar
uma pausa na complexidade estrutural e começar a dar vida à aplicação. O coração
do nosso Pomodoro é o botão de "Play" (iniciar ciclo). Ele é, na verdade, o
botão de envio (submit) do nosso formulário de tarefas.

Nesta aula, vamos interceptar esse envio para evitar que o navegador recarregue
a página, preparando o terreno para capturarmos os dados do input na próxima
etapa.

---

## 🛑 O Problema do Comportamento Padrão

Se você abrir a aba **Network** (Rede) do painel de desenvolvedor do seu
navegador, limpar os dados e clicar no botão de Play do nosso formulário, verá
que a página inteira é recarregada.

Esse é o comportamento padrão do HTML: ao dar _submit_ em um `<form>`, ele tenta
enviar os dados para algum lugar e recarrega a tela. No React (que constrói
aplicações de página única - _SPA_), nós **nunca** queremos que a página
recarregue! Nós mesmos vamos gerenciar esses dados via JavaScript.

---

## 🎯 Interceptando o Envio (`MainForm.tsx`)

Vamos criar uma função para lidar com o envio do formulário (`onSubmit`).

> 💡 **Dica de TypeScript:** Se você não souber qual é o tipo do evento, você
> pode criar uma função anônima provisória dentro do `onSubmit={(e) => {}}`,
> passar o mouse por cima do `e` e o VS Code vai te mostrar a tipagem exata para
> você copiar! Neste caso, é `React.FormEvent<HTMLFormElement>`.

**Arquivo:** `src/components/MainForm/index.tsx`

```tsx
import { PlayCircleIcon } from 'lucide-react';
import { Cycles } from '../Cycles';
import { DefaultButton } from '../DefaultButton';
import { DefaultInput } from '../DefaultInput';
import { useTaskContext } from '../../contexts/useTaskContext';

export function MainForm() {
  const { setState } = useTaskContext();

  // 1. Criamos a função Handler para o formulário
  function handleCreateNewTask(event: React.FormEvent<HTMLFormElement>) {
    // 2. Previne o comportamento padrão (recarregar a página)
    event.preventDefault();

    // 3. Log de teste para confirmar que funcionou
    console.log('DEU CERTO');
  }

  // Apenas removi a função handleClick do botão de teste da aula passada,
  // pois já limpamos isso no passo anterior.

  return (
    // 4. Conectamos a nossa função ao evento onSubmit do form
    <form onSubmit={handleCreateNewTask} className='form' action=''>
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

## ✅ Testando o Resultado

1. Abra o console do seu navegador.
2. Clique no botão de Play no seu formulário.
3. Você deve ver a mensagem "DEU CERTO" aparecer no console.
4. **O mais importante:** A página **não** deve recarregar e a aba Network não
   deve disparar novas requisições de recarregamento de página.

**Próximos Passos:** Conseguimos segurar o formulário! Agora precisamos
descobrir o que o usuário digitou dentro do nosso campo de texto. Como o nosso
`<DefaultInput />` é um componente customizado, capturar o valor dele exige uma
técnica específica no React (o conceito de _forwardRef_ ou o uso de estados
controlados).
