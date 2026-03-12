const listaProdutos = [
    {
        nome: "AMACIADOR DE CARNE INOX ABS-HD",
        cod: "905",
        preco: "R$4.250,00 à vista",
        categoria: "açougue",
        subcategoria: "Amaciadores de Bife",
        maisProcurados: "sim",
        vezes: "",
        promocao: "",
    },
    {
        nome: 'faca inox desossa 6" 5515-06 5500 mundial',
        cod: "443",
        preco: "R$52,00 à vista",
        categoria: "açougue",
        subcategoria: "facas",
        maisProcurados: "sim",
        vezes: "",
        promocao: "",
    },
    {
        nome: "SERRA FITA SKYMSEN SFL-282",
        cod: "30166",
        preco: "R$18.500,00 à vista",
        categoria: "açougue",
        subcategoria: "máquinas de serrar ossos",
        maisProcurados: "sim",
        vezes: "",
        promocao: "",
    },
    {
        nome: "PICADOR DE CARNES GURAL MGI-10",
        cod: "9530",
        preco: "R$3.690,00 à vista",
        categoria: "açougue",
        subcategoria: "picadores de carne",
        maisProcurados: "sim",
        vezes: "",
        promocao: "",
    },
    {
        nome: "BALCAO ATENDIMENTO AMAPA",
        cod: "7226",
        preco: "R$520,00 à vista",
        categoria: "automação",
        subcategoria: "balcoes balcões balcao balcão",
        maisProcurados: "sim",
        vezes: "",
        promocao: "",
    },
    {
        nome: "Check Out Amapa Sem Acabamento",
        cod: "5429",
        preco: "R$2.700,00 à vista",
        categoria: "automação",
        subcategoria: "checkout",
        maisProcurados: "sim",
        vezes: "",
        promocao: "",
    },
    {
        nome: "Impressora Elgin L42PRO",
        cod: "188",
        preco: "R$2.050,00 à vista",
        categoria: "automação",
        subcategoria: "pdv",
        maisProcurados: "sim",
        vezes: "",
        promocao: "",
    },
    {
        nome: "LEITOR CÓDIGO DE BARRAS EL250 ELGIN",
        cod: "6615",
        preco: "R$610,00 à vista",
        categoria: "automação",
        subcategoria: "pdv",
        maisProcurados: "sim",
        vezes: "",
        promocao: "",
    },
    {
        nome: "BALANÇA CHECKOUT 8217 32KG toledo",
        cod: "8284",
        preco: "R$2.350,00 à vista",
        categoria: "balanças balancas",
        subcategoria: "",
        maisProcurados: "sim",
        vezes: "",
        promocao: "",
    },
    {
        nome: "BALANÇA BA37-C URANO",
        cod: "6968",
        preco: "R$7.200,00 à vista",
        categoria: "balanças balancas",
        subcategoria: "",
        maisProcurados: "sim",
        vezes: "",
        promocao: "",
    },
    {
        nome: "Balança US 31/2 POP-S",
        cod: "7090",
        preco: "R$920,00 à vista",
        categoria: "balanças balancas",
        subcategoria: "",
        maisProcurados: "sim",
        vezes: "",
        promocao: "",
    },
    {
        nome: "Balança W-300 Welmy",
        cod: "3313",
        preco: "R$2.450,00 à vista",
        categoria: "balanças balancas",
        subcategoria: "",
        maisProcurados: "sim",
        vezes: "",
        promocao: "",
    },
    {
        nome: "ETIQUETA DE GONDOLA",
        cod: "891",
        preco: "R$35,00 à vista",
        categoria: "etiquetas",
        subcategoria: "",
        maisProcurados: "sim",
        vezes: "",
        promocao: ""
    },
    {
        nome: "ETIQUETA OPEN",
        cod: "897",
        preco: "R$3,50 à vista",
        categoria: "etiquetas",
        subcategoria: "",
        maisProcurados: "sim",
        vezes: "",
        promocao: ""
    },
    {
        nome: "ETIQUETA PERSONALIZADA",
        cod: "000",
        preco: "Faça Orçamento",
        categoria: "etiquetas",
        subcategoria: "",
        maisProcurados: "sim",
        vezes: "",
        promocao: ""
    },
    {
        nome: "ETIQUETA TERMICA",
        cod: "880",
        preco: "Faça Orçamento",
        categoria: "etiquetas",
        subcategoria: "",
        maisProcurados: "sim",
        vezes: "",
        promocao: ""
    },
    {
        nome: "Chapa Venâncio PR 800E Stlyle",
        cod: "10940",
        preco: "R$1.999,00 à vista",
        categoria: "gastronomia",
        subcategoria: "chapas",
        maisProcurados: "sim",
        vezes: "",
        promocao: "",
    },
    {
        nome: "Forno Turbo Digitop Gas 10 Esteira 220v FTDG-10 Venancio",
        cod: "4858",
        preco: "R$11.900,00 à vista",
        categoria: "gastronomia",
        subcategoria: "fornos",
        maisProcurados: "sim",
        vezes: "",
        promocao: ""
    },
    {
        nome: "Fritador Cuba Eletrico Metalcubas Frce-6 2 Cb",
        cod: "3541",
        preco: "R$1.550,00 à vista",
        categoria: "gastronomia",
        subcategoria: "fritadeiras",
        maisProcurados: "sim",
        vezes: "",
        promocao: ""
    },
    {
        nome: "Liquidificador Industrial Skymsem Inox T A-04 MB",
        cod: "3471",
        preco: "R$1.360,00 à vista",
        categoria: "gastronomia",
        subcategoria: "liquidificadores",
        maisProcurados: "sim",
        vezes: "",
        promocao: ""
    },
];



