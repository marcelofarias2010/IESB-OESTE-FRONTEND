Chronos API
Backend do projeto Chronos Pomodoro, construído com Node.js, Express, Prisma e MySQL.

🚀 Como rodar
Pré-requisitos

Node.js v18+
MySQL rodando localmente

Instalação
bash# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente
# Edite o arquivo .env com seus dados do MySQL:
# DATABASE_URL="mysql://root:sua_senha@localhost:3306/chronos_db"

# 3. Criar banco e tabelas
npx prisma migrate dev --name init

# 4. Iniciar servidor
npm run dev
Servidor disponível em: http://localhost:3333

📋 Endpoints
Health
MétodoRotaDescriçãoGET/healthVerifica se a API está no ar
Resposta:
json{ "ok": true }

Settings
MétodoRotaDescriçãoGET/settingsRetorna as configurações atuaisPUT/settingsAtualiza as configurações
GET /settings — Resposta:
json{
  "id": 1,
  "workTime": 25,
  "shortBreakTime": 5,
  "longBreakTime": 15
}
PUT /settings — Body:
json{
  "workTime": 30,
  "shortBreakTime": 10,
  "longBreakTime": 20
}

Tasks
MétodoRotaDescriçãoGET/tasksLista todas as tasks (ordenadas por data)POST/tasksCria uma nova taskPATCH/tasks/:id/completeMarca task como concluídaPATCH/tasks/:id/interruptMarca task como interrompidaDELETE/tasksRemove todas as tasks
POST /tasks — Body:
json{
  "id": "abc123",
  "name": "Estudar React",
  "duration": 25,
  "type": "workTime",
  "startDate": "2024-01-15T10:00:00.000Z"
}

Tipos válidos para type: workTime, shortBreakTime, longBreakTime

PATCH /tasks/:id/complete — Body:
json{
  "completeDate": "2024-01-15T10:25:00.000Z"
}
PATCH /tasks/:id/interrupt — Body:
json{
  "interruptDate": "2024-01-15T10:15:00.000Z"
}
DELETE /tasks — Resposta: 204 No Content

❗ Códigos de erro
CódigoSignificado400Payload inválido (campos faltando ou tipo incorreto)404Task não encontrada500Erro interno do servidor

🗄️ Modelo do banco de dados
prismamodel Settings {
  id             Int @id @default(autoincrement())
  workTime       Int @default(25)
  shortBreakTime Int @default(5)
  longBreakTime  Int @default(15)
}

model Task {
  id            String    @id
  name          String
  duration      Int
  type          String
  startDate     DateTime
  completeDate  DateTime?
  interruptDate DateTime?
  createdAt     DateTime  @default(now())
}

📁 Estrutura do projeto
chronos-api/
├── prisma/
│   └── schema.prisma
├── src/
│   ├── controllers/
│   │   ├── healthController.js
│   │   ├── settingsController.js
│   │   └── taskController.js
│   ├── routes/
│   │   └── index.js
│   ├── prisma.js
│   └── server.js
├── .env
└── package.json