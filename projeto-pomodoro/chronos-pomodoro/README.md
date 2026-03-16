# ⏱️ Criando o CountDown e Dominando Fontes Responsivas

Bora lá para o próximo componente! Mesmo se a bateria da câmera acabar, o código
não pode parar.

Nesta aula, vamos criar o "coração" da nossa aplicação: o contador de tempo
(`CountDown`). Além de estruturar o componente (que inicialmente terá um valor
estático de `00:00`), vamos aprender uma técnica fantástica de CSS para deixar a
tipografia 100% responsiva sem precisar de dezenas de _Media Queries_.

---

## 🏗️ 1. Criando o Componente CountDown

Para ganhar tempo, vamos repetir o processo das aulas anteriores: copie a pasta
de um componente simples, cole e renomeie para `CountDown`.

Por enquanto, não precisamos receber propriedades (`props`), e o valor do
relógio será inserido diretamente no texto. A lógica de contagem regressiva será
implementada futuramente.

**Arquivo:** `src/components/CountDown/index.tsx` (ou `.jsx`)

```tsx
import styles from './styles.module.css';

export function CountDown() {
  return <div className={styles.container}>00:00</div>;
}
```

## 📏 2. O Problema das Fontes Fixas

Se colocarmos um tamanho fixo gigante (ex: `font-size: 16rem`), o relógio ficará
ótimo em monitores grandes. Porém, se abrirmos o site em um celular, o texto vai
estourar os limites da tela, quebrando o layout.

Se usarmos apenas a largura da tela (ex: `font-size: 30vw`), a fonte vai
encolher infinitamente em telas pequenas e crescer infinitamente em telas
gigantes. Precisamos de um "meio-termo" inteligente.

.

## 🪄 3. A Mágica do CSS `clamp()`

Para resolver isso, usaremos a função nativa do CSS chamada `clamp()`. Ela
funciona como um limitador inteligente, recebendo três valores:

1. **Mínimo:** O menor tamanho que a fonte pode ter (`8rem`).
2. **Ideal:** O tamanho adaptável baseado na largura da tela (`30vw`).
3. **Máximo:** O limite de crescimento da fonte (`16rem`).

Abra o arquivo de estilos e aplique o seguinte código:

**Arquivo:** `src/components/CountDown/styles.module.css`

```css
.container {
  font-size: clamp(8rem, 30vw, 16rem);
  font-weight: bold;
  text-align: center;
  line-height: 1.3;
}
```

## 🧠 Como o navegador lê isso?

- A fonte tentará ocupar 30% da largura da tela (`30vw`).
- Porém, se a tela for muito pequena (celulares), a fonte **nunca será menor
  que** `8rem`.
- E se a tela for muito grande (monitores ultrawide), a **fonte nunca passará
  de** `16rem`.

## 📱 4. Testando a Responsividade no Navegador

Para garantir que nosso `clamp()` está funcionando perfeitamente, vamos
adicionar o componente à nossa tela principal.

**Arquivo:** `src/App.tsx` (ou `.jsx`)

```tsx
import { Container } from './components/Container';
import { Logo } from './components/Logo';

import './styles/theme.css';
import './styles/global.css';
import { Menu } from './components/Menu';
import { CountDown } from './components/CountDown';

export function App() {
  return (
    <>
      <Container>
        <Logo />
      </Container>
      <Container>
        <Menu />
      </Container>
      <Container>
        <CountDown />
      </Container>
    </>
  );
}
```

Abra o projeto no navegador, pressione `F12` (DevTools) e clique no ícone de
Dispositivos para simular telas de celulares como o iPhone SE ou Galaxy S8. Você
notará que o relógio se ajusta perfeitamente sem quebrar o layout!
