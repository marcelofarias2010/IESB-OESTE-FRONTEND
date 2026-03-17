# 🎨 Estilizando o Componente Input e Dominando Pseudo-classes

Depois de garantirmos que a estrutura e a tipagem do nosso componente estão
perfeitas, agora é hora de deixá-lo bonito!

Nesta aula, voltamos para uma área um pouco mais familiar: o CSS. Vamos aprender
a utilizar pseudo-classes (`:focus`, `:disabled`, `::placeholder`) para
estilizar os diferentes "estados" do nosso input.

---

## 🏗️ 1. Vinculando o CSS Module

Primeiro, vamos criar o arquivo de estilos e vinculá-lo ao nosso componente.

**Arquivo:** `src/components/DefaultInput/index.tsx` _(ou .jsx)_

```tsx
import styles from './styles.module.css'; // <-- Importando o CSS Module

type DefaultInputProps = {
  id: string;
  labelText: string;
} & React.ComponentProps<'input'>;

export function DefaultInput({
  id,
  type,
  labelText,
  ...rest
}: DefaultInputProps) {
  return (
    <>
      <label htmlFor={id}>{labelText}</label>
      {/* Aplicando a classe dinâmica gerada pelo CSS Module */}
      <input className={styles.input} id={id} type={type} {...rest} />
    </>
  );
}
```

## 🎨 2. A Estilização Base e a Lógica da Borda Transparente

Vamos criar a classe `.input`. O nosso input tem um design limpo, sem fundo e
apenas com uma linha na parte inferior.

### 🐛 O Problema do "Pulo" (Shift Layout)

Se removermos todas as bordas e adicionarmos uma borda completa apenas no
`:focus`, o tamanho total do input vai aumentar em `2px` quando o usuário clicar
nele. Isso faz com que os elementos ao redor "pulem" ou se movam.

### 💡 A Solução

Para evitar isso, nós definimos uma borda de `2px` em todos os lados o tempo
todo, mas deixamos ela **transparente** (`border: 0.2rem solid transparent;`).
Assim, o espaço físico da borda já está reservado. Depois, pintamos apenas a
borda de baixo de fato (`border-bottom: 0.2rem solid var(--primary);`).

**Arquivo:** `src/components/DefaultInput/styles.module.css`

```css
.input {
  background-color: transparent;
  text-align: center;
  font-size: 1.8rem;
  padding: 0.8rem;
  color: var(--text-default);
  outline: none; /* Remove a borda padrão feia do navegador */

  /* O truque para evitar o "pulo" no layout */
  border: 0.2rem solid transparent;
  border-bottom: 0.2rem solid var(--primary);

  /* Transição suave de 0.1s para quando o estado (foco, cor) mudar */
  transition: all 0.1s ease-in-out;
}
```

## 🎯 3. Estilizando Estados com Pseudo-classes

Agora vamos usar o CSS para reagir às ações do usuário e ao estado do HTML.

**O Estado de Foco (`:focus`)** Quando o usuário clica para digitar, queremos
mostrar a borda completa e arredondar os cantos. Note que adicionamos o
`border-radius` apenas no foco para evitar que a linha inferior (estado padrão)
fique parecendo uma "rampinha de skate" nas pontas.

```css
.input:focus {
  border-radius: 0.8rem;
  /* A borda deixa de ser transparente e ganha a cor primária */
  border: 0.2rem solid var(--primary);
}
```

**O Texto de Ajuda** (`::placeholder`) Vamos deixar o texto de instrução (ex:
"Digite algo") um pouco menor, cinza e em itálico.

```css
.input::placeholder {
  color: var(--gray-500);
  font-size: 1.4rem;
  font-style: italic;
}
```

**O Estado Desativado (`:disabled`)** Em alguns momentos (como quando o
cronômetro estiver rodando), bloquearemos o input para evitar edições. Quando
isso acontecer, ele precisa parecer visualmente bloqueado.

```css
.input:disabled {
  /* Pintamos a linha de baixo com a cor de desativado do nosso tema */
  border-bottom: 0.2rem solid var(--disabled);
  /* A cor do texto digitado fica mais apagada */
  color: var(--text-muted);
}
```

## 🧪 4. Testando no App

Vamos testar como o input se comporta lá no nosso arquivo principal.

⚠️ **Aviso de Bug do Vite/React:** Durante a aula, tentamos usar a propriedade
`defaultValue="Valor preenchido"` para testar o visual do input com texto. No
entanto, o recarregamento automático (Live Reload) às vezes falha ao atualizar o
`defaultValue`. Se o texto não aparecer (ou não sumir quando você apagar o
código), basta dar um **F5** (atualizar a página) manualmente no navegador!

**Arquivo:** `src/App.tsx`

```tsx
{
  /* Dentro do seu formulário... */
}
<div className='formRow'>
  <DefaultInput
    labelText='task'
    id='meuInput'
    type='text'
    placeholder='Digite algo'
    /* Tente adicionar a palavra "disabled" (sem aspas) aqui para ver o estado desativado! */
  />
</div>;
```