// Função para ordenar a lista alfabeticamente pelo nome
listaProdutos.sort((a, b) => {
    const nomeA = a.nome.toUpperCase(); // Converter para maiúsculas para evitar problemas com case sensitivity
    const nomeB = b.nome.toUpperCase();

    if (nomeA < nomeB) {
        return -1; // "a" vem antes de "b"
    }
    if (nomeA > nomeB) {
        return 1; // "b" vem antes de "a"
    }
    return 0; // Nomes iguais
});

const cardsPorPagina = 20;
let paginaAtual = 1;

function mostrarProdutos(pagina) {
    const secaoCardTitulo = document.querySelector('.secaoCard__titulo').textContent.trim().toLowerCase();
    const estaNaIndexOuMaisProcurados = secaoCardTitulo === 'mais procurados' || window.location.pathname.includes("index");

    let produtosFiltrados;

    if (secaoCardTitulo === 'promoções do mês') {
        // Filtra apenas produtos que estão em promoção
        produtosFiltrados = listaProdutos.filter(produto => produto.promocao.trim() !== '');
    } else if (secaoCardTitulo === 'mais procurados') {
        // Filtra apenas produtos mais vendidos
        produtosFiltrados = listaProdutos.filter(produto => produto.maisProcurados !== '');
    } else {
        // Filtra produtos por categoria ou subcategoria
        produtosFiltrados = listaProdutos.filter(produto =>
            produto.categoria.toLowerCase().includes(secaoCardTitulo) ||
            produto.subcategoria.toLowerCase().includes(secaoCardTitulo)
        );
    }

    const totalProdutos = produtosFiltrados.length;
    const inicio = (pagina - 1) * cardsPorPagina;
    const fim = inicio + cardsPorPagina;
    const produtosParaMostrar = produtosFiltrados.slice(inicio, fim);

    const secaoCard = document.querySelector('.secaoCard__main');
    secaoCard.innerHTML = ''; // Limpa a seção antes de adicionar novos produtos

    // Se não houver produtos, exibir uma mensagem
    if (produtosParaMostrar.length === 0) {
        secaoCard.innerHTML = `<p>Nenhum produto encontrado.</p>`;
        return;
    }

    produtosParaMostrar.forEach(produto => {
        const estaEmPromocao = produto.promocao.trim() !== ''; // Verifica se há promoção
        const precoClasse = estaEmPromocao ? "promotion__color" : ""; // Adiciona classe condicionalmente
        const caminhoBase = estaNaIndexOuMaisProcurados ? "./" : "../"; // Define o caminho correto

        secaoCard.innerHTML += `
            <div class="cardProduto">
                <img src="${caminhoBase}images_produtos/${produto.cod}.png" alt="${produto.nome}" class="cardProduto_img">
                <h1 class="cardProduto_descricao">${produto.nome}</h1>
                <p class="cardProduto_cod">Cod: ${produto.cod}</p>
                <p class="cardProduto_preco ${precoClasse}">
                    ${estaEmPromocao ? `
                        <span class="preco-antigo">${produto.vezes}</span> <br> 
                        <span class="preco-novo">${produto.promocao}</span>
                    ` : `
                        ${produto.preco}
                    `}
                </p>
                <a href="#" class="cardProduto_link">Saiba Mais</a>
            </div>
        `;
    });

    // Atualiza a paginação corretamente
    gerarPaginacao(pagina, totalProdutos);
}


