---
name: "🚀 Prática 01: Estrutura Básica React + Vite"
about: "Template para a primeira prática de construção de frontend."
title: "[Prática 01] – Estrutura Básica de um Programa em ReactJS"
labels: ["prática-01", "react"]
assignees: ""
---

## 🎯 Objetivo

Nesta prática, você irá:

- Criar seu primeiro projeto React utilizando a ferramenta **Vite**;
- Compreender a estrutura de pastas e arquivos de um projeto moderno;
- Manipular o servidor de desenvolvimento local;
- Realizar sua primeira alteração em um componente (`App.jsx`).

---

## 📝 Passo a Passo da Atividade

### 1️⃣ Preparação do Ambiente

Abra o VS Code na pasta raiz do seu repositório e execute no terminal:

```bash
# Garanta que está na branch correta
git checkout develop
git pull origin develop

# Crie a branch da tarefa
git checkout -b feature/pratica01
```

### 2️⃣ Criando o Projeto com Vite

- Navegue até a pasta de práticas e gere o scaffold do projeto:

```bash
cd praticas

# Comando para criar o projeto
npm create vite@latest pratica01 -- --template react
```

### 3️⃣ Instalação e Execução

- Agora, entre na pasta criada, instale as dependências e rode o projeto:

```bash
cd pratica01
npm install
npm run dev
```

💡 **Dica:** Pressione `Ctrl + Clique` no link `http://localhost:5173/` no terminal para abrir no navegador.

### 4️⃣ Modificação do Componente

1. No VS Code, abra `praticas/pratica01/src/App`.jsx.
2. Altere o conteúdo da tag `<h1>` ou de um parágrafo para: "Olá, Mundo! Este é meu primeiro projeto React com Vite.".
3. Salve o arquivo e observe a atualização instantânea no navegador (Hot Module Replacement).

### 📤 Entrega (Fluxo Git)

Após validar a alteração no navegador, siga estes comandos rigorosamente:

1. Parar o servidor: Pressione `Ctrl + C` no terminal.
2. Voltar para a raiz do repositório:

```bash
cd ../..
```

3. Enviar para o GitHub:

```bash
git add .
git commit -m "feat: estrutura inicial react via vite na pratica 01"
git push origin feature/pratica01
```

### ✅ Checklist de Conclusão

- [ ] Criei o Pull Request direcionado para a minha branch `develop`.
- [ ] O Check Verde (✅) apareceu no Pull Request (sem erros de sintaxe).
- [ ] No comentário do PR, escrevi: `Fecha #ID` (Substitua ID pelo número desta Issue).
- [ ] A estrutura de pastas está conforme o esperado:

```plantext
praticas/
└── pratica01/
    ├── src/
    │   ├── App.jsx
    │   └── main.jsx
    ├── index.html
    ├── package.json
    └── vite.config.js
```

_Dúvidas? Marque o professor com um comentário aqui nesta Issue!_
