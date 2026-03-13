// Exibe o botão quando o usuário rolar 100px para baixo
window.onscroll = function () {
  const backToTopButton = document.getElementById("backToTop");
  if (document.documentElement.scrollTop > 50) {
    backToTopButton.style.display = "block";
  } else {
    backToTopButton.style.display = "none";
  }
};

// Função para rolar suavemente ao topo
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}