function produtoPromocao() {
    const containerInfo = document.querySelector('.container__infos');
    const codigoElemento = document.querySelector('.p');

    // Verifica se o elemento existe para evitar erro
    if (!codigoElemento) {
        // console.error("Elemento com a classe '.p' não encontrado.");
        return;
    }

    // Obtém o código do produto da página e remove espaços extras
    const codigoPageProduto = codigoElemento.textContent.split(':')[1]?.trim();

    // Verifica se o código foi extraído corretamente
    if (!codigoPageProduto) {
        console.error("Código do produto não encontrado no texto.");
        return;
    }

    // Encontra o produto correspondente
    const produto = listaProdutos.find(p => String(p.cod) === codigoPageProduto);

    // Se encontrou o produto, exibe as informações corretas
    if (produto) {
        if (produto.promocao) { // Se tiver promoção, mostra os preços promocionais
            containerInfo.innerHTML = `
                <h1 class="infos__h1">${produto.nome}</h1>
                <p class="p">Cod. do Produto: ${produto.cod}</p>
                <h2 class="infos__h3 promotion__color">${produto.vezes}</h2>
                <h2 class="infos__h2 promotion__color">${produto.promocao}</h2>
            `;
        } else { // Caso contrário, exibe o preço normal
            containerInfo.innerHTML = `
                <h1 class="infos__h1">${produto.nome}</h1>
                <p class="p">Cod. do Produto: ${produto.cod}</p>
                <h2 class="infos__h2">${produto.preco}</h2>
            `;
        }
    } else {
        console.error("Produto não encontrado na lista.");
    }
}

produtoPromocao();

function moveTela() {
    const device = window.innerWidth;

    // console.log(device);

    if (device == 390) {
        window.scrollTo({ top: 280, behavior: 'smooth' });
    } else if (device == 768) {
        window.scrollTo({ top: 400, behavior: 'smooth' });
    } else if (device == 1024) {
        window.scrollTo({ top: 430, behavior: 'smooth' });
    } else if (device == 1410) {
        window.scrollTo({ top: 520, behavior: 'smooth' });
    } else if (device == 1876) {
        window.scrollTo({ top: 630, behavior: 'smooth' });
    } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

}


// Atualiza a paginação corretamente com base nos produtos filtrados
function gerarPaginacao(pagina, totalProdutos) {
    const totalPaginas = Math.ceil(totalProdutos / cardsPorPagina);
    const secaoPaginacao = document.querySelector('.paginacao');
    secaoPaginacao.innerHTML = '';

    if (totalPaginas <= 1) {
        secaoPaginacao.style.display = 'none';
        return;
    }

    const botaoAnterior = document.createElement('button');
    botaoAnterior.classList.add('btn__pagination');
    botaoAnterior.innerHTML = '<i class="ri-arrow-left-double-line"></i>';
    botaoAnterior.disabled = pagina === 1;
    botaoAnterior.addEventListener('click', () => {
        mostrarProdutos(pagina - 1);
        moveTela();
    });
    secaoPaginacao.appendChild(botaoAnterior);

    for (let i = 1; i <= totalPaginas; i++) {
        const botaoPagina = document.createElement('button');
        botaoPagina.classList.add('btn__pagination');
        botaoPagina.textContent = i;
        if (i === pagina) botaoPagina.classList.add('ativo');
        botaoPagina.addEventListener('click', () => {
            mostrarProdutos(i);
            moveTela();
        });
        secaoPaginacao.appendChild(botaoPagina);
    }

    const botaoProximo = document.createElement('button');
    botaoProximo.classList.add('btn__pagination');
    botaoProximo.innerHTML = '<i class="ri-arrow-right-double-line"></i>';
    botaoProximo.disabled = pagina === totalPaginas;
    botaoProximo.addEventListener('click', () => {
        mostrarProdutos(pagina + 1);
        moveTela();
    });
    secaoPaginacao.appendChild(botaoProximo);

}

