## Ordenação inicial das tasks com `sortTasks`

### Objetivo

Ordenar a lista de tarefas exibida na página `History` pela data de início (`startDate`) em ordem decrescente, trazendo as tarefas mais recentes para o topo da tabela.

### Contexto da aula

Em JavaScript puro seria possível ordenar diretamente com `array.sort((a, b) => b.startDate - a.startDate)`.  
Mas como a próxima etapa do projeto vai permitir trocar campo/direção da ordenação (nome, duração, data, asc/desc), foi criado um utilitário genérico para centralizar essa lógica: `sortTasks`.

---

### 1) Criar utilitário genérico `sortTasks`

Arquivo: `src/utils/sortTasks.ts`

A função recebe um objeto com opções:

- `tasks`: lista de tarefas;
- `field` (opcional): campo de `TaskModel` usado na comparação;
- `direction` (opcional): `'asc'` ou `'desc'`.

Valores padrão usados:

- `field = 'startDate'`
- `direction = 'desc'`
- `tasks = []`

Com isso, se você chamar apenas `sortTasks({ tasks })`, ele já ordena por data de início da mais nova para a mais antiga.

### 2) Regras implementadas dentro de `sortTasks`

A função trata cenários importantes para manter a ordenação estável:

- **Nulos**
  - se os dois valores forem `null`, mantém a ordem (`return 0`);
  - se apenas um for `null`, o `null` vai para o final.
- **Números**
  - compara por subtração (`a - b` para asc / `b - a` para desc).
- **Strings**
  - compara com `localeCompare` (`A -> Z` no asc / `Z -> A` no desc).
- **Demais tipos**
  - mantém a ordem (`return 0`).

Além disso, usa `return [...tasks].sort(...)` para criar cópia e evitar mutação direta do array original vindo do estado.

---

### 3) Uso no `History`

Arquivo: `src/pages/History/index.tsx`

1. Importar a função:

```tsx
import { sortTasks } from '../../utils/sortTasks';
```

2. Gerar a lista ordenada:

```tsx
const sortedTaks = sortTasks({ tasks: state.tasks });
```

3. Renderizar a tabela com `sortedTaks.map(...)` no lugar de `state.tasks.map(...)`.

Resultado prático: tarefas novas aparecem primeiro, e ao iniciar uma nova task ela sobe para o topo naturalmente.

---

### 4) Código completo dos arquivos da etapa

#### `src/utils/sortTasks.ts`

```ts
// Função genérica para ordenar o array de tasks
//
// O método .sort() recebe uma função que compara dois itens (a, b) e deve retornar:
// - Um número NEGATIVO (-1) se "a" deve vir antes de "b".
// - Um número POSITIVO (1) se "a" deve vir depois de "b".
// - ZERO (0) se não precisa mudar a ordem.
//
// A função cuida de:
// 1. Se o valor for null, joga pro final da lista.
// 2. Se for número, ordena numericamente (asc ou desc).
// 3. Se for string, ordena alfabeticamente (asc ou desc).
//
// O spread [...tasks] cria uma cópia do array original para não alterar ele direto.

import type { TaskModel } from '../models/TaskModel';

// Define os parâmetros esperados pela função
export type SortTasksOptions = {
  tasks: TaskModel[]; // Lista de tarefas que será ordenada
  direction?: 'asc' | 'desc'; // Direção da ordenação: crescente ou decrescente (opcional)
  field?: keyof TaskModel; // Qual campo da tarefa será usado para ordenar (opcional)
};

export function sortTasks({
  field = 'startDate', // Se o campo não for informado, usamos 'startDate' como padrão
  direction = 'desc', // Se a direção não for informada, usamos 'desc' (decrescente)
  tasks = [], // Se nenhuma lista for passada, usamos uma lista vazia
}: SortTasksOptions): TaskModel[] {
  return [...tasks].sort((a, b) => {
    // Pegamos o valor da propriedade escolhida (ex: startDate) em cada tarefa
    const aValue = a[field];
    const bValue = b[field];

    // --- TRATANDO VALORES NULOS ---

    // Se os dois forem nulos, mantemos a ordem atual
    if (aValue === null && bValue === null) return 0;

    // Se apenas o primeiro for nulo, ele vai para o final
    if (aValue === null) return 1;

    // Se apenas o segundo for nulo, ele vai para o final
    if (bValue === null) return -1;

    // --- COMPARAÇÃO NUMÉRICA ---

    // Se os dois valores forem números, fazemos uma subtração para ordenar
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return direction === 'asc'
        ? aValue - bValue // Ex: 1, 2, 3...
        : bValue - aValue; // Ex: 3, 2, 1...
    }

    // --- COMPARAÇÃO DE STRINGS ---

    // Se os dois valores forem textos, usamos localeCompare para comparar em ordem alfabética
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return direction === 'asc'
        ? aValue.localeCompare(bValue) // A -> Z
        : bValue.localeCompare(aValue); // Z -> A
    }

    // --- CASOS NÃO TRATADOS ---

    // Se não for nem número, nem string, nem null, não alteramos a ordem
    return 0;
  });
}
```

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
import { sortTasks } from '../../utils/sortTasks';

export function History() {
  const { state } = useTaskContext();
  const sortedTaks = sortTasks({ tasks: state.tasks });

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
              {sortedTaks.map(task => {
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

---

### Observação da próxima aula

Nesta etapa a ordenação está fixa no padrão inicial (data decrescente).  
Na sequência, a ideia é evoluir para ordenação por clique nos cabeçalhos da tabela (campo + direção com toggle `asc`/`desc`), o que exige controle adicional de estado.

### Checklist

- [ ] `src/utils/sortTasks.ts` criado com opções `tasks`, `field`, `direction`.
- [ ] Defaults definidos para `field = 'startDate'` e `direction = 'desc'`.
- [ ] Comparação com tratamento de `null`, `number` e `string`.
- [ ] Cópia defensiva com `[...]` antes de ordenar.
- [ ] `History` usa `sortTasks({ tasks: state.tasks })`.
- [ ] Renderização da tabela feita com `sortedTaks.map(...)`.
