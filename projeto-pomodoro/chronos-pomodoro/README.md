# 🌗 Alternador de Temas: Acessibilidade, Tipagem e Eventos

Nesta aula, daremos início à criação do nosso alternador de tema (Dark/Light
Mode) que ficará no componente `Menu`.

A estratégia que vamos utilizar não depende de bibliotecas complexas: usaremos
**CSS puro com variáveis** e manipularemos um atributo diretamente na tag
`<html>` (`data-theme`). Quando o React mudar esse atributo, o CSS aplicará o
novo conjunto de cores automaticamente!

---

## 🎨 1. Configurando o CSS e o HTML Base

Primeiro, vamos ao nosso arquivo base HTML para definir o idioma e o tema
padrão. Depois, no nosso arquivo de temas CSS, adicionaremos as variáveis
invertidas para o tema claro.

**Arquivo:** `index.html`

```html
<html lang="pt-BR" data-theme="dark"></html>
```

**Arquivo:** `src/styles/theme.css`

```css
/* Quando a tag :root (html) tiver o atributo data-theme='light', 
   essas variáveis irão sobrescrever as variáveis padrão (dark)! */
:root[data-theme='light'] {
  --gray-100: #0a0f1a;
  --gray-200: #181f2e;
  --gray-300: #272f43;
  --gray-400: #363d56;
  --gray-500: #454f6a;
  --gray-600: #555f7d;
  --gray-700: #aab3cc;
  --gray-800: #cdd3e1;
  --gray-900: #e6e9f0;

  --text-default: #0a0f1a;
  --text-muted: #272f43;

  --link-color: #0b8a60;
  --link-hover: #065f46;
}
```

## ♿ 2. Acessibilidade no Menu

Nossos links do menu atualmente possuem apenas ícones. Se uma pessoa utilizar um
leitor de tela, ela não fará ideia do que cada botão faz. Além disso, usuários
comuns não têm um tooltip visual indicando a ação.

Vamos resolver isso adicionando os atributos `aria-label` (para leitores de
tela) e `title` (para mostrar o textinho ao passar o mouse).

## 🧠 3. O Estado, a Tipagem e o `preventDefault`

Para o botão de mudar o tema funcionar, precisamos de um estado (`useState`)
para saber em qual tema estamos no momento.

**Tipagem Estrita** Para evitar que alguém coloque `setTheme('azul')`, vamos
criar um tipo literal (`AvailableThemes`) garantindo que nosso estado só aceite
`'dark'` ou `'light'`.

**Prevenindo Comportamentos Padrões** Nosso botão de tema é uma tag de link
(`<a>`). Por padrão, clicar em um link recarrega a página ou tenta navegar para
o endereço do `href`. Como estamos fazendo um aplicativo de página única (SPA),
não queremos isso! Usaremos o `event.preventDefault()` para cancelar essa
navegação padrão. O TypeScript exige que tipemos esse evento corretamente
(`React.MouseEvent<HTMLAnchorElement, MouseEvent>`).

**Arquivo:** `src/components/Menu/index.tsx`

```tsx
import { HistoryIcon, HouseIcon, SettingsIcon, SunIcon } from 'lucide-react';
import styles from './styles.module.css';
import { useState } from 'react';

// Tipagem restrita: O tema SÓ pode ser 'dark' ou 'light'
type AvailableThemes = 'dark' | 'light';

export function Menu() {
  const [theme, setTheme] = useState<AvailableThemes>('dark');

  // Tipagem do evento de clique em um link (âncora) no React
  function handleThemeChange(
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  ) {
    event.preventDefault(); // Impede que o navegador siga o link (href='#')

    console.log('Clicado', Date.now());
  }

  return (
    <nav className={styles.menu}>
      {/* Texto temporário para vermos o estado atual na tela */}
      <h1>{theme}</h1>

      <a
        className={styles.menuLink}
        href='#'
        aria-label='Ir para a Home'
        title='Ir para a Home'
      >
        <HouseIcon />
      </a>

      <a
        className={styles.menuLink}
        href='#'
        aria-label='Ver Histórico'
        title='Ver Histórico'
      >
        <HistoryIcon />
      </a>

      <a
        className={styles.menuLink}
        href='#'
        aria-label='Configurações'
        title='Configurações'
      >
        <SettingsIcon />
      </a>

      <a
        className={styles.menuLink}
        href='#'
        aria-label='Mudar Tema'
        title='Mudar Tema'
        onClick={handleThemeChange}
      >
        <SunIcon />
      </a>
    </nav>
  );
}
```
