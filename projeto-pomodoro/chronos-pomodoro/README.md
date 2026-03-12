# 🚀 Criando o Componente Logo e Dicas de Produtividade

Nesta aula, vamos criar o nosso componente `<Logo />`. Em vez de começarmos um
arquivo totalmente do zero, vamos aprender alguns truques de produtividade para
reaproveitar a estrutura que já criamos e acelerar o nosso desenvolvimento!

---

## ⚡ 1. Produtividade no VS Code

### Duplicando Componentes

Uma prática muito comum é copiar a pasta de um componente simples (como o
`Heading`) e colar com o nome do novo componente (`Logo`). Isso já nos dá o
arquivo `index.tsx` e o `styles.module.css` prontos!

### O Truque do "Preserve Case" (Manter Maiúsculas/Minúsculas)

Ao duplicar, precisamos trocar a palavra `heading` por `logo` em todo o arquivo.

1. Selecione a palavra `Heading` e pressione `Ctrl + F` (ou `Cmd + F`).
2. Digite `logo` no campo de substituição.
3. **Dica de Ouro:** Clique no ícone de **"Preserve Case"** (um botão com as
   letras `Aa` na caixinha de busca). Isso garante que onde estava `Heading`
   (maiúsculo) vire `Logo`, e onde estava `heading` (minúsculo) vire `logo`.
4. Clique em "Replace All".

### Extensão Recomendada: Auto Rename Tag

Vá na aba de extensões do VS Code e instale a **Auto Rename Tag**. Com ela,
sempre que você alterar a tag de abertura (ex: de `<h1>` para `<div>`), ela
altera automaticamente a tag de fechamento, poupando muito tempo!

---

## 🧩 2. Estruturando o Componente Logo

Diferente do `Heading`, o nosso componente `Logo` é "autocontido". Ele não
precisa receber textos de fora via `props.children`, pois o ícone e o nome do
app ("Chronos") serão fixos.

Vamos importar o ícone `TimerIcon` da biblioteca `lucide-react` e montar a
estrutura.

**Arquivo:** `src/components/Logo/index.tsx` _(ou .jsx)_

```tsx
import { TimerIcon } from 'lucide-react';
import styles from './styles.module.css';

export function Logo() {
  return (
    <div className={styles.logo}>
      {/* Usamos a tag <a> provisoriamente. No futuro, trocaremos pelo Link do React Router */}
      <a className={styles.logoLink} href='#'>
        <TimerIcon />
        <span>Chronos</span>
      </a>
    </div>
  );
}
```

## 🎨 3. Estilizando e Entendendo o `camelCase`

Por que usar `camelCase` no CSS Modules? No CSS tradicional, costumamos usar
traços (ex: `.logo-link`). Porém, no CSS Modules, nós acessamos essas classes
como propriedades de um objeto JavaScript. Se usarmos traço, teríamos que
escrever `className={styles['logo-link']}`. Fica feio, não acha?

Por isso, **usamos camelCase** no CSS Modules (ex: `.logoLink`). Assim, podemos
escrever de forma limpa: `className={styles.logoLink}`.

**Adicionando os Estilos e Efeitos** Vamos alinhar o ícone em cima do texto
usando `flex-direction: column` e adicionar uma transição suave de cor quando o
usuário passar o mouse por cima (`hover`).

**Arquivo:** `src/components/Logo/styles.module.css`

```css
.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2.4rem;
  padding-top: 3.2rem;
}

.logoLink {
  display: flex;
  flex-direction: column; /* Coloca o ícone em cima e o texto embaixo */
  align-items: center;
  justify-content: center;
  font-weight: bold;
  gap: 0.4rem;
  font-size: 4.2rem;
  text-decoration: none; /* Remove a linha padrão de links */
  color: var(--primary);
  transition: all 0.1s ease-in-out; /* Transição suave */
}

/* Efeito ao passar o mouse: escurece a cor primária em 50% */
.logoLink:hover {
  filter: brightness(50%);
}

/* Alterando o tamanho do ícone SVG direto pelo CSS */
.logoLink svg {
  width: 6.4rem;
  height: 6.4rem;
}
```

## 🧱 4. Integrando a Logo na Aplicação

Agora que nossa Logo está pronta e estilizada, basta importá-la no nosso arquivo
principal e colocá-la dentro do nosso `Container`!

**Arquivo:** `src/App.tsx` (ou .jsx)

```tsx
import { Heading } from './components/Heading';
import { Container } from './components/Container';
import { Logo } from './components/Logo';

import './styles/theme.css';
import './styles/global.css';

export function App() {
  return (
    <>
      <Container>
        <Logo />
      </Container>

      <Container>
        <Heading>MENU</Heading>
      </Container>
    </>
  );
}
```
