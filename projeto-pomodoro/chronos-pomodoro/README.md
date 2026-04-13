# Tarefa: identidade visual (favicon, título, PWA) e áudios para alerta de fim de ciclo

## Objetivo

1. **Pasta `public/`** — deixar o app com **título** adequado, **favicon** nos navegadores e **Web App Manifest** para o Chrome/Edge oferecerem **“Instalar aplicativo”** (atalho em janela própria, sem precisar “instalar” um `.exe`).
2. **Pasta `src/assets/audios/`** — incluir arquivos de som que serão usados **na próxima etapa** quando a tarefa for **completada** (contador chega a zero e disparamos `COMPLETE_TASK`): tocar um **alerta sonoro** para o usuário perceber o fim do Pomodoro.

Nada disso exige importar imagem no React: favicons e manifest são referenciados **direto no `index.html`** com URLs que começam em `/` (raiz do site servida pelo Vite).

## Onde colocar os arquivos no projeto

| Tipo | Pasta no repositório | Uso |
|------|----------------------|-----|
| Favicon, ícones PWA, manifest | `projeto-pomodoro/chronos-pomodoro/public/images/` | A aula organiza em subpasta **`public/images/favicon/`** (todos os PNG/SVG/ICO + `site.webmanifest` juntos). O Vite expõe `public/` na **raiz** do endereço: arquivo em `public/images/favicon/favicon.ico` vira URL **`/images/favicon/favicon.ico`**. |
| Sons de notificação | `projeto-pomodoro/chronos-pomodoro/src/assets/audios/` | Importados no código com `import ... from '@/assets/audios/arquivo.mp3'` (ou caminho relativo), para o bundler incluir o arquivo no build. |

**Importante:** os caminhos em `index.html` e dentro de `site.webmanifest` (campo `icons[].src`) devem ser **idênticos** à estrutura real de pastas sob `public/`. Se os arquivos estiverem em `public/images/` sem subpasta `favicon`, use `/images/nome-do-arquivo.png`; se estiverem em `public/images/favicon/`, use `/images/favicon/nome-do-arquivo.png`.

## Passo 1 — Gerar favicon e manifest

1. Prepare uma imagem quadrada (ex.: ícone baseado em **Lucide** ou logo simples).
2. Use um gerador online — o da aula é o **[RealFaviconGenerator](https://realfavicongenerator.net/)** (“The real favicon generator…”): envie a imagem e baixe o pacote com **`.ico`**, **PNG** em vários tamanhos, **SVG** (se disponível), **apple-touch-icon** e **`site.webmanifest`**.
3. Alternativa gratuita: **[favicon.io](https://favicon.io/)** (texto, emoji ou upload de imagem → pacote para download).

Copie o conteúdo gerado para:

- `public/images/favicon/` (recomendado na aula), **ou**
- `public/images/` mantendo nomes claros (`favicon.ico`, `favicon.svg`, `apple-touch-icon.png`, `web-app-manifest-192x192.png`, etc.).

## Passo 2 — Ajustar `index.html`

Arquivo: `projeto-pomodoro/chronos-pomodoro/index.html`.

- **`lang`:** manter `pt-BR` se o app for em português.
- **`<title>`:** trocar para o nome do produto, ex.: **`Chronos Pomodoro`**.
- **Links de ícone:** substituir o favicon padrão do Vite pelas tags que o gerador forneceu, **ajustando apenas os `href`** para a sua pasta (exemplo com subpasta `favicon`):

```html
<link rel="icon" type="image/png" href="/images/favicon/favicon-96x96.png" sizes="96x96" />
<link rel="icon" type="image/svg+xml" href="/images/favicon/favicon.svg" />
<link rel="icon" type="image/png" href="/images/favicon/favicon.png" />
<link rel="shortcut icon" href="/images/favicon/favicon.ico" />
<link rel="apple-touch-icon" sizes="180x180" href="/images/favicon/apple-touch-icon.png" />
<link rel="manifest" href="/images/favicon/site.webmanifest" />
```

## Passo 3 — `site.webmanifest` (PWA)

O arquivo costuma vir do gerador com campos como:

- `name` / `short_name` — nome longo e curto do app.
- `lang` — ex.: `pt-BR`.
- `icons` — lista com `src`, `sizes`, `type`, às vezes `purpose: "maskable"`.
- `theme_color` / `background_color` — alinhados ao tema (ex.: cinza/verde do Chronos).
- `display` — ex.: `standalone` (janela “limpa”, sem parecer aba de navegador).
- `orientation`, `start_url`, `scope`, `description`, `id`.

Todos os **`src` dos ícones** no JSON devem ser URLs absolutas a partir da raiz, no mesmo padrão do `index.html`, por exemplo:

```json
"src": "/images/favicon/web-app-manifest-192x192.png"
```

Revise também `display_override` se o gerador incluir opções que você não quiser (a aula comenta preferência por janela simples).

## Passo 4 — Áudios em `src/assets/audios/`

Coloque um ou mais arquivos **`.mp3`** (ou `.ogg`) nesta pasta. No projeto de referência existem, por exemplo:

- `gravitational_beep.mp3` — som citado na aula (inspiração em ondas gravitacionais / “bip” discreto).
- Outras opções na mesma pasta para experimentar: `beep.mp3`, `tic_tac_planeta_miller.mp3`, etc.

**Onde baixar sons gratuitos (verifique sempre a licença):**

- **[Freesound](https://freesound.org/)** — comunidade com filtros por licença (muitos CC0 / CC BY).
- **[Mixkit](https://mixkit.co/free-sound-effects/)** — efeitos sonoros gratuitos para uso em projetos.
- **[Pixabay](https://pixabay.com/sound-effects/)** — efeitos e músicas com licença própria do site.
- **[Openverse](https://openverse.org/)** — busca agregada de mídia CC (inclui áudio).

Para o **“gravitational beep”** da narrativa da aula, muitas fontes citam divulgações da **LIGO/Virgo** (ondas gravitacionais convertidas em áudio) como material de divulgação científica — use cópias oficiais ou equivalentes com licença clara.

Nesta tarefa **basta** ter o arquivo no disco; **tocar** o som ao completar a task será implementado na próxima instrução (ex.: `Audio` ou `new Audio(url)` no fluxo do `COMPLETE_TASK` / Provider).

## Checklist

- [ ] Arquivos de favicon + `site.webmanifest` copiados para `public/images/` ou `public/images/favicon/`.
- [ ] `index.html` com `<title>Chronos Pomodoro</title>` (ou nome final do app) e `<link>`s coerentes com os caminhos reais.
- [ ] `site.webmanifest` com `icons[].src` apontando para arquivos que existem em `public/`.
- [ ] Pelo menos um `.mp3` em `src/assets/audios/` para o alerta de fim de ciclo.
- [ ] Teste: abrir o app, ver ícone na aba; no Chrome, ver opção de instalar / atalho (quando os critérios de PWA forem atendidos).

## Referência rápida de pastas no repositório

- `projeto-pomodoro/chronos-pomodoro/public/images/` — assets estáticos servidos em `/images/...`
- `projeto-pomodoro/chronos-pomodoro/src/assets/audios/` — áudios importados pelo código React/Vite
