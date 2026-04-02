# 🛑 Registrando a Interrupção: Editando Arrays no Estado

Aqui está a instrução detalhada para a aula. Vamos corrigir o pequeno
esquecimento da aula passada e aprender a técnica definitiva para editar itens
específicos dentro de um Array no estado do React!

Na aula passada, focamos tanto em resolver o "bug do React confuso" com os
botões que acabamos esquecendo de uma regra de negócio muito importante: quando
interrompemos uma tarefa, precisamos registrar o momento exato em que isso
aconteceu na propriedade `interruptDate`.

Nesta aula, vamos aprender como encontrar e editar uma tarefa específica dentro
do nosso Array de tarefas (`tasks`), respeitando a regra de ouro do React: a
**Imutabilidade**.

---

## 🗺️ O Poder do `.map()` para Editar Arrays

Como já sabemos, não podemos alterar um estado diretamente (nada de
`array.push()` ou `array[0].campo = valor`).

- Para **adicionar** itens, usamos o Spread Operator:
  `[...arrayAntigo, novoItem]`.
- Para **editar** itens, a melhor ferramenta do JavaScript é o `.map()`.

O método `.map()` percorre todo o array original e cria um **novo array** com o
exato mesmo tamanho. Durante esse percurso, podemos colocar uma condição: _"Se
for o item que eu quero alterar, eu modifico. Se não for, eu devolvo ele do
jeito que estava"_.

---

## 💻 Implementando a Lógica (`MainForm.tsx`)

Vamos voltar na nossa função `handleInterruptTask` e adicionar a atualização do
array `tasks`.

**Arquivo:** `src/components/MainForm/index.tsx`

```tsx
function handleInterruptTask() {
  setState(prevState => {
    return {
      ...prevState,
      activeTask: null,
      secondsRemaining: 0,
      formattedSecondsRemaining: '00:00',

      // 1. Percorremos todas as tarefas antigas para gerar um novo array
      tasks: prevState.tasks.map(task => {
        // 2. Verificamos se existe uma tarefa ativa E se o ID bate com a tarefa atual do loop
        if (prevState.activeTask && prevState.activeTask.id === task.id) {
          // 3. Se achamos a nossa tarefa alvo, retornamos uma cópia dela (...task)
          // mas sobrescrevendo o campo interruptDate com a data/hora atual.
          return { ...task, interruptDate: Date.now() };
        }

        // 4. Se não for a tarefa alvo, devolvemos ela intacta para o novo array
        return task;
      }),
    };
  });
}
```

🧠 **Entendendo a Condição (TypeScript):** Por que precisamos escrever
`prevState.activeTask && ...`? Como o nosso tipo diz que `activeTask` pode ser
`null`, o TypeScript vai chiar se tentarmos ler `.id` direto de algo que pode
ser nulo. Essa primeira checagem garante para o TypeScript que a tarefa existe
antes de compararmos os IDs.

## ✅ Testando o Comportamento

Para ter certeza de que estamos "acertando o alvo" correto:

1. Abra a página e inicie uma tarefa.
2. Interrompa a tarefa.
3. Inicie uma segunda tarefa diferente e a interrompa.
4. Olhe no seu Console (através daquele `useEffect` espião que criamos no
   `TaskContextProvider`).
5. Abra o array `tasks`.

- A tarefa 0 deve ter o seu próprio `interruptDate` preenchido.
- A tarefa 1 deve ter o seu próprio `interruptDate` preenchido, sem afetar a
  anterior!

## 🔮 Preparando o Terreno: O Problema do `useState` Complexo

Parabéns! Nossa lógica de criação e interrupção está funcionando perfeitamente.
No entanto, o professor deixou um aviso importantíssimo no final da aula:

Olhe para o tamanho dos nossos `setState` na função de criar e na função de
interromper. Eles estão gigantes! Estamos tendo que copiar o estado inteiro,
gerenciar arrays complexos e espalhar essa lógica pesada dentro do componente do
formulário. Se precisássemos iniciar uma tarefa a partir de outro botão em outra
página, teríamos que duplicar todo esse código.

Para resolver esse problema de estados complexos, o React possui uma ferramenta
mais avançada. Nas próximas aulas, vamos iniciar uma grande refatoração e migrar
o nosso motor do `useState` para o poderoso `useReducer`! Preparado para subir
de nível?
