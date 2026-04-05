# ⏪ Restaurando o Código: Preparação para a Migração Real

Aqui está a instrução detalhada para a aula. Esta é uma aula de transição rápida
para organizarmos a casa!

Nas últimas aulas, nós transformamos o nosso `TaskContextProvider` em um
verdadeiro "laboratório" para entender como o `useReducer` funciona na prática.
Brincamos com contadores, payloads e switch cases. Foi excelente para o
aprendizado!

No entanto, para darmos o próximo passo e aplicarmos o Reducer no nosso projeto
real (o Pomodoro), precisamos voltar o nosso Provider para o estado original em
que ele estava antes dos nossos testes.

O objetivo desta aula é simplesmente que você copie o código limpo abaixo e cole
no seu arquivo, substituindo todos os testes que fizemos.

---

## 🧹 Código Limpo do Provider

Abra o seu arquivo do Provider e substitua todo o conteúdo pelo código abaixo.
Ele já contém o nosso `useState` original, o `useEffect` para monitorarmos o
estado no console e a renderização correta dos `{children}`.

**Arquivo:** `src/contexts/TaskContext/TaskContextProvider.tsx`

```tsx
import { useEffect, useState } from 'react';
import { TaskContext } from '.';
import { initialTaskState } from './initialTaskState';

type TaskContextProviderProps = {
  children: React.ReactNode;
};

export function TaskContextProvider({ children }: TaskContextProviderProps) {
  const [state, setState] = useState(initialTaskState);

  // Monitor de estado: sempre que o estado mudar, ele será impresso no console
  useEffect(() => {
    console.log(state);
  }, [state]);

  return (
    <TaskContext.Provider value={{ state, setState }}>
      {children}
    </TaskContext.Provider>
  );
}
```
