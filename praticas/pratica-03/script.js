function carregarProdutos() {
  const produtos = [
    { nome: "iPhone 15", preco: 7000 },
    { nome: "Galaxy S23", preco: 5000 },
    { nome: "Xiaomi 13", preco: 3000 }
  ];

  const container = document.getElementById("produtos");
  container.innerHTML = "";

  produtos.forEach(produto => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <h3>${produto.nome}</h3>
      <p>R$ ${produto.preco}</p>
    `;

    container.appendChild(card);
  });
}