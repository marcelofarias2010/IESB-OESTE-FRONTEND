## Lógica de status das tasks (`getTaskStatus`)

### Objetivo

Exibir na coluna **Status** da página `History` um texto legível para cada tarefa, garantindo que:

- **Apenas uma task** fique como **"Em Progresso"** (a task ativa atual).
- Tasks concluídas apareçam como **"Completa"**.
- Tasks interrompidas apareçam como **"Interrompida"**.
- Qualquer task que ficou para trás (sem `completeDate` e sem `interruptDate` e que não é a ativa) seja considerada **"Abandonada"**.

### 1. Função utilitária `getTaskStatus`

Criamos o arquivo `src/utils/getTaskStatus.ts` com uma função responsável por centralizar essa regra de negócio:

- Recebe a `task` que será exibida na linha da tabela.
- Recebe também a `activeTask` atual (vinda do contexto), que pode ser `null`.
- Avalia, em ordem, os possíveis estados e retorna uma **string em português**.

Implementação atual:

```ts
import type { TaskModel } from '../models/TaskModel';

export function getTaskStatus(task: TaskModel, activeTask: TaskModel | null) {
  if (task.completeDate) return 'Completa';
  if (task.interruptDate) return 'Interrompida';
  if (task.id === activeTask?.id) return 'Em Progresso';
  return 'Abandonada';
}
```

**Detalhes importantes da lógica:**

- **`completeDate` definido** → a task está finalizada → status **"Completa"**.
- **`interruptDate` definido** → a task foi parada manualmente → status **"Interrompida"**.
- **Sem datas de completa/interrupção**, mas **`task.id === activeTask?.id`** → é a task atual em andamento → status **"Em Progresso"**.
- Qualquer outra combinação (sem datas e não é a ativa) → a pessoa saiu/abriu outra task → status **"Abandonada"**.
- O uso de `activeTask?.id` garante que, se `activeTask` for `null`, o acesso ao `id` não quebra o código.

### 2. Uso na página `History`

No arquivo `src/pages/History/index.tsx`:

1. Importamos a função utilitária:

```tsx
import { getTaskStatus } from '../../utils/getTaskStatus';
```

2. Dentro do `map` das tasks, usamos `getTaskStatus` para preencher a coluna **Status**:

```tsx
<td>{getTaskStatus(task, state.activeTask)}</td>
```

Assim, a tabela de histórico sempre mostra um único item **"Em Progresso"** (quando houver uma task ativa) e classifica corretamente as demais como **"Completa"**, **"Interrompida"** ou **"Abandonada"**, mesmo depois de recarregar a página.

### Checklist

- [ ] Arquivo `src/utils/getTaskStatus.ts` criado e exportando `getTaskStatus`.
- [ ] Lógica de status segue a ordem: `completeDate` → `interruptDate` → `task.id === activeTask?.id` → `Abandonada`.
- [ ] Página `History` importa `getTaskStatus`.
- [ ] Coluna **Status** usa `getTaskStatus(task, state.activeTask)` dentro do `map`.
