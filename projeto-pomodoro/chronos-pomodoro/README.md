# ⏱️ Duração Dinâmica: Conectando o Tipo de Ciclo às Configurações

Agora que já temos o `nextCycleType` (Tempo de Foco, Pausa Curta ou Pausa
Longa), podemos usar esse exato nome para buscar a duração correspondente lá nas
configurações (`config`) do nosso estado inicial.

---

## 🔗 1. Configurando a Duração Dinâmica (`MainForm.tsx`)

A mágica acontece porque as chaves do objeto `state.config` têm exatamente os
mesmos nomes que os tipos de ciclo do nosso `TaskModel`. Com isso, podemos
acessar o valor dinamicamente usando colchetes: `state.config[nextCycleType]`.

**Arquivo:** `src/components/MainForm/index.tsx`

```tsx
function handleCreateNewTask(event: React.FormEvent<HTMLFormElement>) {
  // ... validações ...

  const newTask: TaskModel = {
    id: Date.now().toString(),
    name: taskName,
    startDate: new Date(),
    completeDate: null,
    interruptDate: null,

    // Substituímos o valor fixo (1) pela busca dinâmica no estado de configurações
    duration: state.config[nextCycleType],

    type: nextCycleType,
  };

  // Agora o secondsRemaining será calculado com base na duração correta!
  const secondsRemaining = newTask.duration * 60;

  // ... setState ...
}
```

## ✅ 2. Testando a Duração

Com o nosso console aberto (aquele log dentro do `useEffect`), você pode testar
o fluxo de tarefas:

1. Primeira Tarefa: O `duration` deve puxar 25 (e o `secondsRemaining` será
   1500).
2. Segunda Tarefa (Pausa Curta): O `duration` deve puxar 5.
3. Oitava Tarefa (Pausa Longa): O `duration` deve puxar 15.

Tudo batendo? Maravilha!

## 🔜 Preparando o Terreno: Formatando os Segundos

Para adiantar, você já pode criar o arquivo utilitário que fará essa matemática.
Ele pegará o total de segundos e dividirá em minutos e segundos restantes:

**Arquivo:** `src/utils/formatSecondsToMinutes.ts`

```tsx
export function formatSecondsToMinutes(seconds: number) {
  // Pega a parte inteira dos minutos e garante que tenha 2 dígitos (ex: "05")
  const minutes = String(Math.floor(seconds / 60)).padStart(2, '0');

  // Pega o resto da divisão por 60 (os segundos que sobraram) e garante 2 dígitos
  const secondsMod = String(Math.floor(seconds % 60)).padStart(2, '0');

  return `${minutes}:${secondsMod}`;
}
```

E no seu `MainForm.tsx`, você aplicará essa função direto no `setState`:

```tsx
import { formatSecondsToMinutes } from '../../utils/formatSecondsToMinutes';

// ... dentro da criação da task ...
        formattedSecondsRemaining: formatSecondsToMinutes(secondsRemaining),
```
