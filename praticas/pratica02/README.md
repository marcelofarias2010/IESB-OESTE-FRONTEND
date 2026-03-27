---
name: "Prática 02"
about: "Template para criar a issue da pratica02"
title: "[Prática 02] – HTML5, CSS3 e Flexbox: Projeto TechStore"
labels: ["pratica02", "html-css"]
---

## 🎯 Objetivo
Nesta prática, você assumirá o papel de **Desenvolvedor Frontend** e transformará o protótipo do projeto "TechStore" em código real. O foco desta aula é estruturar a página com **HTML5 semântico** e utilizar os conceitos de **Flexbox** (Flex Container e Flex Items) para construir o layout da vitrine digital.

## 📝 Estudo de Caso: Projeto "TechStore"

### 1️⃣ Requisitos de Telas e Estrutura (HTML5)
Crie um arquivo `index.html` e estruture as seguintes seções utilizando tags semânticas:
- **Header (`<header>`)**: Deve conter o logotipo da "TechStore" alinhado à esquerda e um ícone de carrinho de compras (com um contador numérico) alinhado à direita.
- **Hero Section (`<section>`)**: Um banner principal contendo uma imagem de fundo (ou cor de destaque) e uma frase de impacto centralizada (Ex: *"As melhores ofertas de tecnologia"*).
- **Grid de Produtos (`<main>` ou `<section>`)**: Uma vitrine que abrigará **pelo menos 6 cards** de produtos eletrônicos.
- **Footer (`<footer>`)**: O rodapé da página contendo informações de contato, direitos autorais e links de redes sociais.

### 2️⃣ Anatomia do "Card de Produto" (Flex Item)
Cada um dos 6 produtos no seu HTML deve ser encapsulado em uma tag `<article>` (ou `<div>` com classe específica) contendo:
- Espaço para a imagem do produto (`<img>` ou div vazia com cor de fundo).
- Nome do produto (`<h3>` ou `<h4>`).
- Preço original (riscado) e o preço com desconto em destaque.
- Botão de ação: "Adicionar ao Carrinho" (`<button>`).

### 3️⃣ Aplicando o Flexbox e o Guia de Estilos (CSS3)
Crie um arquivo `style.css` (não se esqueça de importá-lo no HTML). Você deve aplicar os seguintes conceitos:

* **Guia de Estilos (Variáveis CSS):**
    * Defina no `:root` uma paleta de 3 cores (Primária, Secundária e Neutra).
    * Importe do *Google Fonts* e aplique 2 fontes diferentes (uma para os títulos e outra para os textos/preços).
* **Flex Containers e Flex Items:**
    * **Header**: Transforme em um *Flex Container* (`display: flex`) e utilize `justify-content: space-between` para separar a logo do carrinho. Utilize `align-items: center` para centralizá-los verticalmente.
    * **Hero Section**: Use Flexbox para garantir que a frase de impacto fique perfeitamente centralizada na tela, tanto horizontal quanto verticalmente (`justify-content: center` e `align-items: center`).
    * **Grid de Produtos**: Transforme a vitrine em um *Flex Container* e aplique `flex-wrap: wrap;` para que os cards quebrem a linha automaticamente quando não houver espaço na tela. Utilize a propriedade `gap` para dar espaçamento entre os cards.
    * **Card Interno**: Transforme o próprio card em um *Flex Container* com `flex-direction: column;` para que a imagem, título, preços e botão fiquem perfeitamente empilhados.

---

## 🚀 Instruções de Execução e Entrega

**1. Preparação do Ambiente**
```bash
git checkout develop
git checkout -b feature/pratica02
```

**2. Desenvolvimento**

- Acesse a pasta praticas/ e crie a pasta `pratica02/`.
- Crie os arquivos `index.html` e `style.css` e implemente os requisitos acima.
- Dica: Para ver o resultado em tempo real, clique com o botão direito no arquivo HTML no VS Code e selecione "Open with Live Server".

**3. Envio para o GitHub**
- Abra o terminal na raiz do repositório e execute:
```bash
git add .
git commit -m "Feat: Cria o layout da vitrine TechStore usando Flexbox"
git push origin feature/pratica02
```
**4. Finalização**
- No GitHub, abra um Pull Request da sua branch feature/pratica02 para a branch develop.
- Na descrição, adicione: Nesta prática, construí o layout da TechStore aplicando HTML5 semântico e CSS Flexbox. - Fecha #ID (substitua o ID pelo número desta Issue).
- Envie o link do Pull Request na plataforma de ensino.

