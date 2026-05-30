// Objeto Literal
// const menu = {
//   selector: '.principal',
// };
// como acessar a propriedade ou um objeto é através de um ponto "."
// console.log(menu.selector.toUpperCase());

// Função tradicional
// function upperName(name) {
//   return name.toUpperCase();
// }
// console.log(upperName('andre'));

// Arrow Function
// const lowerName = (name) => {
//   return name.toLowerCase();
// };
// console.log(lowerName('ANDRE'));

// const countLetters = (word) => word.length;
// console.log(countLetters('Marcelo'));

// Destructuring
// function handleMouseMove(event) {
//   const clientX = event.clientX;
//   const clientY = event.clientY;
//   console.log(clientX, clientY);
// }

// function handleMouseMove(event) {
//   const { clientX, clientY } = event;
//   console.log(clientX, clientY);
// }

// Podemos desestruturar o parâmetro
// function handleMouseMove({ clientX, clientY }) {
//   console.log(clientX, clientY);
// }

// document.addEventListener('click', handleMouseMove);
// document.addEventListener('mousemove', handleMouseMove);

// const frutas = ['Banana', 'Uva'];
// const [fruta1, fruta2] = frutas;
// console.log(fruta2);

// const useQuadrado = [
//   4,
//   function (lado) {
//     return 4 * lado;
//   },
// ];

//const [lados, area] = useQuadrado;
// console.log(lados, area(5));

// Rest e Spread
// Rest
// function showList(empresa, clientes) {
//   clientes.forEach((cliente) => {
//     console.log(cliente, empresa);
//   });
// }
//showList('Microsoft', ['Marcelo', 'Marcos', 'João']);
//showList('Microsoft', 'Marcelo', 'Marcos', 'João', 'Paulo');

//Spread
// Arrays
// const maior = Math.max(10, 15, 30, 9, 18);
// const numeros = [10, 15, 30, 9, 18];
// const maior = Math.max(...numeros);
//console.log(maior);

// const numeros2 = [22, numeros, 24, 35, 61];
//console.log(numeros2);

//Objetos
// const carro = {
//   cor: 'Azul',
//   portas: 4,
//   ano: 2020,
// };
//carroAno = { ...carro, ano: 2009 };
//console.log(carro);

// script.js
// import { areaQuadrado, perimetroQuadrado } from './quadrado.js';
// console.log(areaQuadrado(5));

// import numeroAleatorio from './numeroAleatorio.js';
// console.log(numeroAleatorio());

// Fetch
// o fetch é uma promessa
// fetch('https://ranekapi.origamid.dev/json/api/produto')
//   .then((response) => response.json())
//   .then((json) => {
//     console.log(json);
//   });

// função assincrona
// async function fetchProdutos(url) {
//   const response = await fetch(url);
// retorna um objeto de resposta
//   console.log(response);
//   const json = await response.json();
//   console.log(json);
//   return response;
// }

// const produtos = fetchProdutos(
//   'https://ranekapi.origamid.dev/json/api/produto',
// );
// console.log(produtos);

//Arrays (Map e Filter)
// const precos = [
//   'Crédito',
//   'R$ 200',
//   'R$ 400',
//   'Contas Pagar',
//   'R$ 300',
//   'R$ 400',
//   'Meus dados',
// ];

// Retorna uma array nova, que contem os items em que o retorno da função for verdadeiro
// const precosFiltro = precos.filter(function (preco) {
//   console.log(preco);
// });

// Se eu quiser que só retorne os que tiver Cifrão R$?
// const precosFiltro = precos.filter((preco) => preco.includes('R$'));
// console.log(precosFiltro);

// Se eu quiser pegar e transformar o array só em numeros?
// Retorna uma nova array, modificada com o retorno de cada item da função
// const precoNumeros = precosFiltro.map((preco) =>
//   Number(preco.replace('R$ ', '')),
// );
// console.log(precoNumeros);

//Expressões
// const grupoA = 100;
// const grupoB = 300;
// const vencedor = grupoA > grupoB ? 'Grupo A Venceu' : 'Grupo B Venceu';
// console.log(vencedor);

// const numeros = [2, 3, 4, 5, 6];
// const total = numeros.filter((numero) => numero > 4);
// console.log(total);

// const active = true;
// const button = active && 'Botão está ativo';
