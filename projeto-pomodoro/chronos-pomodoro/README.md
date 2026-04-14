# Tarefa: criar o `RouterLink` (wrapper) e substituir links da aplicação

## Objetivo da aula

Depois de organizar as rotas no `MainRouter`, o próximo passo é **parar de usar `Link` do React Router diretamente** em vários componentes.

Nesta aula você vai:

1. criar um componente próprio de link (`RouterLink`);
2. padronizar o uso de `href` (estilo âncora HTML) em vez de `to`;
3. substituir os links espalhados em `Menu`, `Footer`, `Logo`, `AboutPomodoro` e `NotFound`.

Isso reduz acoplamento com biblioteca externa e facilita manutenção futura.

---

## Por que fazer wrapper de link?

Se o React Router mudar API no futuro, você não precisa caçar `Link` em todo projeto.
Você ajusta **um único ponto**: o seu `RouterLink`.

É a mesma ideia de adapter que já usamos com mensagens (`showMessage`).

---

## Passo 1 — Criar o componente `RouterLink`

Arquivo: `src/components/RouterLink/index.tsx`

### Código-fonte

```tsx
import { Link } from 'react-router';

type RouterLinkProps = {
  children: React.ReactNode;
  href: string;
} & React.ComponentProps<'a'>;

export function RouterLink({ children, href, ...props }: RouterLinkProps) {
  return (
    <Link to={href} {...props}>
      {children}
    </Link>
  );
}
```

### O que esse código faz

- `href` é obrigatório e vira `to` internamente.
- `React.ComponentProps<'a'>` permite passar props comuns de link (`className`, `title`, `aria-label`, etc.).
- `children` mantém flexibilidade (texto, ícone, JSX).

---

## Passo 2 — Substituir links no `Menu`

Arquivo: `src/components/Menu/index.tsx`

### Código-fonte (arquivo atual)

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
import { RouterLink } from '../RouterLink';

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
      <RouterLink
        className={styles.menuLink}
        href='/'
        aria-label='Ir para a Home'
        title='Ir para a Home'
      >
        <HouseIcon />
      </RouterLink>

      <RouterLink
        className={styles.menuLink}
        href='/history/'
        aria-label='Ver Histórico'
        title='Ver Histórico'
      >
        <HistoryIcon />
      </RouterLink>

      <RouterLink
        className={styles.menuLink}
        href='/settings/'
        aria-label='Configurações'
        title='Configurações'
      >
        <SettingsIcon />
      </RouterLink>

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

> O botão de tema continua como `<a>` com `onClick`, porque não é navegação de rota.

---

## Passo 3 — Substituir links no `Footer`

Arquivo: `src/components/Footer/index.tsx`

### Código-fonte

```tsx
import styles from './styles.module.css';
import { RouterLink } from '../RouterLink';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <RouterLink href='/about-pomodoro/'>
        Entenda como funciona a técnica pomodoro
      </RouterLink>
      <RouterLink href='/'>
        Chronos Pomodoro &copy; {new Date().getFullYear()} - Feito com 💚
      </RouterLink>

    </footer>
  );
}
```

---

## Passo 4 — Substituir link na `Logo`

Arquivo: `src/components/Logo/index.tsx`

### Código-fonte

```tsx
import { TimerIcon } from 'lucide-react';
import styles from './styles.module.css';
import { RouterLink } from '../RouterLink';

export function Logo() {
  return (
    <div className={styles.logo}>
      <RouterLink className={styles.logoLink} href='/'>
        <TimerIcon />
        <span>Chronos</span>
      </RouterLink>
    </div>
  );
}
```

---

## Passo 5 — Substituir links internos das páginas

### `AboutPomodoro`

Arquivo: `src/pages/AboutPomodoro/index.tsx`

Links internos agora usam `RouterLink`:

```tsx
import { Container } from '../../components/Container';
import { GenericHtml } from '../../components/GenericHtml';
import { Heading } from '../../components/Heading';
import { RouterLink } from '../../components/RouterLink';
import { MainTemplate } from '../../templates/MainTemplate';

export function AboutPomodoro() {
  return (
    <MainTemplate>
      <Container>
        <GenericHtml>
          <Heading>A Técnica Pomodoro 🍅</Heading>

          {/* ... restante do conteúdo ... */}

          <p>
            Você pode configurar o tempo de foco, descanso curto e descanso
            longo do jeito que quiser! Basta acessar a{' '}
            <RouterLink href='/settings/'>página de configurações</RouterLink> e
            ajustar os minutos como preferir.
          </p>

          {/* ... restante do conteúdo ... */}

          <p>
            Todas as suas tarefas e ciclos concluídos ficam salvos no{' '}
            <RouterLink href='/history/'>histórico</RouterLink>, com status de
            completas ou interrompidas.
          </p>

          {/* ... restante do conteúdo ... */}

          <p>
            <strong>Pronto pra focar?</strong> Bora lá{' '}
            <RouterLink href='/'>voltar para a página inicial</RouterLink> e
            iniciar seus Pomodoros! 🍅🚀
          </p>
        </GenericHtml>
      </Container>
    </MainTemplate>
  );
}
```

### `NotFound`

Arquivo: `src/pages/NotFound/index.tsx`

```tsx
import { Container } from '../../components/Container';
import { GenericHtml } from '../../components/GenericHtml';
import { Heading } from '../../components/Heading';
import { RouterLink } from '../../components/RouterLink';
import { MainTemplate } from '../../templates/MainTemplate';

export function NotFound() {
  return (
    <MainTemplate>
      <Container>
        <GenericHtml>
          <Heading>404 - Página não encontrada 🚀</Heading>
          <p>
            Opa! Parece que a página que você está tentando acessar não existe.
            Talvez ela tenha tirado férias, resolvido explorar o universo ou se
            perdido em algum lugar entre dois buracos negros. 🌌
          </p>
          <p>
            Mas calma, você não está perdido no espaço (ainda). Dá pra voltar em
            segurança para a <RouterLink href='/'>página principal</RouterLink>{' '}
            ou <RouterLink href='/history/'>para o histórico</RouterLink> — ou
            pode ficar por aqui e fingir que achou uma página secreta que só os
            exploradores mais legais conseguem acessar. 🧭✨
          </p>
        </GenericHtml>
      </Container>
    </MainTemplate>
  );
}
```

---

## Checklist de validação

- [ ] Clicar nos links de `Menu`, `Footer` e `Logo` navega sem reload completo.
- [ ] Links de `AboutPomodoro` e `NotFound` funcionam com `RouterLink`.
- [ ] Rotas ainda inexistentes (`/history/`, `/settings/`) continuam indo para `NotFound` (comportamento esperado por enquanto).
- [ ] O timer/estado global não “reseta” ao navegar entre páginas.

---

## Observação para próxima aula

Agora que o link está centralizado, o próximo passo é manter a mesma estratégia para outras partes de navegação (ex.: variação com estado ativo, links especiais e melhorias de UX como título dinâmico da aba).
