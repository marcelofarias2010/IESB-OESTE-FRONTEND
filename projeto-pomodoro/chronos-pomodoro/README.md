# 🔵 Renderizando os Indicadores de Ciclo Dinamicamente

Vamos dar vida aos indicadores visuais dos ciclos do nosso Pomodoro (aquelas
bolinhas que mostram se é foco ou pausa), gerando tudo isso de forma dinâmica!

Até agora, as nossas "bolinhas" indicadoras de ciclo (Tempo de Foco, Pausa
Curta, Pausa Longa) estavam fixas no HTML. O nosso objetivo nesta aula é ler o
número do ciclo atual (`currentCycle`) no estado global e desenhar a quantidade
exata de bolinhas na tela, com as cores corretas.

Para fazer isso, precisaremos criar um Array baseado no número de ciclos e
iterar sobre ele.

---

## 🛠️ 1. Construindo o Array de Ciclos (`Cycles.tsx`)

Se o usuário estiver no ciclo 4, precisamos desenhar 4 bolinhas. Como o React
renderiza listas a partir de Arrays, precisamos criar um Array vazio com 4
posições. Faremos isso usando o `Array.from()`.

**Arquivo:** `src/components/Cycles/index.tsx`

```tsx
import { useTaskContext } from '../../contexts/TaskContext';
import { getNextCycle } from '../../utils/getNextCycle';
import { getNextCycleType } from '../../utils/getNextCycleType';
import styles from './styles.module.css';

export function Cycles() {
  const { state } = useTaskContext();

  // 1. Cria um array com o tamanho exato do ciclo atual (ex: se for 3, cria um array com 3 posições)
  const cycleStep = Array.from({ length: state.currentCycle });

  // 2. Dicionário para traduzir os tipos de ciclo para texto legível (Acessibilidade)
  const cycleDescriptionMap = {
    workTime: 'foco',
    shortBreakTime: 'descanso curto',
    longBreakTime: 'descanso longo',
  };

  return (
    <div className={styles.cycles}>
      <span>Ciclos:</span>
      <div className={styles.cycleDots}>{/* Próximo passo: o Map! */}</div>
    </div>
  );
}
```

## 🔁 2. Iterando com `.map()` e Aplicando Classes Dinâmicas

Agora vamos pegar esse Array que criamos e usar o método `.map()` do JavaScript.
Para cada posição do array, vamos calcular qual deveria ser o tipo daquele ciclo
e retornar um elemento `<span>` correspondente.

**Arquivo:** `src/components/Cycles/index.tsx` (Continuando dentro do cycleDots)

```tsx
<div className={styles.cycleDots}>
  {cycleStep.map((_, index) => {
    // O índice começa em 0. Usamos nossas funções para saber o número e o tipo real do ciclo.
    const nextCycle = getNextCycle(index);
    const nextCycleType = getNextCycleType(nextCycle);

    return (
      <span
        // A prop 'key' é OBRIGATÓRIA no React para elementos gerados por map()
        key={nextCycle}
        // Aplicamos a classe base da bolinha + a classe dinâmica da cor (ex: styles.workTime)
        className={`${styles.cycleDot} ${styles[nextCycleType]}`}
        // Acessibilidade (Leitores de tela e tooltip ao passar o mouse)
        aria-label={`Indicador de ciclo de ${cycleDescriptionMap[nextCycleType]}`}
        title={`Indicador de ciclo de ${cycleDescriptionMap[nextCycleType]}`}
      ></span>
    );
  })}
</div>
```

## 🧠 Entendendo o Pulo do Gato:

A Propriedade `key`: Sempre que geramos uma lista no React com `.map()`,
precisamos passar uma `key` única. Isso ajuda o React a saber exatamente qual
bolinha foi adicionada, removida ou alterada, otimizando a renderização. Usar o
índice do array como `key` é uma má prática caso a lista possa ser reordenada.
Como os nossos números de ciclo (`nextCycle`) não se repetem na tela, eles são a
`key` perfeita!

Acessibilidade (`aria-label` e `title`): Uma `<span>` vazia e colorida não
significa nada para um leitor de tela (usado por pessoas com deficiência
visual). O `aria-label` narra o que é aquele elemento, e o `title` exibe aquele
textinho de ajuda quando passamos o mouse por cima.

## 👁️ 3. Renderização Condicional no Formulário (`MainForm.tsx`)

Se o usuário acabou de abrir a aplicação, o `currentCycle` é 0. Não faz sentido
exibir a palavra "Ciclos:" sem nenhuma bolinha na frente, certo?

Vamos alterar o nosso `MainForm.tsx` para só exibir o componente `<Cycles />` se
já existir algum ciclo rodando. Faremos isso usando a lógica do Curto-circuito
(`&&`).

**Arquivo:** `src/components/MainForm/index.tsx`

```tsx
// ... (imports e lógica superior mantidos)

<div className='formRow'>
  <p>Próximo intervalo é de 25min</p>
</div>;

{
  /* Só renderiza a div com os ciclos SE o currentCycle for maior que zero */
}
{
  state.currentCycle > 0 && (
    <div className='formRow'>
      <Cycles />
    </div>
  );
}

<div className='formRow'>
  <DefaultButton icon={<PlayCircleIcon />} />
</div>;
// ...
```

## ✅ Testando

Ao atualizar a página, os indicadores não devem aparecer (estado zerado). Digite
uma tarefa e inicie o Pomodoro:

1. Uma bolinha azul (`workTime`) deve aparecer.
2. Inicie outra tarefa: uma bolinha verde (`shortBreakTime`) aparecerá ao lado.
3. Se você passar o mouse por cima delas, verá o título descrevendo o que cada
   uma é.
4. Continue clicando até passar do ciclo 8: as bolinhas reiniciarão no número 1!

Está ficando com cara de aplicação real!
