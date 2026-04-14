# Tarefa: notificações com React Toastify + Adapter + Container próprio

## Objetivo da aula

Substituir `alert()` por notificações visuais com `react-toastify`, manter o app desacoplado da biblioteca externa usando o padrão **Adapter**, e centralizar a configuração do `ToastContainer` em um componente próprio (`MessagesContainer`).

Com isso, a aplicação:

- mostra mensagens mais bonitas e controláveis;
- evita espalhar dependência direta da lib em vários componentes;
- facilita manutenção futura (se trocar de lib, muda em 1 ponto principal).

---

## Passo 1 — Instalar a biblioteca

No terminal, na raiz do projeto:

```bash
npm i react-toastify
```

> Se os toasts aparecerem sem estilo base, importe também o CSS padrão da lib em um ponto global (por exemplo em `src/main.tsx`): `import 'react-toastify/dist/ReactToastify.css';`.

---

## Passo 2 — Criar o Adapter de mensagens

Arquivo: `src/adapters/showMessage.ts`

Ideia: em vez de chamar `toast.success`, `toast.error` etc. direto nos componentes, usamos `showMessage.success`, `showMessage.error`, etc.

### Código-fonte

```ts
import { toast } from 'react-toastify';

export const showMessage = {
  success: (msg: string) => toast.success(msg),
  error: (msg: string) => toast.error(msg),
  warn: (msg: string) => toast.warn(msg),
  warning: (msg: string) => toast.warning(msg),
  info: (msg: string) => toast.info(msg),
  dismiss: () => toast.dismiss(),
};
```

---

## Passo 3 — Criar o componente de container global

Arquivo: `src/components/MessagesContainer/index.tsx`

Esse componente envolve os `children` e injeta o `ToastContainer` uma única vez para a aplicação.

### Código-fonte

```tsx
import { Bounce, ToastContainer } from 'react-toastify';

type MessagesContainerProps = {
  children: React.ReactNode;
};

export function MessagesContainer({ children }: MessagesContainerProps) {
  return (
    <>
      {children}

      <ToastContainer
        position='top-center'
        autoClose={10000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='light'
        transition={Bounce}
      />
    </>
  );
}
```

---

## Passo 4 — Integrar no topo da aplicação

Arquivo: `src/App.tsx`

Envolva o conteúdo principal com `MessagesContainer`.

### Código-fonte

```tsx
import { Home } from './pages/Home';
import './styles/theme.css';
import './styles/global.css';
import { TaskContextProvider } from './contexts/TaskContext';
import { MessagesContainer } from './components/MessagesContainer';

export function App() {
  return (
    <TaskContextProvider>
      <MessagesContainer>
        <Home />
      </MessagesContainer>
    </TaskContextProvider>
  );
}
```

---

## Passo 5 — Substituir `alert` no formulário

Arquivo: `src/components/MainForm/index.tsx`

Troca principal:

- `showMessage.warn('Digite o nome da tarefa')` no lugar de `alert`;
- `showMessage.dismiss()` no início das ações para limpar toasts antigos;
- toast de sucesso ao iniciar;
- toast de erro ao interromper.

### Código-fonte

