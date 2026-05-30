# 📑 Tópicos

- Tudo é Objeto
- Arrow Function
- Destructuring
- Rest e Spread
- Module (Export/Import)
- Fetch
- Async / Await
- Arrays (Map e Filter)
- Expressões

**Tudo é Objeto**
No JavaScript, quase tudo possui propriedades e métodos (diretos ou herdados via protótipo).

- **Nota:** `null` e `undefined` não são objetos.

```javascript
const menu = {
  selector: ".principal",
  active() {
    const menuElement = document.querySelector(this.selector);
    menuElement.classList.add("active");
  },
};

menu.selector; // ".principal"
menu.active(); // Adiciona a classe ao elemento
```

**Arrow Function**
A principal diferença está no contexto do `this`, já que a arrow function não cria seu próprio contexto.

```javascript
// Function Expression
const upperName = function (name) {
  return name.toUpperCase();
};

// Arrow Function (com bloco)
const lowerName = (name) => {
  return name.toLowerCase();
};

// Arrow Function (retorno direto)
const countLetters = (word) => word.length;
```

**Destructuring**
Permite extrair dados de arrays ou objetos em variáveis distintas de forma simples.

```javascript
// Em Objetos
function handleMouseMove({ clientX, clientY }) {
  console.log(clientX, clientY);
}

// Em Arrays
const frutas = ["Banana", "Uva"];
const [fruta1, fruta2] = frutas;

// Exemplo comum em Hooks (React)
const [lados, area] = [4, (l) => 4 * l];
```

**Rest e Spread**
_Rest_
Utilizado para permitir que uma função receba um número indefinido de argumentos como um array.

```js
function showList(empresa, ...clients) {
  clients.forEach((client) => console.log(client, empresa));
}
```

_Spread_
Espalha os itens de um iterável (como um array ou objeto) em um novo local.

```js
// Clonar e estender objetos
const carro = { cor: "azul", portas: 4 };
const carroEsportivo = { ...carro, turbo: true };

// Máximo de um array
const numeros = [1, 4, 9, 20];
Math.max(...numeros); // 20
```

**Module**
Permite organizar o código em múltiplos arquivos. Requer type="module" no script do HTML.

```js
// quadrado.js
export function areaQuadrado(l) {
  return l * l;
}

// numeroAleatorio.js
export default function numeroAleatorio() {
  return Math.random();
}

// script.js
import { areaQuadrado } from "./quadrado.js";
import numeroAleatorio from "./numeroAleatorio.js";
```

**Fetch**
Utilizado para realizar requisições assíncronas a APIs.

```js
fetch("https://api.exemplo.com/dados")
  .then((response) => response.json())
  .then((json) => console.log(json));
```

**Async / Await**
Uma forma mais limpa de lidar com Promises, fazendo o código parecer síncrono.

```js
async function fetchProdutos(url) {
  const response = await fetch(url);
  const json = await response.json();
  return json;
}
```

**Arrays (Map e Filter)**
Métodos essenciais para manipulação de listas, sempre retornando uma **nova array**.

- **Filter:** Retorna uma array apenas com os itens que passam no teste.
- **Map:** Retorna uma array com os itens transformados.

```js
const precos = ["R$ 200", "R$ 400", "Contas"];

const precosFiltro = precos.filter((p) => p.includes("R$"));
const precoNumeros = precosFiltro.map((p) => Number(p.replace("R$ ", "")));
```

**Expressões**
O uso de operadores ternários e lógicos é muito comum no JSX do React para renderização condicional.

```js
const vencedor = grupoA > grupoB ? "Grupo A" : "Grupo B";
const active = true;
const button = active && "Botão está ativo"; // Curto-circuito
```
