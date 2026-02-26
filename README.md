# 🎓 Construção de Frontend
Repositório destinado às aulas teóricas e às atividades práticas da disciplina.

## 🛠️ Ambiente de Desenvolvimento
Para acompanhar a disciplina, você precisará das seguintes ferramentas:
| Ferramenta | O que é? | Recomendação |
| :--- | :--- | :--- |
| **Editor de código** | Ambiente onde você escreverá seu código (HTML, CSS, JS, JSX). | [Visual Studio Code](https://code.visualstudio.com/) | 
| **Ambiente de Execução** | Necessário para rodar o servidor de desenvolvimento e gerenciar pacotes (npm). | [Node.js (versão LTS)](https://nodejs.org/pt-br/) |
| **Versionador** | Controla e registra o histórico de alterações do código. | [Git](https://git-scm.com/) |

## 📂 Estrutura de Pastas
Este repositório está organizado da seguinte forma:
- **`aulas/`**: Contém os códigos e exemplos utilizados nas aulas teóricas.
- **`praticas/`**: Contém os códigos das atividades práticas desenvolvidas pelos alunos.

## 🚀 Fluxo de Trabalho Acadêmico
As atividades seguem o fluxo de trabalho baseado no modelo [GitFlow](https://www.atlassian.com/br/git/tutorials/comparing-workflows/gitflow-workflow).

### 1. Configuração Inicial (realizar apenas uma vez)
Execute estes passos para preparar seu ambiente:
1. **Criar Repositório**: Clique no botão `Use this template`, no topo da página, para criar uma cópia deste repositório na sua conta GitHub.
2. **Clonar Repositório**: Faça o clone do seu repositorio para a sua máquina local:
```bash
git clone https://github.com/SEU_USUARIO/template-for-frontend-class.git
```
3. **Configurar Identificação**: Certifique-se que seu **nome** e **email** estejam configurados no Git:
```bash
git config --global user.name "Seu Nome"
git config --global user.email "seu@email.com"
``` 

### 2. Entrega de Atividades (repetir para cada prática)
Para cada nova atividade, siga o fluxo abaixo:
1. **Crie uma Issue**: Acesse a aba `Issues` no GitHub e clique no botão `New issue` para criar a prática usando o template correspondente.
2. **Crie uma branch**: Acesse a branch `develop` e crie uma nova branch.
3. **Desenvolva e teste**: Implemente os arquivos na pasta da prática e realize os testes.
4. **Envie para o GitHub**: Salve suas alterações e envie para o seu repositório.
5. **Solicite a revisão**: Acesse o seu repositório no GitHub e crie um `Pull Request` direcionando para a sua branch `develop`. 

> ⚠️ **Atenção!**<br>
> Se o check ✅ não aparecer no `Pull Request`, há erros de compilação ou sintaxe que precisam ser corrigidos.

### 3. **Instale as dependências e rode o projeto:** Ao acessar a pasta de um projeto React, instale os pacotes necessários e inicie o servidor local:
```bash
npm install
npm run dev   # ou npm start, dependendo de como o projeto foi criado
```

### 4. **Desenvolva e teste:** Implemente os arquivos solicitados na pasta da prática e verifique no navegador se tudo está funcionando corretamente.

### 5. **Envie para o GitHub:** Salve suas alterações, crie os commits e envie para o seu repositório:
```bash
git add .
git commit -m "Feat: Finaliza a implementação da Prática XX"
git push origin feature/praticaXX
```

### 6. Feedback e Avaliação
Envie o link do seu `Pull Request` pela plataforma de ensino da instituição. A avaliação do código será feita usando o sistema de **Code Review**:
- **Approve (Aprovado):** Seu código cumpre os requisitos solicitados.
- **Request Changes (Solicitação de Ajustes):** Foram encontrados pontos de melhoria, bugs ou erros de sintaxe. Você deve corrigir na sua máquina, fazer um novo commit+push na mesma branch e avisar no comentário do PR para uma nova revisão.