```tsx
import { PlayCircleIcon, StopCircleIcon } from 'lucide-react';
import { Cycles } from '../Cycles';
import { DefaultButton } from '../DefaultButton';
import { DefaultInput } from '../DefaultInput';
import { useRef } from 'react';
import type { TaskModel } from '../../models/TaskModel';
import { useTaskContext } from '../../contexts/TaskContext';
import { getNextCycle } from '../../utils/getNextCycle';
import { getNextCycleType } from '../../utils/getNextCycleType';
import { TaskActionTypes } from '../../contexts/TaskContext/taskActions';
import { Tips } from '../Tips';
import { showMessage } from '../../adapters/showMessage';

export function MainForm() {
  const { state, dispatch } = useTaskContext();
  const taskNameInput = useRef<HTMLInputElement>(null);

  function handleCreateNewTask(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    showMessage.dismiss();

    if (taskNameInput.current === null) return;

    const taskName = taskNameInput.current.value.trim();

    if (!taskName) {
      showMessage.warn('Digite o nome da tarefa');
      return;
    }

    const nextCycle = getNextCycle(state.currentCycle);
    const nextCyleType = getNextCycleType(nextCycle);

    const newTask: TaskModel = {
      id: Date.now().toString(),
      name: taskName,
      startDate: Date.now(),
      completeDate: null,
      interruptDate: null,
      duration: state.config[nextCyleType],
      type: nextCyleType,
    };

    dispatch({ type: TaskActionTypes.START_TASK, payload: newTask });
    showMessage.success('Tarefa iniciada');
  }

  function handleInterruptTask() {
    showMessage.dismiss();
    showMessage.error('Tarefa interrompida!');
    dispatch({ type: TaskActionTypes.INTERRUPT_TASK });
  }

  return (
    <form onSubmit={handleCreateNewTask} className='form' action=''>
      <div className='formRow'>
        <DefaultInput
          labelText='task'
          id='meuInput'
          type='text'
          placeholder='Digite algo'
          ref={taskNameInput}
          disabled={!!state.activeTask}
        />
      </div>

      <div className='formRow'>
        <Tips />
      </div>

      {state.currentCycle > 0 && (
        <div className='formRow'>
          <Cycles />
        </div>
      )}

      <div className='formRow'>
        {!state.activeTask && (
          <DefaultButton
            aria-label='Iniciar nova tarefa'
            title='Iniciar nova tarefa'
            type='submit'
            icon={<PlayCircleIcon />}
          />
        )}

        {!!state.activeTask && (
          <DefaultButton
            aria-label='Interromper tarefa atual'
            title='Interromper tarefa atual'
            type='button'
            color='red'
            icon={<StopCircleIcon />}
            onClick={handleInterruptTask}
            key='botao_button'
          />
        )}
      </div>
    </form>
  );
}
```

---

## Passo 6 — Ajustar tema para combinar com Toastify

Arquivo: `src/styles/theme.css`

Foram adicionadas variáveis CSS do Toastify dentro de `:root` e no bloco de tema claro `:root[data-theme='light']`.

### Trecho relevante da aula

```css
/* 🔔 Cores do Toastify (notificações) */
--toastify-color-light: var(--text-default);
--toastify-color-dark: var(--text-default);
--toastify-color-info: var(--info);
--toastify-color-success: var(--success);
--toastify-color-warning: var(--warning);
--toastify-color-error: var(--error);
--toastify-text-color-light: #0a0f1a;
--toastify-text-color-dark: #e6e9f0;
--toastify-color-progress-light: var(--primary);
--toastify-color-progress-dark: var(--primary);
```

e no tema claro:

```css
/* 🔔 Toastify no modo claro */
--toastify-text-color-light: #e6e9f0;
--toastify-text-color-dark: #e6e9f0;
```

> O restante do arquivo mantém a estrutura completa de tokens de cor (gray, primary, links, alerts e textos), com comentários explicativos.

---

## Resultado esperado

1. Ao tentar enviar tarefa vazia: toast de aviso (`warn`) no topo.
2. Ao iniciar tarefa válida: toast de sucesso (`success`).
3. Ao interromper tarefa: toast de erro (`error`).
4. Toast pausa o tempo ao perder foco da aba (`pauseOnFocusLoss`) e ao passar mouse (`pauseOnHover`).
5. Com troca de tema claro/escuro, o estilo do toast acompanha as variáveis definidas em `theme.css`.

---

## Por que usar Adapter aqui?

Porque `showMessage` protege seus componentes da API externa:

- hoje: `react-toastify`;
- amanhã: qualquer outra lib.

Você altera o adapter e o container, sem precisar refatorar todos os lugares que mostram mensagem.