// Captura os elementos da barra de pesquisa
const inputPesquisa = document.querySelector('.input__barra__pesquisa');
const botaoPesquisa = document.querySelector('.button__barra__pesquisa');

// Verifica se a página atual é a index
const estaNaIndex = window.location.pathname === '/' || window.location.pathname.endsWith('/index.html') || window.location.pathname.endsWith('/');

// Define o caminho correto para os links de imagens e páginas
const caminhoImagem = estaNaIndex ? "./images_produtos/" : "../images_produtos/";
const caminhoPagina = estaNaIndex ? "./pages_produtos/" : "../pages_produtos/";

// Função para pesquisar produtos na lista
function pesquisarProdutos() {
    const termoPesquisa = inputPesquisa.value.trim().toLowerCase();

    if (termoPesquisa === '') {
        return; // Não faz nada se a pesquisa estiver vazia
    }

    // Salva o termo de pesquisa no localStorage
    localStorage.setItem('termoPesquisa', termoPesquisa);

    // Redireciona para a página de pesquisa
    window.location.href = estaNaIndex ? './pages_navegation/pesquisa.html' : '../pages_navegation/pesquisa.html';
}

// Evento para ativar a pesquisa ao clicar no botão
botaoPesquisa.addEventListener('click', pesquisarProdutos);

// Evento para ativar a pesquisa ao pressionar "Enter" no campo de pesquisa
inputPesquisa.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        pesquisarProdutos();
    }
});

// Se estiver na página de pesquisa, executar a busca automaticamente
if (window.location.pathname.includes('pesquisa.html')) {
    document.addEventListener('DOMContentLoaded', () => {
        const termoPesquisa = localStorage.getItem('termoPesquisa') || '';
        if (termoPesquisa) {
            inputPesquisa.value = termoPesquisa; // Atualiza o campo de pesquisa
            executarPesquisa(termoPesquisa);
        }
    });
}

// Função para carregar os produtos filtrados na página de pesquisa
function executarPesquisa(termoPesquisa) {
    const produtosFiltrados = listaProdutos.filter(produto =>
        produto.nome.toLowerCase().includes(termoPesquisa) ||
        produto.cod.toLowerCase().includes(termoPesquisa) ||
        produto.categoria.toLowerCase().includes(termoPesquisa) ||
        produto.subcategoria.toLowerCase().includes(termoPesquisa)
    );

    const secaoCard = document.querySelector('.secaoCard__main');
    secaoCard.innerHTML = ''; // Limpa os produtos antes de exibir novos resultados

    // Atualiza o título da seção
    document.querySelector('.secaoCard__titulo').textContent = termoPesquisa || 'Pesquisa';

    if (produtosFiltrados.length === 0) {
        secaoCard.innerHTML = `<p>Nenhum produto encontrado.</p>`;
        document.querySelector('.paginacao').innerHTML = '';
        return;
    }

    produtosFiltrados.forEach(produto => {
        const estaEmPromocao = produto.promocao.trim() !== '';
        const precoClasse = estaEmPromocao ? "promotion__color" : "";

        secaoCard.innerHTML += `
            <div class="cardProduto">
                <img src="${caminhoImagem}${produto.cod}.png" alt="${produto.nome}" class="cardProduto_img">
                <h1 class="cardProduto_descricao">${produto.nome}</h1>
                <p class="cardProduto_cod">Cod: ${produto.cod}</p>
                <p class="cardProduto_preco ${precoClasse}">
                    ${estaEmPromocao ? `
                        <span class="preco-antigo">${produto.vezes}</span> <br> 
                        <span class="preco-novo">${produto.promocao}</span>
                    ` : `
                        ${produto.preco}
                    `}
                </p>
                <a href="${caminhoPagina}${produto.cod}.html" class="cardProduto_link">Saiba Mais</a>
            </div>
        `;
    });

    // Remove a paginação, pois a pesquisa exibe todos os resultados de uma vez
    document.querySelector('.paginacao').innerHTML = '';
}


// Evento para ativar a pesquisa ao clicar no botão
botaoPesquisa.addEventListener('click', pesquisarProdutos);

// Evento para ativar a pesquisa ao pressionar "Enter" no campo de pesquisa
inputPesquisa.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        pesquisarProdutos();
    }
});


mostrarProdutos(1);
