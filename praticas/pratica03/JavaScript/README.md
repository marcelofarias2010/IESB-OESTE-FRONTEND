# Conceito de Java Script
## Tópicos
- Tudo é objeto
- Arrow Function
- Destructuring
- Rest e Spread
- Module (Export/Import)
- Fetch
- Async / Await
- Arrays (map e filter)
- Expressões
 
### Tudo é Objeto
Um objeto possui propriedades e métodos que podem ser diretos ou herdados (protótipo).

```js
// Objeto Literal
const menu = {
  selector: '.principal',
  active() {
    const menuElement = document.querySelector(this.selector);
    menuElement.classList.add('active');
  },
};

menu.selector; // ".principal";
menu.active(); // adicionar active ao menu
menu.hasOwnProperty('class'); // método herdado
```
### Arrow Function
A principal diferença é o contexto do this. A arrow function não cria o próprio this.

```js
const upperName = function (name) {
  return name.toUpperCase();
};
upperName('André'); // ANDRÉ

const lowerName = (name) => {
  return name.toLowerCase();
};
lowerName('Rafael'); // rafael

const countLetters = (word) => word.length;
countLetters('Rafael'); // 6

```
### Destructuring
É possui desestruturar objetos e arrays.

```js
function handleMouseMove(event) {
  const clientX = event.clientX;
  const clientY = event.clientY;
  console.log(clientX, clientY);
}

// Irá definir uma constante para cada propriedade
// dentro de event, que tiver o mesmo nome que a constante.
function handleMouseMove(event) {
  const { clientX, clientY } = event;
  console.log(clientX, clientY);
}

// Podemos desestruturar o parâmetro
function handleMouseMove({ clientX, clientY }) {
  console.log(clientX, clientY);
}

document.documentElement.addEventListener('mousemove', handleMouseMove);

```
### Arrays
```js
const frutas = ['Banana', 'Uva'];
const [fruta1, fruta2] = frutas;
// fruta1 = banana
// fruta2 = Uva

const useQuadrado = [
  4,
  function (lado) {
    return 4 * lado;
  },
];
const [lados, area] = useQuadrado;

```

### Rest e Spread
Rest
```js
function showList(empresa, ...clients) {
  clients.forEach((client) => {
    console.log(client, empresa);
  });
}

showList('Google', 'André', 'Pedro', 'João');

```
Spread

```js
// Arrays
const numeros = [1, 4, 9, 2, 3, 6, 20];
Math.max(...numeros); // retorna 20

// Transformar ArrayLike and Array
const items = document.querySelectorAll('li');

// items.map() não existe, agora [...items]
// é uma nova array, com cada elemento de items.
[...items].map((item) => (item.innerText = 'Teste'));

// Objetos
const carro = {
  cor: 'azul',
  portas: 4,
  ano: 2020,
};

const cloneCarro = { ...carro };
const carroEsportivo = { turbo: true, ...carro };

```
### Module
Os módulos servem para quebrarmos o código em diferente arquivos, para facilitar a organização e compartilhamento de código comum.
``` js
<!-- Só funciona em servidor, seja local ou online
Não irá funcionar se você abrir o html direto -->
<script type="module" src="./script.js"></script>

```
``` js
// quadrado.js
export function areaQuadrado(l) {
  return l * l;
}

export function perimetroQuadrado(l) {
  return 4 * l;
}

```
``` js
// numeroAleatorio.js
export default function numeroAleatorio() {
  return Math.random();
}

```
``` js
// script.js
import { areaQuadrado, perimetroQuadrado } from './quadrado.js';

areaQuadrado(4);
perimetroQuadrado(5);
numeroAleatorio();

```
### Fetch
Envia requisições assíncronas para o servidor. Serve para acessarmos/escrevermos dados em apis externas.
``` js
fetch('https://ranekapi.origamid.dev/json/api/produto')
  .then((response) => response.json())
  .then((json) => {
    console.log(json);
  });

```
### Async / Await
Fetch retorna uma promisse. É possível criarmos funções assíncronas, que irão esperar a promisse resolver, antes de continuar com o código.
``` js
async function fetchProdutos(url) {
  const response = await fetch(url);
  const json = await response.json();
  return json;
}

fetchProdutos('https://ranekapi.origamid.dev/json/api/produto');

```
### Arrays (Map e Filter)
Métodos para iterarmos entre os valores de arrays.
``` js
const precos = [
  'Crédito',
  'R$ 200',
  'R$ 400',
  'Contas Pagar',
  'R$ 300',
  'R$ 400',
  'Meus dados',
];

// Retorna uma array nova, que contem os items em
// que o retorno da função for verdadeiro
const precosFiltro = precos.filter((preco) => preco.includes('R$'));

// Retorna uma nova array, modificada com o
// retorno de cada item da função
const precoNumeros = precosFiltro.map((preco) =>
  Number(preco.replace('R$ ', '')),
);

```
### Expressões
``` js
const grupoA = 100;
const grupoB = 300;
const vencedor = grupoA > grupoB ? 'Grupo A Venceu' : 'Grupo B Venceu';

const numeros = [2, 3, 4, 5, 6];
const total = numeros.filter((numero) => numero > 4);

const active = true;
const button = active && 'Botão está ativo';

```
JSX
``` js
// JSX
<button onClick={(event) => event.target.classList.add('active')}>
  Button
</button>

```