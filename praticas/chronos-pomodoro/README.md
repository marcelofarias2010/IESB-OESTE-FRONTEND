# Pomodoro App - Autenticação Completa com React + Node.js + MySQL

## Descrição do Projeto

Este projeto consiste em uma aplicação Pomodoro desenvolvida com React no frontend e Node.js com MySQL no backend.

A aplicação implementa autenticação completa de usuários, incluindo cadastro, login, recuperação de senha, controle de sessão e proteção de rotas, garantindo que apenas usuários autenticados possam acessar as funcionalidades principais do sistema.

Além disso, os módulos de configurações (Settings) e tarefas (Tasks) possuem controle de acesso individual, permitindo que cada usuário visualize e gerencie apenas seus próprios dados.

---

## Funcionalidades Implementadas

### Autenticação

* Cadastro de novos usuários.
* Login integrado ao banco de dados.
* Senhas armazenadas utilizando hash seguro (bcrypt).
* Controle de sessão através de JWT.
* Logout com encerramento da sessão.
* Proteção de rotas no frontend e backend.
* Bloqueio de acesso direto via URL para usuários não autenticados.

### Recuperação de Senha

* Solicitação de redefinição de senha.
* Geração de token temporário.
* Validação do token.
* Redefinição da senha.
* Fluxo documentado para testes em ambiente de desenvolvimento.

### Pomodoro

* Acesso permitido apenas para usuários autenticados.
* Exibição de mensagem de boas-vindas após login.
* Utilização das funcionalidades principais somente com sessão válida.

### Tasks

* CRUD completo de tarefas.
* Cada usuário acessa somente suas próprias tarefas.
* Endpoints protegidos por autenticação.

### Settings

* Configurações individuais por usuário.
* Dados protegidos por autenticação.
* Acesso restrito ao proprietário dos dados.

---

# Tecnologias Utilizadas

## Frontend

* React
* React Router DOM
* Axios
* Context API
* LocalStorage

## Backend

* Node.js
* Express
* MySQL
* JWT (JSON Web Token)
* bcrypt
* dotenv

---

# Estrutura do Projeto

```bash
projeto/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── models/
│   ├── database/
│   └── package.json
│
└── README.md
```

---

# Configuração do Banco de Dados

Criar um banco MySQL:

```sql
CREATE DATABASE pomodoro_db;
```

Configurar as tabelas necessárias:

```sql
users
tasks
settings
password_reset_tokens
```

---

# Variáveis de Ambiente

## Backend (.env)

```env
PORT=3001

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=pomodoro_db

JWT_SECRET=seu_jwt_secret

TOKEN_EXPIRES_IN=1h
```

---

# Como Executar o Backend

Entrar na pasta backend:

```bash
cd backend
```

Instalar dependências:

```bash
npm install
```

Iniciar servidor:

```bash
npm run dev
```

Servidor disponível em:

```bash
http://localhost:3001
```

---

# Como Executar o Frontend

Entrar na pasta frontend:

```bash
cd frontend
```

Instalar dependências:

```bash
npm install
```

Executar aplicação:

```bash
npm start
```

Aplicação disponível em:

```bash
http://localhost:3000
```

---

# Testando os Fluxos Principais

## 1. Cadastro

1. Acesse a tela de cadastro.
2. Informe:

   * Nome
   * E-mail
   * Senha
3. Clique em "Cadastrar".
4. O usuário será salvo no banco com senha criptografada.

Resultado esperado:

```text
Cadastro realizado com sucesso.
```

---

## 2. Login

1. Acesse a tela de login.
2. Informe e-mail e senha cadastrados.
3. Clique em "Entrar".

Resultado esperado:

```text
Login realizado com sucesso.
```

O sistema gera um JWT e libera acesso às funcionalidades.

---

## 3. Utilização do Pomodoro

Após autenticação:

* Exibição da mensagem de boas-vindas.
* Acesso às tarefas.
* Acesso às configurações.
* Utilização do temporizador Pomodoro.

Exemplo:

```text
Bem-vindo, João!
```

---

## 4. Recuperação de Senha

### Solicitação

1. Clique em "Esqueci minha senha".
2. Informe o e-mail cadastrado.

O sistema gera um token temporário.

Em ambiente de desenvolvimento o token é exibido:

```text
http://localhost:3000/reset-password/TOKEN
```

### Redefinição

1. Acesse o link gerado.
2. Informe a nova senha.
3. Confirme a alteração.

Resultado esperado:

```text
Senha redefinida com sucesso.
```

---

## 5. Logout

1. Clique em "Logout".

Resultado esperado:

* JWT removido.
* Sessão encerrada.
* Redirecionamento para Login.

---

## 6. Tentativa de Acesso sem Login

Ao tentar acessar diretamente:

```text
/dashboard
/tasks
/settings
/pomodoro
```

sem autenticação:

Resultado esperado:

```text
Redirecionamento automático para Login.
```

---

# Segurança Implementada

* Senhas protegidas com bcrypt.
* Autenticação via JWT.
* Middleware de proteção de rotas.
* Controle de acesso por usuário.
* Tokens temporários para redefinição de senha.
* Validação de entrada nos formulários.
* Proteção contra acesso não autorizado aos recursos.

---

# Considerações Finais

O projeto atende aos requisitos da atividade ao integrar frontend e backend com autenticação real, gerenciamento seguro de usuários, proteção de recursos, recuperação de senha e controle de sessão, proporcionando uma experiência segura e funcional em ambiente de desenvolvimento.
