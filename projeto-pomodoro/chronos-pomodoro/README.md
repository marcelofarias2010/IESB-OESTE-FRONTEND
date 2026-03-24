# 💾 Persistência com LocalStorage e Ícones Dinâmicos

Até agora, nosso alternador de temas funciona perfeitamente, mas tem um
problema: se o usuário recarregar a página (F5), o tema volta para o `dark`,
pois o estado do React é reiniciado.

Nesta aula, vamos aprender a salvar essa preferência no navegador do usuário
utilizando o `localStorage` e também vamos fazer o ícone do botão mudar
dinamicamente (Sol/Lua) dependendo do tema atual.

---

## 🧹 1. Limpeza Inicial

Antes de começar, vamos limpar o nosso componente `Menu`. Remova todos os
`console.log`, a função de `cleanup` do `useEffect` (pois não estamos deixando
"sujeira" na página com o nosso atributo HTML) e aquele `<h1>{theme}</h1>` que
estávamos usando apenas para debugar. Mantenha o código limpo e focado no que
importa!

---

## 📦 2. Salvando o Tema no `localStorage`

O `localStorage` é um banco de dados simples, embutido no navegador, que guarda
informações no formato `chave: valor` (sempre como strings). Ele é perfeito para
salvar preferências de usuários, como o tema escolhido.

Como já temos um `useEffect` que é executado **toda vez que o tema muda**, esse
é o lugar perfeito para avisar o `localStorage` da mudança:

```tsx
useEffect(() => {
  // Atualiza o HTML
  document.documentElement.setAttribute('data-theme', theme);

  // Salva no navegador: chave 'theme', valor 'dark' ou 'light'
  localStorage.setItem('theme', theme);
}, [theme]);
```

## 🦥 3. Recuperando o Tema (Lazy Initialization)

Agora que estamos salvando, precisamos avisar o nosso `useState` para, ao invés
de começar sempre como `'dark'`, ir primeiro procurar se já existe algo salvo no
`localStorage`.

Como buscar dados no navegador pode ser (levemente) custoso, usaremos a
**Inicialização Preguiçosa (Lazy Initialization)** passando uma função para o
`useState`, garantindo que essa busca ocorra apenas na primeira vez que o
componente for montado:

```tsx
const [theme, setTheme] = useState<AvailableThemes>(() => {
  const storageTheme = localStorage.getItem('theme');

  // Se tiver algo no storage, usa. Se retornar null, o padrão é 'dark'
  return (storageTheme as AvailableThemes) || 'dark';
});
```

## 🌓 4. Trocando o Ícone (A técnica do Dicionário/Mapa)

Se estamos no tema Escuro, queremos exibir o ícone de Sol (indicando que o
clique levará ao tema claro). Se estamos no tema Claro, queremos a Lua.

A forma mais instintiva seria usar um `if/else` ou um ternário diretamente no
JSX (`theme === 'dark' ? <SunIcon /> : <MoonIcon />`). Porém, existe uma forma
muito mais limpa e escalável de fazer isso no JavaScript: criando um **objeto de
mapeamento**.

```tsx
// Mapeamos qual ícone deve aparecer baseado no tema ATUAL
const nextThemeIcon = {
  dark: <SunIcon />,
  light: <MoonIcon />,
};

// No JSX, basta chamar o objeto passando o estado atual como chave:
// {nextThemeIcon[theme]}
```

## 🚀 5. O Código Final do App

Com todas essas implementações, nosso componente de `Menu` agora tem
persistência de dados e uma interface que reage perfeitamente ao estado.
Lembre-se de importar o `MoonIcon` lá do `lucide-react`!

**Arquivo:** `src/components/Menu/index.tsx`

```tsx
import {
  HistoryIcon,
  HouseIcon,
  MoonIcon,
  SettingsIcon,
  SunIcon,
} from 'lucide-react';
import styles from './styles.module.css';
import { useState, useEffect } from 'react';

type AvailableThemes = 'dark' | 'light';

export function Menu() {
  // 1. Busca o valor inicial do localStorage
  const [theme, setTheme] = useState<AvailableThemes>(() => {
    const storageTheme = localStorage.getItem('theme');
    return (storageTheme as AvailableThemes) || 'dark';
  });

  // 2. Mapeamento de ícones (Evita ifs/ternários no JSX)
  const nextThemeIcon = {
    dark: <SunIcon />,
    light: <MoonIcon />,
  };

  function handleThemeChange(
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  ) {
    event.preventDefault();
    setTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
  }

  // 3. Efeito colateral: Muda o HTML e salva no localStorage
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <nav className={styles.menu}>
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
        {/* Renderiza o ícone dinamicamente baseado na chave atual */}
        {nextThemeIcon[theme]}
      </a>
    </nav>
  );
}
```

## 🔒 6. Retornando às Boas Práticas (`StrictMode`) e Código Final

No início das nossas aulas sobre `useEffect`, nós removemos temporariamente o
`<StrictMode>` do nosso arquivo de inicialização para facilitar a visualização
dos `console.log` sem as renderizações duplas que ele causa em modo de
desenvolvimento.

Agora que nossa lógica está pronta, limpa e funcional, é **fundamental**
devolvermos o `<StrictMode>` para o código. Ele é o nosso cão de guarda,
ajudando a identificar potenciais problemas e práticas obsoletas no nosso app.

**Arquivo de inicialização (ex: `main.tsx` ou `index.tsx`):**

```jsx
import { createRoot } from 'react-dom/client';
import { App } from './App.tsx';
import { StrictMode } from 'react';

createRoot(document.getElementById('root')!).render(
  <>
    <StrictMode>
      <App />
    </StrictMode>
  </>,
);
```

E aqui está o código final, polido e exato do nosso alternador de temas
persistente:

**Arquivo:** `src/components/Menu/index.tsx`

```tsx
import {
  HistoryIcon,
  HouseIcon,
  MoonIcon,
  SettingsIcon,
  SunIcon,
} from 'lucide-react';
import styles from './styles.module.css';
import { useState, useEffect } from 'react';

type AvailableThemes = 'dark' | 'light';

export function Menu() {
  // 1. Inicialização preguiçosa buscando do localStorage
  const [theme, setTheme] = useState<AvailableThemes>(() => {
    const storageTheme =
      (localStorage.getItem('theme') as AvailableThemes) || 'dark';
    return storageTheme;
  });

  // 2. Dicionário de ícones baseado no tema atual
  const nextThemeIcon = {
    dark: <SunIcon />,
    light: <MoonIcon />,
  };

  // 3. Função pura de atualização de estado
  function handleThemeChange(
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  ) {
    event.preventDefault();

    setTheme(prevTheme => {
      const nextTheme = prevTheme === 'dark' ? 'light' : 'dark';
      return nextTheme;
    });
  }

  // 4. Efeito Colateral: Aplica no HTML e salva no Storage
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <nav className={styles.menu}>
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
        {nextThemeIcon[theme]}
      </a>
    </nav>
  );
}
```
