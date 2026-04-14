# Tarefa: roteamento com `react-router` v7 (sem recarregar a página)

## Objetivo da aula

Adicionar navegação SPA (Single Page Application) ao projeto usando **React Router v7**, evitando recarregar todos os scripts/imagens/áudios ao trocar de “página”.

Antes: links com `<a href="...">` recarregam a aplicação inteira.  
Agora: links com `<Link to="...">` trocam apenas o componente renderizado.

---

## Mudança importante da versão

No v7, a instalação usada no curso é:

```bash
npm i react-router
```

E os imports são feitos de:

```ts
import { BrowserRouter, Routes, Route, Link } from 'react-router';
```

> No material antigo (v6), você verá `react-router-dom`.  
> A ideia de uso é a mesma para esta aula.

---

## Passo 1 — Definir as rotas no `App`

Arquivo: `src/App.tsx`

Nesta etapa, o app foi envolvido com `BrowserRouter` e passou a usar `Routes` + `Route`:

- `/` → `Home`
- `/about-pomodoro/` → `AboutPomodoro`
- `*` → `NotFound` (rota coringa para qualquer URL inválida)

### Código-fonte

```tsx
import { Home } from './pages/Home';
import './styles/theme.css';
import './styles/global.css';
import { TaskContextProvider } from './contexts/TaskContext';
import { MessagesContainer } from './components/MessagesContainer';
import { BrowserRouter, Route, Routes } from 'react-router';
import { NotFound } from './pages/NotFound';
import { AboutPomodoro } from './pages/AboutPomodoro';

export function App() {
  return (
    <TaskContextProvider>
      <MessagesContainer>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/about-pomodoro/' element={<AboutPomodoro />} />

            <Route path='*' element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </MessagesContainer>
    </TaskContextProvider>
  );
}
```

---

## Passo 2 — Trocar links do menu para `Link`

Arquivo: `src/components/Menu/index.tsx`

A Home deixou de usar `<a href="/">` e passou a usar `<Link to="/">`, evitando reload.

### Código-fonte

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
import { Link } from 'react-router';

type AvailableThemes = 'dark' | 'light';

export function Menu() {
  const [theme, setTheme] = useState<AvailableThemes>(() => {
    const storageTheme =
      (localStorage.getItem('theme') as AvailableThemes) || 'dark';
    return storageTheme;
  });

  const nextThemeIcon = {
    dark: <SunIcon />,
    light: <MoonIcon />,
  };

  function handleThemeChange(
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  ) {
    event.preventDefault();

    setTheme(prevTheme => {
      const nextTheme = prevTheme === 'dark' ? 'light' : 'dark';
      return nextTheme;
    });
  }

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <nav className={styles.menu}>
      <Link
        className={styles.menuLink}
        to='/'
        aria-label='Ir para a Home'
        title='Ir para a Home'
      >
        <HouseIcon />
      </Link>

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

---

## Passo 3 — Trocar links do rodapé para `Link`

Arquivo: `src/components/Footer/index.tsx`

Mesma ideia: usar `Link` em vez de `a` para manter SPA.

### Código-fonte

```tsx
import { Link } from 'react-router';
import styles from './styles.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <Link to='/about-pomodoro/'>
        Entenda como funciona a técnica pomodoro
      </Link>
      <Link to='/'>
        Chronos Pomodoro &copy; {new Date().getFullYear()} - Feito com 💚
      </Link>

    </footer>
  );
}
```

---

## Como validar

1. Abra a aba **Network** no DevTools.
2. Navegue entre Home e About pelo menu/rodapé.
3. Confirme que **não há reload completo da página** (sem recarregar bundle inteiro a cada clique).
4. Teste uma rota inexistente (ex.: `/abc`) e confirme renderização da página `NotFound`.

---

## Observação importante (próximas aulas)

Ao trocar rotas, a página pode manter posição de rolagem (não voltar ao topo automaticamente).  
Isso será tratado depois com uma solução própria de controle de scroll por navegação.

Também será criado um **adapter/router wrapper** para não espalhar dependência direta de `react-router` por todos os componentes.

---

## Referência de estudo

Nesta aula foi citado um minicurso gratuito de React Router v6 como base conceitual.  
Como o v7 mantém a mesma linha de uso para o que estamos fazendo aqui, o conteúdo segue válido para estudo e revisão.
