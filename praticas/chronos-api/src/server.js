const express = require('express');
const cors = require('cors');
const routes = require('./routes');

const app = express();

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());
app.use(routes);

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`✅ Servidor Chronos rodando em http://localhost:${PORT}`);
});
