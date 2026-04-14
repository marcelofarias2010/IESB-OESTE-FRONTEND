# 📊 Modelando o Estado Global da Aplicação

Antes de sairmos criando múltiplos `useState` espalhados pelos componentes,
precisamos dar um passo atrás e planejar: **como os dados da nossa aplicação vão
se comportar?** Nossa aplicação Chronos Pomodoro possui um timer, um histórico
de tarefas, configurações de tempo e controle de ciclos. Como todos esses dados
precisam "conversar" entre si (o timer precisa saber a configuração de tempo, o
histórico precisa saber quando o timer acaba), vamos centralizar tudo em um
**Estado Global**.

Nesta aula, vamos criar as tipagens (Models) que definirão o formato exato desse
estado.

---

## 🏗️ 1. O Modelo da Tarefa (`TaskModel`)

Primeiro, vamos definir como é o formato de uma única tarefa dentro do nosso
histórico. Crie uma pasta `models` dentro de `src` e adicione o arquivo abaixo.

Optamos por usar `type` em vez de `interface` ou `class` pois nossos modelos não
terão lógica embutida, serão apenas a representação visual dos dados.

**Arquivo:** `src/models/TaskModel.ts`

```typescript
import type { TaskStateModel } from './TaskStateModel';

export type TaskModel = {
  id: string; // Identificador único da tarefa
  name: string; // Nome digitado no input
  duration: number; // Duração em minutos
  startDate: number; // Timestamp de quando começou (usamos number para facilitar o localStorage)
  completeDate: number | null; // quando o timer chega ao final
  interruptDate: number | null; // quando a task for interrompida
  type: keyof TaskStateModel['config'];
```

💡 **Por que usar `number` para as datas?** Ao invés de usar o objeto Date
nativo do JavaScript, vamos salvar as datas usando `Date.now()`, que retorna um
número (timestamp). Isso facilita imensamente na hora de salvar e recuperar do
`localStorage`, pois números não perdem formatação ao serem transformados em
JSON.

## 🌍 2. O Modelo do Estado Global (`TaskStateModel`)

Agora, vamos definir o "Coração" da nossa aplicação: o objeto que vai guardar
absolutamente tudo o que está acontecendo no momento.

**Arquivo:** `src/models/TaskStateModel.ts`

```tsx
import type { TaskModel } from './TaskModel';

export type TaskStateModel = {
  // 1. O Histórico: Um array contendo todas as tarefas já feitas ou em andamento
  tasks: TaskModel[];

  // 2. Controle do Timer
  secondsRemaining: number; // Quantos segundos faltam no cronômetro atual
  formattedSecondsRemaining: string; // O texto pronto para a tela (ex: "25:00")
  activeTask: TaskModel | null; // Qual tarefa está rodando AGORA (se houver)

  // 3. Controle do Ciclo Pomodoro
  currentCycle: number; // Vai de 1 a 8 (controla as bolinhas coloridas)

  // 4. Configurações do Usuário
  config: {
    workTime: number; // Tempo de foco (ex: 25)
    shortBreakTime: number; // Descanso curto (ex: 5)
    longBreakTime: number; // Descanso longo (ex: 15)
  };
};
```

## 🧠 3. Entendendo o `keyof` (TypeScript Avançado)

No arquivo `TaskModel.ts`, nós definimos a propriedade `type` da seguinte forma:

```tsx
type: keyof TaskStateModel['config'];
```

O que isso faz? Nós precisamos saber se a tarefa atual é de trabalho
(`workTime`), descanso curto (`shortBreakTime`) ou descanso longo
(`longBreakTime`). Repare que esses são exatamente os mesmos nomes das chaves do
objeto config que acabamos de criar no TaskStateModel.

Ao usar o `keyof`, estamos dizendo ao TypeScript: "_O `type` da tarefa só pode
ser uma string que seja idêntica ao nome de uma das chaves do `config`_".

Se amanhã adicionarmos uma nova configuração chamada `extraTime` dentro de
config, o TypeScript automaticamente aceitará `extraTime` como um tipo de tarefa
válido, sem precisarmos alterar dois arquivos diferentes. Isso evita repetição
de código (o famoso princípio DRY - Don't Repeat Yourself)!

## 🎯 Próximos Passos

Agora que temos o "molde" perfeito de como nossos dados devem se comportar,
estamos prontos para criar o Estado real da aplicação usando o `useState` e,
futuramente, a Context API.
