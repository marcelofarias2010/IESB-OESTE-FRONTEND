# Tarefa: mensagens contextuais e componente `Tips`

## Objetivo

Mostrar **duas mensagens diferentes** conforme o usuário está **com ciclo rodando** (botão de parar visível) ou **sem ciclo ativo** (só o botão de iniciar):

| Situação | Tom da mensagem | De onde vem o tipo (`workTime` / `shortBreakTime` / `longBreakTime`) |
|----------|-----------------|----------------------------------------------------------------------|
| **Ciclo ativo** (`state.activeTask` existe) | **Presente** — o que fazer *agora* | `state.activeTask.type` (o tipo da tarefa que está em andamento) |
| **Ciclo não ativo** (`state.activeTask` é `null`) | **Futuro** — o que vai acontecer *quando clicar em iniciar* | `getNextCycleType(getNextCycle(state.currentCycle))` (próximo ciclo da sequência) |

Assim o texto não mistura “próximo ciclo” enquanto o contador já está rodando, evitando confusão.

Em cada situação existem **três variantes** de texto (uma para foco, uma para pausa curta, uma para pausa longa). Em vez de vários `if/else`, usamos **dois objetos** que mapeiam cada tipo para um pedaço de JSX.

Por fim, essa lógica sai do `MainForm` e vai para o componente **`Tips`**, deixando o formulário mais enxuto.

## Pré-requisitos

- `useReducer`, `TaskContext` e `MainForm` funcionando (iniciar / interromper tarefa).
- Funções utilitárias `getNextCycle` e `getNextCycleType` já presentes em `src/utils/`.

## Passo 1 — Duração da tarefa alinhada ao `config`

Hoje a tarefa pode estar com `duration` fixo (ex.: `1`). O tempo da sessão deve bater com **`state.config`**, usando o **tipo do próximo ciclo** (`nextCyleType`), o mesmo já usado em `type` da nova tarefa.

No arquivo `src/components/MainForm/index.tsx`, dentro de `handleCreateNewTask`, defina `duration` assim:

```ts
const newTask: TaskModel = {
  id: Date.now().toString(),
  name: taskName,
  startDate: Date.now(),
  completeDate: null,
  interruptDate: null,
  duration: state.config[nextCyleType],
  type: nextCyleType,
};
```

`nextCyleType` deve ser calculado **antes** (como já é feito no formulário):

```ts
const nextCycle = getNextCycle(state.currentCycle);
const nextCyleType = getNextCycleType(nextCycle);
```

## Passo 2 — Criar o componente `Tips`

Crie a pasta `src/components/Tips/` e o arquivo `index.tsx` com o conteúdo abaixo.

Ideia central:

- `tipsForWhenActiveTask`: mensagens de **presente**, indexadas por `state.activeTask.type`.
- `tipsForNoActiveTask`: mensagens de **futuro**, indexadas por `nextCyleType` (próximo ciclo antes de clicar em iniciar).

```tsx
import { useTaskContext } from '../../contexts/TaskContext';
import { getNextCycle } from '../../utils/getNextCycle';
import { getNextCycleType } from '../../utils/getNextCycleType';

export function Tips() {
  const { state } = useTaskContext();
  const nextCycle = getNextCycle(state.currentCycle);
  const nextCyleType = getNextCycleType(nextCycle);

  const tipsForWhenActiveTask = {
    workTime: <span>Foque por {state.config.workTime}min</span>,
    shortBreakTime: <span>Descanse por {state.config.shortBreakTime}min</span>,
    longBreakTime: <span>Descanso longo</span>,
  };

  const tipsForNoActiveTask = {
    workTime: (
      <span>
        Próximo ciclo é de <b>{state.config.workTime}min</b>
      </span>
    ),
    shortBreakTime: (
      <span>Próximo descanso é de {state.config.shortBreakTime}min</span>
    ),
    longBreakTime: <span>Próximo descanso será longo</span>,
  };

  return (
    <>
      {!!state.activeTask && tipsForWhenActiveTask[state.activeTask.type]}
      {!state.activeTask && tipsForNoActiveTask[nextCyleType]}
    </>
  );
}
```

**Observação:** `!!state.activeTask` força um booleano explícito; `!state.activeTask` cobre o caso “sem tarefa ativa”.

## Passo 3 — Usar `Tips` no `MainForm`

Importe e renderize o componente em uma linha do formulário (por exemplo, abaixo do campo de nome). O `MainForm` continua precisando de `getNextCycle` / `getNextCycleType` **apenas** para montar a `newTask` no submit, não para as dicas.

Trecho esperado do `src/components/MainForm/index.tsx`:

```tsx
import { Tips } from '../Tips';

// ... dentro do return do form:
<div className='formRow'>
  <Tips />
</div>
```

Exemplo de `handleCreateNewTask` completo coerente com esta tarefa:

```tsx
function handleCreateNewTask(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();

  if (taskNameInput.current === null) return;

  const taskName = taskNameInput.current.value.trim();

  if (!taskName) {
    alert('Digite o nome da tarefa');
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
}
```

## Como validar

1. Sem tarefa ativa: a mensagem fala do **próximo** ciclo (foco / pausa curta / pausa longa) e os minutos batem com `state.config`.
2. Após clicar em iniciar: a mensagem fala do **agora** (ex.: “Foque por …”) e não usa “próximo ciclo”.
3. Após interromper: volta ao modo “futuro”.
4. Textos curtos o suficiente para não quebrar feio em viewports estreitas (teste no DevTools, ~360px de largura).

## Opcional (avançado)

- Passar `nextCyleType` para `Tips` via **props** em vez de recalcular dentro do componente (mesmo resultado, acoplamento diferente).
- Unificar textos muito parecidos com um único modelo de frase e só trocar números/rótulos, se quiser menos repetição.
