## Ordenação dinâmica da tabela de histórico

### Objetivo

Permitir reordenar a tabela da página `History` ao clicar nos cabeçalhos:

- **Tarefa** (`name`)
- **Duração** (`duration`)
- **Data** (`startDate`)

A ideia desta etapa é controlar a ordenação via estado local (`useState`), alternando a direção entre `asc` e `desc` a cada clique.

---

### O que foi implementado

1. Criado o estado `sortTasksOptions` com `useState<SortTasksOptions>`.
2. Inicialização com função (`lazy initialization`) para já entrar com as tasks ordenadas por:
   - `field: 'startDate'`
   - `direction: 'desc'`
3. Criada a função `handleSortTasks` para:
   - receber o `field` clicado;
   - calcular `newDirection` com toggle (`desc -> asc` e `asc -> desc`);
   - recalcular `tasks` via `sortTasks`.
4. Aplicado `onClick` nos `<th>` de Tarefa, Duração e Data.
5. Aplicada classe visual `thSort` para indicar que os cabeçalhos são clicáveis.

---

### Regras da interação

- Ao entrar na página, a lista inicia ordenada por data mais recente.
- Ao clicar em uma coluna ordenável:
  - o campo de ordenação vira o campo clicado;
  - a direção alterna entre crescente e decrescente.
- Ao sair e voltar para a página, a ordenação volta para o padrão inicial (`startDate` + `desc`), porque o estado local é reiniciado.

---

### Código completo dos arquivos modificados

#### `src/pages/History/index.tsx`

```tsx
import { TrashIcon } from 'lucide-react';
import { Container } from '../../components/Container';
import { DefaultButton } from '../../components/DefaultButton';
import { Heading } from '../../components/Heading';
import { MainTemplate } from '../../templates/MainTemplate';

import styles from './styles.module.css';
import { useTaskContext } from '../../contexts/TaskContext';
import { formatDate } from '../../utils/formatDate';
import { getTaskStatus } from '../../utils/getTaskStatus';
import { sortTasks, type SortTasksOptions } from '../../utils/sortTasks';
import { useState } from 'react';

export function History() {
  const { state } = useTaskContext();
  const [sortTasksOptions, setSortTaskOptions] = useState<SortTasksOptions>(
    () => {
      return {
        tasks: sortTasks({ tasks: state.tasks }),
        field: 'startDate',
        direction: 'desc',
      };
    },
  );

  function handleSortTasks({ field }: Pick<SortTasksOptions, 'field'>) {
    const newDirection = sortTasksOptions.direction === 'desc' ? 'asc' : 'desc';

    setSortTaskOptions({
      tasks: sortTasks({
        direction: newDirection,
        tasks: sortTasksOptions.tasks,
        field,
      }),
      direction: newDirection,
      field,
    });
  }

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
                <th
                  onClick={() => handleSortTasks({ field: 'name' })}
                  className={styles.thSort}
                >
                  Tarefa ↕
                </th>
                <th
                  onClick={() => handleSortTasks({ field: 'duration' })}
                  className={styles.thSort}
                >
                  Duração ↕
                </th>
                <th
                  onClick={() => handleSortTasks({ field: 'startDate' })}
                  className={styles.thSort}
                >
                  Data ↕
                </th>
                <th>Status</th>
                <th>Tipo</th>
              </tr>
            </thead>

            <tbody>
              {sortTasksOptions.tasks.map(task => {
                const taskTypeDictionary = {
                  workTime: 'Foco',
                  shortBreakTime: 'Descanso curto',
                  longBreakTime: 'Descanso longo',
                };

                return (
                  <tr key={task.id}>
                    <td>{task.name}</td>
                    <td>{task.duration}min</td>
                    <td>{formatDate(task.startDate)}</td>
                    <td>{getTaskStatus(task, state.activeTask)}</td>
                    <td>{taskTypeDictionary[task.type]}</td>
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

#### `src/pages/History/styles.module.css`

```css
.buttonContainer button {
  min-width: auto;
  margin: 0;
  padding: 1rem;
}

.buttonContainer button svg {
  width: 2rem;
  height: 2rem;
}

.responsiveTable {
  overflow-x: auto;
  border-radius: 0.8rem;
}

.responsiveTable table {
  width: 100%;
  min-width: 64rem;
  font-size: 1.6rem;
  border-collapse: collapse;
}

.responsiveTable th {
  background-color: var(--gray-600);
}

.responsiveTable td {
  background-color: var(--gray-800);
}

.responsiveTable th,
.responsiveTable td {
  border-bottom: 0.2rem solid var(--gray-700);
  text-align: left;
  padding: 1.6rem;
}

.thSort {
  cursor: pointer;
  transition: all 0.1s ease-in-out;
}

.thSort:hover {
  filter: brightness(80%);
}
```

---

### Checklist da etapa

- [ ] Estado `sortTasksOptions` criado com `useState<SortTasksOptions>`.
- [ ] Inicialização padrão: `field = startDate` e `direction = desc`.
- [ ] Função `handleSortTasks` criada com `Pick<SortTasksOptions, 'field'>`.
- [ ] Toggle de direção implementado (`asc`/`desc`).
- [ ] Cabeçalhos de Tarefa, Duração e Data com `onClick`.
- [ ] Classe `thSort` aplicada para feedback visual de coluna clicável.
