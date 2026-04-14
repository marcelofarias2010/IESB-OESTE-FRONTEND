# Tarefa: página **History** — layout, tabela responsiva e rota

## Objetivo

Criar a página de **histórico** com estrutura visual pronta: título, botão de apagar (ícone), tabela com cabeçalhos e linhas de exemplo, CSS em **módulo**, **scroll horizontal** em telas estreitas e rota **`/history/`** no roteador. A lógica de dados (listar `state.tasks`, apagar histórico, status real) fica para aulas seguintes.

## O que foi feito (resumo)

| Item | Detalhe |
|------|---------|
| Página | `src/pages/History/index.tsx` — `MainTemplate`, `Container`, `Heading`, tabela dentro de wrapper |
| Estilos | `src/pages/History/styles.module.css` — botão compacto + tabela responsiva |
| Rotas | `src/routers/MainRouter/index.tsx` — `<Route path='/history/' element={<History />} />` |
| Menu | `src/components/Menu/index.tsx` — link para `/history/` (já existente) |

---

## Passo 1 — Registrar a rota

Arquivo: `src/routers/MainRouter/index.tsx`

Importe a página e adicione a rota (o path deve bater com o `href` do menu):

```tsx
import { History } from '../../pages/History';

// dentro de <Routes>:
<Route path='/history/' element={<History />} />
```

### Trecho atual do router

```tsx
import { BrowserRouter, Route, Routes, useLocation } from 'react-router';
import { AboutPomodoro } from '../../pages/AboutPomodoro';
import { NotFound } from '../../pages/NotFound';
import { Home } from '../../pages/Home';
import { useEffect } from 'react';
import { History } from '../../pages/History';

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
        <Route path='/history/' element={<History />} />
        <Route path='/about-pomodoro/' element={<AboutPomodoro />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
      <ScrollToTop />
    </BrowserRouter>
  );
}
```

---

## Passo 2 — Link no menu

Arquivo: `src/components/Menu/index.tsx`

Garanta `RouterLink` (ou `Link`) com `href='/history/'` e ícone de histórico — como no código atual.

---

## Passo 3 — Página `History`

Arquivo: `src/pages/History/index.tsx`

- Dois `Container`s: um com `Heading` (título + área do botão), outro com a tabela.
- Botão: `DefaultButton` com `TrashIcon`, `color='red'`, `aria-label` e `title` para acessibilidade.
- Tabela: `thead` com colunas **Tarefa, Duração, Data, Status, Tipo**; `tbody` com linhas geradas só para **protótipo visual** (`Array.from({ length: 20 })`).
- **`key`:** com dados reais use o **id da tarefa**; com índice temporário, `key={index}` é aceitável só neste mock (a aula alerta para não depender de índice quando a lista for reordenável).

### Código-fonte atual

```tsx
import { TrashIcon } from 'lucide-react';
import { Container } from '../../components/Container';
import { DefaultButton } from '../../components/DefaultButton';
import { Heading } from '../../components/Heading';
import { MainTemplate } from '../../templates/MainTemplate';

import styles from './styles.module.css';

export function History() {
  return (
    <MainTemplate>
      <Container>
        <Heading>
          <span>History</span>
          <span className={styles.buttonContainer}>
            <DefaultButton
              icon={<TrashIcon />}
              color='red'
              aria-label='Apagar todo o histórico'
              title='Apagar histórico'
            />
          </span>
        </Heading>
      </Container>

      <Container>
        <div className={styles.responsiveTable}>
          <table>
            <thead>
              <tr>
                <th>Tarefa</th>
                <th>Duração</th>
                <th>Data</th>
                <th>Status</th>
                <th>Tipo</th>
              </tr>
            </thead>

            <tbody>
              {Array.from({ length: 20 }).map((_, index) => {
                return (
                  <tr key={index}>
                    <td>Estudar</td>
                    <td>25min</td>
                    <td>20/04/2025 08:00</td>
                    <td>Completa</td>
                    <td>Foco</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Container>
    </MainTemplate>
  );
}
```

---

## Passo 4 — CSS modular (botão + tabela responsiva)

Arquivo: `src/pages/History/styles.module.css`

- **`.buttonContainer button`:** reduz largura mínima padrão do `DefaultButton` (ex.: `min-width: auto`), ajusta `padding` e tamanho do SVG — o botão de ícone não fica “largão” como o de play.
- **`.responsiveTable`:** `overflow-x: auto` para rolagem lateral quando a tabela for mais larga que a tela (mobile).
- **`table`:** `width: 100%`, `min-width: 64rem` para não esmagar colunas; `border-collapse: collapse`.
- **`th` / `td`:** cores do tema (`--gray-600` / `--gray-800`), borda inferior, `text-align: left`, `padding`.

### Código-fonte atual

```css
.buttonContainer button {
  min-width: auto;
  margin: 0;
  padding: 1rem;
}

.buttonContainer button svg {
  width: 2rem;
  height: 2rem;
}

.responsiveTable {
  overflow-x: auto;
  border-radius: 0.8rem;
}

.responsiveTable table {
  width: 100%;
  min-width: 64rem;
  font-size: 1.6rem;
  border-collapse: collapse;
}

.responsiveTable th {
  background-color: var(--gray-600);
}

.responsiveTable td {
  background-color: var(--gray-800);
}

.responsiveTable th,
.responsiveTable td {
  border-bottom: 0.2rem solid var(--gray-700);
  text-align: left;
  padding: 1.6rem;
}
```

**Confira** o `className` no JSX: `styles.responsiveTable` e `styles.buttonContainer` (nome do arquivo `styles.module.css` importado como `styles`).

---

## Como validar

1. Acesse `/history/` pelo menu ou pela URL.
2. Em viewport estreita, a área da tabela deve rolar **horizontalmente** sem quebrar o layout inteiro da página.
3. O botão vermelho de lixeira deve ficar visualmente **compacto** ao lado do título.
4. Navegue entre Home e History: o `ScrollToTop` do router deve levar ao topo ao mudar de rota.

---

## Próximas aulas (fora desta tarefa)

- Popular a tabela com `state.tasks` (map real).
- Implementar **apagar histórico** (`dispatch` + `localStorage` ou action dedicada).
- Status: completa / interrompida / abandonada conforme regras do app.

## Checklist

- [ ] Rota `/history/` no `MainRouter` e import de `History` de `pages/History`.
- [ ] Menu com link para `/history/`.
- [ ] Página com `Heading`, botão `DefaultButton` vermelho com `aria-label` e `title`.
- [ ] Tabela dentro de `.responsiveTable` com CSS de overflow e `min-width` na `table`.
- [ ] `styles.module.css` importado corretamente (`import styles from './styles.module.css'`).
