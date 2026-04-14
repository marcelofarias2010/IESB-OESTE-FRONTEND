# Tarefa: separar o roteamento no `MainRouter` e corrigir scroll no topo

## Objetivo da aula

Nesta etapa vamos:

1. **Limpar o `App.tsx`**, movendo toda a configuração do React Router para um componente dedicado.
2. Criar o `MainRouter` em `src/routers/MainRouter/`.
3. Corrigir o problema de navegação onde a página abre no meio/final após trocar de rota.

---

## Por que fazer isso?

- O `App.tsx` fica mais simples e fácil de manter.
- Toda regra de rota fica em um lugar só.
- Se o React Router mudar no futuro, você ajusta no router central.
- Você já prepara o terreno para criar wrappers próprios (`AppLink`, `AppNavLink`) e evitar espalhar dependência externa no projeto inteiro.

---

## Passo 1 — Limpar o `App.tsx`

Antes, o `App` tinha `BrowserRouter`, `Routes` e `Route` diretamente nele.  
Agora ele só monta os contextos e chama o roteador principal.

Arquivo: `src/App.tsx`

```tsx
import { TaskContextProvider } from './contexts/TaskContext/TaskContextProvider';
import { MessagesContainer } from './components/MessagesContainer';
import { MainRouter } from './routers/MainRouter';
import './styles/theme.css';
import './styles/global.css';

export function App() {
  return (
    <TaskContextProvider>
      <MessagesContainer>
        <MainRouter />
      </MessagesContainer>
    </TaskContextProvider>
  );
}
```

---

## Passo 2 — Criar `MainRouter`

Arquivo: `src/routers/MainRouter/index.tsx`

Aqui fica toda a configuração de rotas:

- `/` -> `Home`
- `/about-pomodoro/` -> `AboutPomodoro`
- `*` -> `NotFound`

Também criamos um componente interno (`ScrollToTop`) para reagir à troca de URL.

```tsx
import { BrowserRouter, Route, Routes, useLocation } from 'react-router';
import { AboutPomodoro } from '../../pages/AboutPomodoro';
import { NotFound } from '../../pages/NotFound';
import { Home } from '../../pages/Home';
import { useEffect } from 'react';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  return null;
}

export function MainRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about-pomodoro/' element={<AboutPomodoro />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
      <ScrollToTop />
    </BrowserRouter>
  );
}
```

---

## Ponto importante sobre `useLocation`

`useLocation()` **precisa** estar dentro do contexto do router (`BrowserRouter`).  
Por isso ele está em um componente filho (`ScrollToTop`) que é renderizado dentro do `MainRouter`.

Se você tentar usar `useLocation` fora desse contexto, o React Router vai lançar erro.

---

## Truque usado na aula: componente que não renderiza UI

`ScrollToTop` retorna `null`, ou seja:

- é um componente React normal;
- pode usar hooks (`useEffect`, `useLocation`);
- mas **não desenha nada** na tela.

Ele existe apenas para executar efeito colateral quando a rota muda.

---

## Resultado esperado

- Navegar entre Home/About/NotFound sem reload completo da aplicação.
- Ao trocar rota, a janela volta para o topo com rolagem suave (`behavior: 'smooth'`).
- `App.tsx` mais limpo e organizado.

---

## Próxima etapa (próxima aula)

Criar wrappers próprios para links de navegação (ex.: `AppLink`) e parar de usar `Link` do `react-router` diretamente em vários componentes (`Menu`, `Footer`, `Logo`, `AboutPomodoro`, `NotFound`, etc.).
