## Tradução do tipo de task na tabela (`taskTypeDictionary`)

### Objetivo

Exibir na coluna **Tipo** da página `History` rótulos em **português** para cada tipo de task, em vez de mostrar as chaves internas em inglês (`workTime`, `shortBreakTime`, `longBreakTime`).

### 1. Criar um dicionário de tipos

Dentro do `map` que renderiza as tasks, criamos um pequeno dicionário (objeto) que faz o mapeamento entre o tipo salvo no modelo e o texto exibido na interface:

```tsx
{tasksNewestFirst.map(task => {
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
```

### 2. Como funciona o mapeamento

- `task.type` guarda a chave interna do tipo:
  - `workTime`
  - `shortBreakTime`
  - `longBreakTime`
- O objeto `taskTypeDictionary` usa essas chaves como índices e retorna a string em português:
  - `workTime` → **"Foco"**
  - `shortBreakTime` → **"Descanso curto"**
  - `longBreakTime` → **"Descanso longo"**

Na célula da coluna **Tipo**, usamos `taskTypeDictionary[task.type]` para obter o rótulo correto para cada linha.

### Checklist

- [ ] Dicionário `taskTypeDictionary` criado dentro do `map` em `History`.
- [ ] Todas as chaves possíveis (`workTime`, `shortBreakTime`, `longBreakTime`) mapeadas.
- [ ] Coluna **Tipo** usa `taskTypeDictionary[task.type]` em vez de exibir `task.type` diretamente.
