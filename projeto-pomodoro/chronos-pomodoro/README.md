## ⏱️ Ajustando a Duração da Tarefa Baseado no Ciclo

Na aula passada, nós conseguimos descobrir qual será o tipo do próximo ciclo
(trabalho, pausa curta ou pausa longa). Agora, vamos usar essa informação para
definir a duração exata da tarefa de forma automática.

## 🧠 Como Funciona? (O "Pulo do Gato")

Se você reparar no nosso `initialTaskState.ts`, o objeto `config` tem três
propriedades: `workTime`, `shortBreakTime` e `longBreakTime`. E, curiosamente,
esses são exatamente os mesmos nomes que a nossa função `getNextCycleType`
retorna!

Isso não é coincidência, mas sim um planejamento prévio. Dessa forma, podemos
acessar o tempo correto no nosso objeto de configuração de forma dinâmica,
usando a notação de colchetes: `state.config[nextCycleType]`.

## 🛠️ Modificando o Código (MainForm)

Vamos aplicar essa pequena mas poderosa alteração na função onde criamos a nova
tarefa.

**Arquivo:** `src/components/MainForm/index.tsx`

Substitua o valor fixo `1` (que usávamos para testes) pela propriedade
correspondente no objeto de configuração do estado:

```tsx
// ... (código anterior)

const newTask: TaskModel = {
  id: Date.now().toString(),
  name: taskName,
  startDate: Date.now(),
  completeDate: null,
  interruptDate: null,
  // 🔴 ANTES: duration: 1,
  // 🟢 AGORA: Pegamos a duração certa baseada no tipo do ciclo!
  duration: state.config[nextCycleType],
  type: nextCycleType,
};

// ... (código seguinte)
```

## ✅ Testando na Prática

Sempre que fizermos alterações que impactem o estado, é bom atualizar a página
completamente (F5 ou Command+R) para limpar qualquer "sujeira" do hot reload.

Agora, se você adicionar tarefas e acompanhar o log (como aquele
`console.log(state)` no Provider), verá o comportamento esperado:

1. **Primeira tarefa (Ciclo 1)**: Duração será 25.
2. **Segunda tarefa (Ciclo 2 - Pausa curta)**: Duração será 5.
3. **Terceira tarefa (Ciclo 3 - Trabalho)**: Duração será 25 novamente.

Tudo funcionando perfeitamente! Como a lógica de determinar o tipo do ciclo já
estava correta, acessar a duração tornou-se um processo muito mais simples e
confiável. Na próxima aula, vamos aproveitar esse embalo e configurar o valor
inicial dos segundos restantes (`secondsRemaining`).
