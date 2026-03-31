# 🚫 Desativando o Input Durante uma Tarefa Ativa

Vamos adicionar um detalhe de usabilidade super importante: impedir que o
usuário altere o nome da tarefa enquanto o cronômetro estiver rodando!

na aula anterior, o arquivo `Cycles.tsx` acabou ficando com alguns pequenos
erros de digitação nos textos. Acontece nas melhores famílias quando estamos
codando e falando ao mesmo tempo! Se você notou algum errinho de texto no seu,
sinta-se livre para corrigir.

Nesta aula, vamos implementar uma das funcionalidades mais simples, porém
essenciais para a nossa interface: **desativar o campo de input** quando uma
tarefa estiver em andamento.

Se o usuário já iniciou uma tarefa (ou seja, temos uma `activeTask` rodando),
não faz sentido permitir que ele digite um novo nome de tarefa ali, certo?
Precisamos bloquear esse campo.

---

## 🛠️ 1. A Lógica do `disabled` no React

No HTML e no React, a propriedade `disabled` em um input controla se ele está
bloqueado ou não.

- Se passarmos apenas a palavra `disabled` (ou `disabled={true}`), ele bloqueia.
- Se passarmos `disabled={false}`, ele fica liberado.

Como queremos que isso seja dinâmico, precisamos olhar para o nosso estado
global:

- Se `state.activeTask` for `null` (nenhuma tarefa rolando) ➡️ `disabled` deve
  ser `false`.
- Se `state.activeTask` tiver dados (tarefa rolando) ➡️ `disabled` deve ser
  `true`.

Para converter um objeto (ou `null`) em um valor Booleano (`true` ou `false`) no
JavaScript, usamos um truque muito comum: a **dupla exclamação (`!!`)**.

- `!null` vira `true`, e `!!null` volta para `false`.
- `!{objeto}` vira `false`, e `!!{objeto}` volta para `true`.

## 💻 2. Aplicando no Código (`MainForm.tsx`)

Vamos adicionar essa propriedade diretamente no nosso componente
`<DefaultInput />` lá no retorno do JSX no `MainForm`.

**Arquivo:** `src/components/MainForm/index.tsx`

```tsx
// ... (resto do código)

<div className='formRow'>
  <DefaultInput
    labelText='task'
    id='meuInput'
    type='text'
    placeholder='Digite algo'
    ref={taskNameInput}
    // Adicionamos a propriedade disabled aqui!
    disabled={!!state.activeTask}
  />
</div>

// ... (resto do código)
```

## ✅ 3. Testando o Comportamento

Salve o arquivo e vá para o navegador:

1. Atualize a página. O input deve estar liberado, pois não temos nenhuma tarefa
   ativa.
2. Digite "Estudar" e envie o formulário (pressionando Enter).
3. Tente clicar e digitar no input novamente. Ele deve estar bloqueado!

**⚠️ Um pequeno "problema" temporário** Você deve ter notado que agora ficamos
"presos", não é? Como não temos um botão de parar a tarefa, o input fica
bloqueado para sempre (ou até você atualizar a página com F5).
