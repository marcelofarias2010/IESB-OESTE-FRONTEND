# ⚛️ Criando o Primeiro Componente React

Nesta aula, daremos o nosso primeiro passo prático no React: limpar os arquivos
padrões gerados pelo Vite e criar o nosso próprio componente do zero. Vamos
entender as regras de nomenclatura, como exportar/importar arquivos e as regras
básicas do JSX.

---

## 🧹 1. Limpando o Projeto Padrão

Quando criamos um projeto com o Vite, ele traz vários arquivos de exemplo. Para
começarmos do zero, vamos limpar nossa pasta `src`:

1. Apague os arquivos `App.jsx` (ou `App.tsx`), `App.css` e `index.css`.
2. No arquivo `main.jsx` (ou `main.tsx`), remova as linhas de importação dos
   arquivos CSS e do componente App que acabamos de apagar.
3. Se você salvar agora, provavelmente verá um erro ou uma tela em branco. Isso
   é normal, pois acabamos de remover o que estava sendo renderizado!

> **💡 Dica:** Você poderia escrever todo o seu HTML diretamente dentro do
> `main.jsx`, mas essa não é uma boa prática. O poder do React está em separar a
> interface em **Componentes**.

---

## 🧩 2. O que é um Componente React?

Um componente React é, basicamente, uma **função JavaScript que retorna JSX**
(uma sintaxe que mistura HTML com JavaScript).

### Regra de Nomenclatura: PascalCase

Todo componente React **deve** começar com letra maiúscula e seguir o padrão
**PascalCase** (cada palavra da variável começa com letra maiúscula, sem
espaços).

**Exemplos:**

- ❌ `app` ➡️ ✅ `App`
- ❌ `cabeçalho` ➡️ ✅ `Header` (preferência por inglês) ou `Cabecalho`
- ❌ `exemplo de componente` ➡️ ✅ `ExemploDeComponente`

### Extensões de Arquivo

Ao criar componentes, utilizamos extensões específicas para avisar ao editor que
aquele arquivo contém JSX:

- `.jsx`: Para projetos usando JavaScript.
- `.tsx`: Para projetos usando TypeScript.

---

## 🛠️ 3. Criando e Exportando o Componente

Vamos criar o nosso componente principal, o `App`.

Existem duas formas de exportar um componente para usá-lo em outros arquivos.
Vamos ver a diferença:

### Forma 1: Exportação Padrão (Default Export) - _Menos Recomendada_

```jsx
// App.jsx
function App() {
  return <h1>Olá, Mundo!</h1>;
}
export default App;
```

Problema: Na hora de importar, você pode dar o nome que quiser (ex:
`import QualquerCoisa from './App'`), o que pode gerar confusão no código.

**Forma 2: Exportação Nomeada (Named Export) - Recomendada!**

```jsx
// App.jsx
export function App() {
  return <h1>Olá, Mundo do React!</h1>;
}
```

Vantagem: Na hora de importar, você é obrigado a usar o nome exato do
componente, evitando erros.

Para usar esse componente no seu `main.jsx`, importamos entre chaves e
renderizamos como uma tag HTML:

```jsx
// main.jsx
import { App } from './App.jsx';

// ...dentro do render:
<App />;
```

## 📐 4. A Regra de Ouro do JSX e o React Fragment

O JSX tem uma regra rígida: **Um componente só pode retornar um único elemento
pai.**

Se você tentar retornar dois elementos lado a lado, o React vai gerar um erro:

```jsx
// ❌ ERRO: Retornando dois elementos soltos
export function App() {
  return (
    <h1>Título</h1>
    <p>Parágrafo</p>
  );
}
```

**A Solução: Envolver os elementos** Você pode envolver tudo em uma `<div>`:

```jsx
// ✅ Funciona (mas cria uma div extra no HTML final)
export function App() {
  return (
    <div>
      <h1>Título</h1>
      <p>Parágrafo</p>
    </div>
  );
}
```

**A Melhor Solução: React Fragment (`<> </>`)** Se você não quer criar `<div>`
desnecessárias que podem atrapalhar seu CSS (como layouts em Flexbox), use o
**Fragment**. Ele agrupa os elementos para o React, mas desaparece no HTML
final.

```jsx
// ✅ Perfeito! Agrupa sem sujar o HTML
export function App() {
  return (
    <>
      <h1>Título</h1>
      <p>Parágrafo</p>
    </>
  );
}
```

## 🕵️‍♂️ 5. Por que meu `console.log` roda duas vezes?

Se você colocar um `console.log("Oi")` dentro do seu componente e olhar o
console do navegador, notará que a mensagem aparece duplicada.

**Isso não é um erro do seu código!** Isso acontece por causa do
`<React.StrictMode>` que envolve nossa aplicação no `main.jsx`. O Strict Mode
renderiza seus componentes propositalmente **duas vezes** no ambiente de
desenvolvimento. Essa é uma ferramenta do React para testar se o seu código tem
efeitos colaterais indesejados.

Quando o projeto for gerado para produção (Build), isso deixará de acontecer.
Portanto, não se preocupe com logs duplicados durante o desenvolvimento!
