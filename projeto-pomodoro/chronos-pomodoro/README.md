# Tarefa: histórico com **tasks reais** do estado

## Objetivo

Substituir linhas mock (`Array.from`) por dados vindos de **`state.tasks`** no `useTaskContext`, usando **`task.id`** como `key`, exibindo colunas provisórias (data como string, status cru, tipo sem traduzir). Ordenar para que a **última tarefa criada apareça primeiro**.

Nas próximas aulas: formatação de data, status (em progresso / completa / interrompida / abandonada), dicionário de tipo, estado vazio, botão de limpar histórico e página de configurações (sem limpar `localStorage` manualmente).

## Pré-requisitos

- `TaskContextProvider` persistindo estado (ex.: `localStorage`).
- Ao mudar **`initialTaskState.config`** (25/5/15 min) e o storage já tiver estado antigo, pode ser preciso **limpar** a chave `state` no DevTools → **Application** → **Local Storage** → **Clear** (até existir UI de configuração).

## Passo 1 — `useTaskContext` na página History

Importe o hook e leia `state.tasks`.

## Passo 2 — Ordenação (mais recente primeiro)

O array `tasks` no reducer costuma ir **acumulando** na ordem em que as tarefas foram criadas. Para listar **do mais novo para o mais antigo**, use uma cópia invertida (não mutar `state.tasks`):

```ts
const tasksNewestFirst = [...state.tasks].reverse();
```

## Passo 3 — `map` com `key={task.id}`

Cada linha: `key={task.id}` — não use índice do array quando houver id estável.

## Passo 4 — Colunas (provisório)

| Coluna    | Fonte / nota |
|-----------|----------------|
| Tarefa    | `task.name` |
| Duração   | `task.duration` + sufixo `min` |
| Data      | Por ora `new Date(task.startDate).toISOString()` ou similar; depois formatador dedicado |
| Status    | Depois: lógica com `completeDate`, `interruptDate`, “em progresso”, abandonada; por ora pode exibir valor cru para debug |
| Tipo      | `task.type` (`workTime`, etc.); depois dicionário PT-BR |

## Passo 5 — Atualização do `Heading` (suporte ao título + botão)

Para o cabeçalho da página History (texto **History** + botão de lixeira) funcionar com o layout atual, o `Heading` permanece como componente simples que renderiza `children` dentro de `h1` com classe CSS.

Arquivo: `src/components/Heading/index.tsx`

```tsx
import styles from './styles.module.css';

type HeadingProps = {
  children: React.ReactNode;
};

export function Heading({ children }: HeadingProps) {
  return <h1 className={styles.heading}>{children}</h1>;
}
```

## Código-fonte atual — `src/pages/History/index.tsx`

```tsx
import { TrashIcon } from 'lucide-react';
import { Container } from '../../components/Container';
import { DefaultButton } from '../../components/DefaultButton';
import { Heading } from '../../components/Heading';
import { MainTemplate } from '../../templates/MainTemplate';

import styles from './styles.module.css';
import { useTaskContext } from '../../contexts/TaskContext';

export function History() {
  const { state } = useTaskContext();
  /** Mais recente primeiro (última criada no topo). */
  const tasksNewestFirst = [...state.tasks].reverse();

  return (
    <MainTemplate>
      <Container>
        <Heading>
          <span>History</span>
          <span className={styles.buttonContainer}>
            <DefaultButton
              icon={<TrashIcon />}
              color='red'
              aria-label='Apagar todo o histórico'
              title='Apagar histórico'
            />
          </span>
        </Heading>
      </Container>

      <Container>
        <div className={styles.responsiveTable}>
          <table>
            <thead>
              <tr>
                <th>Tarefa</th>
                <th>Duração</th>
                <th>Data</th>
                <th>Status</th>
                <th>Tipo</th>
              </tr>
            </thead>

            <tbody>
              {tasksNewestFirst.map(task => {
                return (
                  <tr key={task.id}>
                    <td>{task.name}</td>
                    <td>{task.duration}min</td>
                    <td>{new Date(task.startDate).toISOString()}</td>
                    <td>{task.interruptDate}</td>
                    <td>{task.type}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Container>
    </MainTemplate>
  );
}
```

## Como validar

1. Crie algumas tarefas na Home, interrompa ou complete algumas.
2. Abra **History**: linhas batem com `state.tasks`, última criada no **topo**.
3. Recarregue: dados persistem conforme sua estratégia de `localStorage`.

## Próximas aulas (fora desta tarefa)

- Formatar **data/hora** de forma legível.
- **Status** com quatro estados e regras claras.
- **Traduzir** `task.type` para texto amigável.
- **Lista vazia**: mensagem amigável em vez de tabela vazia.
- **Botão** de limpar histórico com `dispatch` / ação dedicada.
- Página de **configurações** para não depender de limpar storage na mão.

## Checklist

- [ ] `state.tasks.map` (ou cópia ordenada) em vez de `Array.from` mock.
- [ ] `key={task.id}`.
- [ ] Ordem: mais recente primeiro (`[...state.tasks].reverse()` ou equivalente).
- [ ] `Heading` atualizado/confirmado para receber `children` e compor título + ações (lixeira).
- [ ] Entender que mudanças em `config` podem exigir limpar `localStorage` até ter UI de settings.
