# ⚛️ Dominando o Ecossistema React: Fundamentos e Práticas

Este documento consolida os pilares essenciais para o desenvolvimento de aplicações modernas com React, conectando conceitos da documentação oficial com padrões de mercado.

---

## 🎭 1. Estados e Eventos

Componentes React precisam "lembrar" de informações para criar interatividade. O estado é a memória do componente, e os eventos são os gatilhos que alteram essa memória.

- **Estado (`useState`)**: Quando um estado muda, o React re-renderiza o componente automaticamente.
- **Eventos**: Sintaxe camelo (ex: `onClick`) que recebe uma função como manipulador.

### 🔗 Referências para Aprofundamento:

- [Respondendo a Eventos (Doc Oficial)](https://react.dev/learn/responding-to-events)
- [Estado: A Memória do Componente (Doc Oficial)](https://react.dev/learn/state-a-components-memory)

---

## 📝 2. Formulários: Componentes Controlados

No React, a "única fonte da verdade" deve ser o estado. Por isso, transformamos inputs nativos em componentes controlados, onde o React dita o valor do campo.

- O atributo `value` do input é vinculado a um estado.
- O evento `onChange` atualiza esse estado em tempo real.

### 🔗 Referências para Aprofundamento:

- [Controlando um Input com Estado (Doc Oficial)](https://react.dev/reference/react-dom/components/input#controlling-an-input-with-a-state-variable)

---

## 📋 3. Listagens: Renderizando Dados com Chaves (`keys`)

Para exibir múltiplos itens (como uma lista de tarefas), utilizamos o método `.map()`. É obrigatório o uso da propriedade `key` para que o React saiba exatamente qual item foi alterado, adicionado ou removido, garantindo performance.

### 🔗 Referências para Aprofundamento:

- [Renderizando Listas e o uso de Keys (Doc Oficial)](https://react.dev/learn/rendering-lists)

---

## 🗺️ 4. Navegação e Rotas (SPA)

O React é uma biblioteca de interface e não possui roteamento nativo. Para criar uma Single Page Application (SPA), onde a página não recarrega ao navegar, utilizamos ferramentas externas.

- **Padrão de Mercado**: [React Router DOM](https://reactrouter.com/).
- **Componentes Principais**: `BrowserRouter`, `Routes`, `Route` e `Link`.

### 🔗 Referências para Aprofundamento:

- [Documentação Oficial do React Router](https://reactrouter.com/)
- [Visão do React sobre Roteamento e Frameworks (Doc Oficial)](https://react.dev/learn/start-a-new-react-project)

---

## 🧠 5. Gerenciamento de Estado Avançado

À medida que a aplicação cresce, passar informações via _props_ entre muitos níveis (Prop Drilling) torna-se insustentável. O React oferece soluções nativas e suporte a bibliotecas de terceiros.

1.  **Lifting State Up**: Elevar o estado para o pai comum mais próximo.
2.  **Context API + useReducer**: Para estados globais e lógicas complexas (como fizemos no sistema de Pomodoro).
3.  **Bibliotecas Externas**: Redux, Zustand ou TanStack Query para casos de grande escala.

### 🔗 Referências para Aprofundamento:

- [Compartilhando Estado (Lifting State Up)](https://react.dev/learn/sharing-state-between-components)
- [Escalando com Reducer e Context (Doc Oficial)](https://react.dev/learn/scaling-up-with-reducer-and-context)

---

## 🚀 Próximos Passos

1.  Pratique a criação de um formulário que adiciona itens a uma lista.
2.  Tente mover o estado dessa lista para um Contexto Global.
3.  Adicione rotas para separar a visualização da lista da página de criação.
