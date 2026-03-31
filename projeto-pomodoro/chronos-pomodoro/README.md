# 🦶 Criando o Footer: Rodapé Dinâmico e Finalizando o Layout

Para fechar com chave de ouro a estrutura visual da nossa página principal,
vamos criar o rodapé (Footer). Ele será um componente bem simples, focado em
exibir links de navegação e informações de direitos autorais.

Nesta aula, a grande sacada é aprender a inserir caracteres especiais e valores
dinâmicos (como o ano atual) diretamente no seu JSX!

## 🏗️ 1. O Componente Footer e Datas Dinâmicas

Crie a pasta `Footer` dentro de `components`, com os arquivos `index.tsx` e
`styles.module.css`.

Aqui, usaremos duas dicas muito úteis:

1. **Símbolo de Copyright:** No HTML/JSX, podemos renderizar o símbolo "©"
   usando a entidade HTML `&copy;`.
2. **Ano Automático:** Para não termos que atualizar o código todo dia 1º de
   janeiro, abrimos as chaves `{}` no JSX para executar JavaScript puro e
   pegamos o ano atual utilizando o método nativo `new Date().getFullYear()`.

**Arquivo:** `src/components/Footer/index.tsx`

```tsx
import styles from './styles.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <a href=''>Entenda como funciona a técnica pomodoro</a>
      <a href=''>
        {/* O &copy; vira © e o JS traz o ano atual dinamicamente! */}
        Chronos Pomodoro &copy; {new Date().getFullYear()} - Feito com 💚
      </a>
    </footer>
  );
}
```

💡 **Dica de atalho:** Se você estiver no Windows e quiser usar emojis (como o
coração verde), pressione `Win + Ponto (.)` para abrir o painel de emojis do
sistema!

## 🎨 2. Estilizando os Links

Nosso CSS será focado em organizar os itens usando Flexbox em formato de coluna.
Também vamos criar um feedback visual suave para quando o usuário passar o mouse
por cima dos links (`:hover`).

**Arquivo:** `src/components/Footer/styles.module.css`

```css
.footer {
  display: flex;
  flex-direction: column; /* Empilha os links um embaixo do outro */
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  gap: 1.6rem;
}

.footer a {
  color: var(--text-muted); /* Cor mais apagadinha para ficar discreto */
  text-decoration: none; /* Remove o sublinhado padrão de links */
}

/* Feedback visual interativo */
.footer a:hover {
  color: var(--text-muted);
  text-decoration: underline; /* Devolve o sublinhado ao passar o mouse */
}
```

## 🚀 3. Concluindo a Tela Inicial no App.tsx

Agora, basta importar o `<Footer />` no final do nosso App.tsx, envolvendo-o no
nosso componente `<Container />`.

Aproveitaremos também para dar uma limpada no código: deixaremos apenas um
`<DefaultButton>` (o verde de Play) dentro do formulário, removendo o botão
extra vermelho que usamos para testes na aula passada.

**Arquivo:** `src/App.tsx`

```tsx
import { Container } from './components/Container';
import { Logo } from './components/Logo';
import { Menu } from './components/Menu';
import { CountDown } from './components/CountDown';
import { DefaultInput } from './components/DefaultInput';
import { Cycles } from './components/Cycles';
import { DefaultButton } from './components/DefaultButton';
import { PlayCircleIcon } from 'lucide-react';
import { Footer } from './components/Footer'; // <-- Importado!

import './styles/theme.css';
import './styles/global.css';

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

      <Container>
        <form className='form' action=''>
          <div className='formRow'>
            <DefaultInput
              labelText='task'
              id='meuInput'
              type='text'
              placeholder='Digite algo'
            />
          </div>

          <div className='formRow'>
            <p>Lorem ipsum dolor sit amet.</p>
          </div>

          <div className='formRow'>
            <Cycles />
          </div>

          <div className='formRow'>
            {/* Mantivemos apenas o botão principal de Play */}
            <DefaultButton icon={<PlayCircleIcon />} />
          </div>
        </form>
      </Container>

      {/* Nosso novo rodapé entra aqui, no seu próprio Container! */}
      <Container>
        <Footer />
      </Container>
    </>
  );
}
```

Com isso, a estrutura visual básica da nossa página Home está montada e
funcionando perfeitamente (inclusive no mobile)! 🎉
