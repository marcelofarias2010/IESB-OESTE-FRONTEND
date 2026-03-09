# 🏷️ Tipagem de Props com TypeScript e Adição de Ícones

Nesta aula, vamos evoluir o nosso componente `<Heading />`. Aprenderemos como
utilizar o TypeScript para garantir que ele receba os tipos corretos de dados
(tipagem das `props`), como deixar o código mais limpo usando desestruturação e
como integrar ícones profissionais ao nosso projeto.

---

## 🛡️ 1. O Problema da Tipagem Implícita (O temido `any`)

Se você estiver usando TypeScript, notou que o parâmetro `props` do nosso
componente estava sublinhado. Isso acontece porque o TypeScript não sabe o que
tem dentro de `props`. Para ele, é um tipo `any` (qualquer coisa), o que quebra
a principal vantagem do TypeScript: a segurança!

Para resolver isso, precisamos criar um **Tipo (`type`)** ou **Interface** para
descrever exatamente o que o nosso componente espera receber.

### Criando a Tipagem

1. Por convenção, nomeamos o tipo com o nome do componente seguido da palavra
   `Props` (Ex: `HeadingProps`).
2. Definimos quais chaves o objeto terá e quais os seus tipos de dados.

```tsx
// src/components/Heading.tsx

// 1. Criamos o "contrato" do componente
type HeadingProps = {
  children: string; // Inicialmente, dizemos que children será apenas texto
};

// 2. Aplicamos o tipo ao parâmetro da função (props: HeadingProps)
export function Heading(props: HeadingProps) {
  return <h1 className='heading'>{props.children}</h1>;
}
```

## ✂️ 2. Deixando o Código Limpo: Desestruturação (Destructuring)

Ficar escrevendo props.isso e props.aquilo toda hora deixa o código verboso. O
JavaScript possui um recurso chamado Desestruturação, que nos permite extrair
variáveis de dentro de um objeto logo na sua declaração.

Podemos fazer a desestruturação diretamente nos parâmetros da função!

### Antes (Verboso):

```tsx
export function Heading(props: HeadingProps) {
  return <h1>{props.children}</h1>;
}
```

### Depois (Limpo e Direto):

```tsx
export function Heading({ children }: HeadingProps) {
  return <h1>{children}</h1>;
}
```

# 🏷️ Tipagem de Props com TypeScript e Adição de Ícones

Nesta aula, vamos evoluir o nosso componente `<Heading />`. Aprenderemos como
utilizar o TypeScript para garantir que ele receba os tipos corretos de dados
(tipagem das `props`), como deixar o código mais limpo usando desestruturação e
como integrar ícones profissionais ao nosso projeto.

---

## 🛡️ 1. O Problema da Tipagem Implícita (O temido `any`)

Se você estiver usando TypeScript, notou que o parâmetro `props` do nosso
componente estava sublinhado. Isso acontece porque o TypeScript não sabe o que
tem dentro de `props`. Para ele, é um tipo `any` (qualquer coisa), o que quebra
a principal vantagem do TypeScript: a segurança!

Para resolver isso, precisamos criar um **Tipo (`type`)** ou **Interface** para
descrever exatamente o que o nosso componente espera receber.

### Criando a Tipagem

1. Por convenção, nomeamos o tipo com o nome do componente seguido da palavra
   `Props` (Ex: `HeadingProps`).
2. Definimos quais chaves o objeto terá e quais os seus tipos de dados.

```tsx
// src/components/Heading.tsx

// 1. Criamos o "contrato" do componente
type HeadingProps = {
  children: string; // Inicialmente, dizemos que children será apenas texto
};

// 2. Aplicamos o tipo ao parâmetro da função (props: HeadingProps)
export function Heading(props: HeadingProps) {
  return <h1 className='heading'>{props.children}</h1>;
}
```

## ✂️ 2. Deixando o Código Limpo: Desestruturação (Destructuring)

Ficar escrevendo `props.isso` e `props.aquilo` toda hora deixa o código verboso.
O JavaScript possui um recurso chamado **Desestruturação**, que nos permite
extrair variáveis de dentro de um objeto logo na sua declaração.

Podemos fazer a desestruturação diretamente nos parâmetros da função!

### Antes (Verboso):

```tsx
TypeScript;
export function Heading(props: HeadingProps) {
  return <h1>{props.children}</h1>;
}
```

### Depois (Limpo e Direto):

```tsx
TypeScript;
export function Heading({ children }: HeadingProps) {
  return <h1>{children}</h1>;
}
```

_Dica: Ao fazer isso, se você abrir chaves `{ }` e apertar `Ctrl + Espaço`, o
editor já vai sugerir children automaticamente, graças ao TypeScript!_

## 🎨 3. Instalando e Usando Ícones (lucide-react)

O nosso `<Heading />` precisa renderizar um botão com um ícone ao lado do texto
em algumas telas (como na tela de "Histórico").

Para isso, vamos utilizar a biblioteca **Lucide Icons**, que é moderna, leve e
possui um pacote oficial para React.

### Passo 1: Instalação

No terminal do seu projeto, rode o comando:

```bash
npm install lucide-react
```

### Passo 2: O Problema do TypeScript com Componentes Filhos

Se tentarmos passar o botão e o ícone para dentro do nosso
`<Heading>Texto <button>...</button></Heading>`, o TypeScript vai gritar um
erro!

Lembra que dissemos que `children` era do tipo `string`? Um `<button>` não é uma
`string`, é um elemento React!

Para resolver isso, mudamos o tipo de `children` para `React.ReactNode`, que é o
tipo global do React que aceita TUDO (textos, números, HTML, outros componentes,
etc).

```tsx
import React from 'react'; // Importante importar o React

type HeadingProps = {
  // Agora aceitamos texto OU outros componentes JSX!
  children: React.ReactNode;
};
```

### Passo 3: Adicionando o Ícone no App.jsx

Agora podemos importar o ícone (ex: `Timer`) e usá-lo livremente como filho do
nosso componente. Os ícones do Lucide funcionam como componentes normais do
React (iniciam com letra maiúscula).

```tsx
// src/App.tsx
import { Heading } from './components/Heading';
import { Timer } from 'lucide-react'; // Importando o ícone

export function App() {
  return (
    <Heading>
      Histórico
      <button>
        <Timer /> {/* Renderizando o ícone dentro do botão */}
      </button>
    </Heading>
  );
}
```

## 📏 4. Ajustando o Alinhamento com CSS Flexbox

Para garantir que o texto "Histórico" e o botão fiquem perfeitamente alinhados
lado a lado, vamos usar o poder do **Flexbox** no arquivo CSS do componente.

```css
/* src/components/Heading.module.css (ou global, dependendo de como você estruturou) */
.heading {
  display: flex; /* Ativa o Flexbox */
  justify-content: center; /* Centraliza o conteúdo horizontalmente */
  align-items: center; /* Centraliza o conteúdo verticalmente (alinhamento perfeito) */
  gap: 2.4rem; /* Adiciona 24px de espaço entre o texto e o botão/ícone */
}
```

Pronto! Agora temos um componente `<Heading />` fortemente tipado, estruturado
de forma limpa e capaz de renderizar tanto textos simples quanto layouts
complexos com ícones de forma perfeitamente alinhada.
