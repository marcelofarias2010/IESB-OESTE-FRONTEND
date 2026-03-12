let pontoEndereco;
const header = document.querySelector('.header');
const navDescktop = document.querySelector('.categorias');

// Lógica para definir o caminho relativo de imagens/recursos
if (window.location.pathname.split('/').pop() === 'index.html') {
    pontoEndereco = '.';
} else {
    pontoEndereco = '..';
}

header.innerHTML = `
    <nav class="nav contaier">
        <div class="nav__data">

            <a href="#"><img src="${pontoEndereco}/images/logo.png" alt="Logo Solução Balanças"></a>

            <div class="div__barra__pesquisa">
                <input type="search" class="input__barra__pesquisa">
                <button class="button__barra__pesquisa"><i class="ri-search-line"></i></button>
            </div>

            <div class="nav__toggle" id="nav-toggle">
                <p class="nav__catalogo">Catalogo</p>
                <i class="ri-menu-line nav__burger"></i>
                <i class="ri-close-line nav__close"></i>
            </div>

            <div class="nav__link__descktop">
                <ul>
                    <li><a href="#">Assistência</a></li>
                    <li><a href="#">Contato</a></li>
                    <li><a href="#">Sobre Nós</a></li>
                </ul>
            </div>
        </div>

        <div class="nav__menu" id="nav-menu">
            <ul class="nav__list">
                <ul class="contaier__nav__cliente">
                    <li><a href="#" class="nav__cliente">Assistência</a></li>
                    <li><a href="#" class="nav__cliente">Contato</a></li>
                    <li><a href="#" class="nav__cliente">Sobre Nós</a></li>
                </ul>

                <li class="dropdown__item">
                    <div class="nav__link">
                        <a href="#">Açougue</a> <i class="ri-arrow-down-s-line dropdown__arrow"></i>
                    </div>
                    <ul class="dropdown__menu">
                        <li class="dropdown__subitem"><a href="#" class="dropdown__link">Amaciadores de Bife</a></li>
                        <li class="dropdown__subitem"><a href="#" class="dropdown__link">Facas</a></li>
                        <li class="dropdown__subitem"><a href="#" class="dropdown__link">Ganchos</a></li>
                        <li class="dropdown__subitem"><a href="#" class="dropdown__link">Máquinas de Serrar Ossos</a></li>
                        <li class="dropdown__subitem"><a href="#" class="dropdown__link">Picadores de Carne</a></li>
                        <li class="dropdown__subitem"><a href="#" class="dropdown__link">Placas Ped</a></li>
                        <li class="dropdown__subitem"><a href="#" class="dropdown__link">Serras Fita</a></li>
                    </ul>
                </li>

                <li class="dropdown__item">
                    <div class="nav__link">
                        <a href="#">Automação</a> <i class="ri-arrow-down-s-line dropdown__arrow"></i>
                    </div>
                    <ul class="dropdown__menu">
                        <li class="dropdown__subitem"><a href="#" class="dropdown__link">Balcões</a></li>
                        <li class="dropdown__subitem"><a href="#" class="dropdown__link">Checkout</a></li>
                        <li class="dropdown__subitem"><a href="#" class="dropdown__link">Gaveteiros</a></li>
                        <li class="dropdown__subitem"><a href="#" class="dropdown__link">Gôndolas</a></li>
                        <li class="dropdown__subitem"><a href="#" class="dropdown__link">PDV</a></li>
                        <li class="dropdown__subitem"><a href="#" class="dropdown__link">Ribbon</a></li>
                    </ul>
                </li>

                <li class="dropdown__item">
                    <div class="nav__link">
                        <a href="#">Balanças</a>
                    </div>
                </li>

                <li class="dropdown__item">
                    <div class="nav__link">
                        <a href="#">Diversos</a> <i class="ri-arrow-down-s-line dropdown__arrow"></i>
                    </div>
                    <ul class="dropdown__menu">
                        <li class="dropdown__subitem"><a href="#" class="dropdown__link">Caixas Plásticas</a></li>
                        <li class="dropdown__subitem"><a href="#" class="dropdown__link">Climatizadores</a></li>
                        <li class="dropdown__subitem"><a href="#" class="dropdown__link">Exaustores</a></li>
                        <li class="dropdown__subitem"><a href="#" class="dropdown__link">Mesas</a></li>
                        <li class="dropdown__subitem"><a href="#" class="dropdown__link">Seladoras</a></li>
                        <li class="dropdown__subitem"><a href="#" class="dropdown__link">Ventiladores</a></li>
                    </ul>
                </li>

                <li class="dropdown__item">
                    <div class="nav__link">
                        <a href="#">Etiquetas</a>
                    </div>
                </li>

                <li class="dropdown__item">
                    <div class="nav__link">
                        <a href="#">Gastronomia</a> <i class="ri-arrow-down-s-line dropdown__arrow"></i>
                    </div>
                    <ul class="dropdown__menu">
                        <li class="dropdown__subitem"><a href="#" class="dropdown__link">Chapas</a></li>
                        <li class="dropdown__subitem"><a href="#" class="dropdown__link">Cortadores de Frios</a></li>
                        <li class="dropdown__subitem"><a href="#" class="dropdown__link">Fogões</a></li>
                        <li class="dropdown__subitem"><a href="#" class="dropdown__link">Fornos</a></li>
                        <li class="dropdown__subitem"><a href="#" class="dropdown__link">Fritadeiras</a></li>
                        <li class="dropdown__subitem"><a href="#" class="dropdown__link">Liquidificadores</a></li>
                        <li class="dropdown__subitem"><a href="#" class="dropdown__link">Mesas Aquecidas</a></li>
                        <li class="dropdown__subitem"><a href="#" class="dropdown__link">Misturadores</a></li>
                        <li class="dropdown__subitem"><a href="#" class="dropdown__link">Panelas</a></li>
                        <li class="dropdown__subitem"><a href="#" class="dropdown__link">Pipoqueiras</a></li>
                    </ul>
                </li>

                <li class="dropdown__item">
                    <div class="nav__link">
                        <a href="#">Panificação</a>
                    </div>
                </li>

                <li class="dropdown__item">
                    <div class="nav__link">
                        <a href="#">Promoções</a>
                    </div>
                </li>

                <li class="dropdown__item">
                    <div class="nav__link">
                        <a href="#">Refrigeração</a> <i class="ri-arrow-down-s-line dropdown__arrow"></i>
                    </div>
                    <ul class="dropdown__menu">
                        <li class="dropdown__subitem"><a href="#" class="dropdown__link">Auto Serviço</a></li>
                        <li class="dropdown__subitem"><a href="#" class="dropdown__link">Cervejeiras</a></li>
                        <li class="dropdown__subitem"><a href="#" class="dropdown__link">Freezers</a></li>
                        <li class="dropdown__subitem"><a href="#" class="dropdown__link">Frigobar</a></li>
                        <li class="dropdown__subitem"><a href="#" class="dropdown__link">Ilhas</a></li>
                        <li class="dropdown__subitem"><a href="#" class="dropdown__link">Visa Cooler</a></li>
                    </ul>
                </li>
            </ul>
        </div>
    </nav>
`;

navDescktop.innerHTML = `
        <ul>
            <li><a href="#">Açougue</a>
                <ul class="submenu">
                    <li><a href="#">AMACIADORES DE BIFE</a></li>
                    <li><a href="#">FACAS</a></li>
                    <li><a href="#">GANCHOS</a></li>
                    <li><a href="#">MAQUINAS DE SERRAR OSSOS</a></li>
                    <li><a href="#">PICADORES DE CARNES</a></li>
                    <li><a href="#">PLACAS PED</a></li>
                    <li><a href="#">SERRAS FITA</a></li>
                </ul>
            </li>
            <li><a href="#">Automação</a>
                <ul class="submenu">
                    <li><a href="#">Balcões</a></li>
                    <li><a href="#">CHECKOUT</a></li>
                    <li><a href="#">GAVETEIROS</a></li>
                    <li><a href="#">GÔNDOLAS</a></li>
                    <li><a href="#">PDV</a></li>
                    <li><a href="#">RIBBON</a></li>
                </ul>
            </li>
            <li><a href="#">Balanças</a></li>
            <li><a href="#">Diversos</a>
                <ul class="submenu">
                    <li><a href="#">CAIXAS PLÁSTICAS</a></li>
                    <li><a href="#">Climatizadores</a></li>
                    <li><a href="#">EXAUSTORES</a></li>
                    <li><a href="#">MESAS</a></li>
                    <li><a href="#">Seladoras</a></li>
                    <li><a href="#">VENTILADORES</a></li>
                </ul>
            </li>
            <li><a href="#">Etiquetas</a></li>
            <li><a href="#">Gastronomia</a>
                <ul class="submenu">
                    <li><a href="#">Chapas</a></li>
                    <li><a href="#">Cortadores de Frios</a></li>
                    <li><a href="#">Fogões</a></li>
                    <li><a href="#">Fornos</a></li>
                    <li><a href="#">Fritadeiras</a></li>
                    <li><a href="#">Liquidificadores</a></li>
                    <li><a href="#">Mesas Aquecidas</a></li>
                    <li><a href="#">Misturadores</a></li>
                    <li><a href="#">Panelas</a></li>
                    <li><a href="#">Pipoqueiras</a></li>
                </ul>
            </li>
            <li><a href="#">Panificação</a></li>
            <li><a href="#">Promoções</a></li>
            <li><a href="#">Refrigeração</a>
                <ul class="submenu">
                    <li><a href="#">Auto Serviço</a></li>
                    <li><a href="#">Cervejeiras</a></li>
                    <li><a href="#">Freezers</a></li>
                    <li><a href="#">Frigobar</a></li>
                    <li><a href="#">Ilhas</a></li>
                    <li><a href="#">Visa Cooler</a></li>
                    <li><a href="#">Vitrine Refrigerada</a></li>
                </ul>
            </li>
        </ul>
`;

const btnWpp = document.getElementById('btn-wpp');
if (btnWpp) {
    btnWpp.innerHTML = `
        <a href="#" target="_blank" class="btn-wpp">
            <img src="${pontoEndereco}/images/whatsapp.png" alt="WhatsApp">
        </a>
    `;
}

const footer = document.querySelector('footer');
if (footer) {
    footer.innerHTML = `
        <div class="container-footer">

            <ul class="lista__footer">
                <li class="titulo__footer">NAVEGAÇÃO</li>
                <li><a href="#">Home</a></li>
                <li><a href="#">Assistência</a></li>
                <li><a href="#">Contato</a></li>
                <li><a href="#">Sobre Nós</a></li>
            </ul>

            <ul class="lista__footer">
                <li class="titulo__footer">Nos Acompanhe</li>
                <ul class="follow-us__footer">
                    <li>
                        <a href="https://www.facebook.com/people/Jair-Fernandes/pfbid02Msq4feswoT5ftTsoEMik5bnLqingLhpaSBS4iWsHdeZ7H6BdahisVgA9eRMj5eiMl/" target="_blank">
                            <i class="ri-facebook-circle-fill"></i>
                        </a>
                    </li>
                    <li>
                        <a href="https://wa.me/556192284400?text=Vim%20pelo%20site%20e%20tenho%20interesse%20nos%20seus%20servi%C3%A7os!" target="_blank"><i class="ri-whatsapp-line"></i></a>
                    </li>
                    <li><a href="https://www.instagram.com/solucaobalancasdf/" target="_blank"><i class="ri-instagram-line"></i></a>
                    </li>
                    <li>
                        <a href="mailto:sos_balancas@outlook.com" target="_blank">
                            <i class="ri-mail-line"></i>
                        </a>
                    </li>
                </ul>
            </ul>

            <ul class="lista__footer">
                <li class="titulo__footer">Fale Conosco</li>
                <li><a href="#">Solução Balanças</a></li>
                <li><a href="https://www.google.com/maps/place/Solução+Balanças/@-15.8280153,-48.1231515,15z/data=!4m6!3m5!1s0x935bcd0e30f8e2b7:0x6066e08f06b552f3!8m2!3d-15.8280153!4d-48.1231515!16s%2Fg%2F11tfkljbvh?entry=ttu&g_ep=EgoyMDI0MDkyNS4wIKXMDSoASAFQAw%3D%3D" target="_blank">SHSN CHÁCARA 11 LOTE 02 LOJA 01, <br>Ceilândia Sul - Ceilândia, Brasília - DF, <br>72236-800</a>
                </li>
                <li><a href="mailto:sos_balancas@outlook.com" target="_blank"><i class="ri-mail-line"></i> sos_balancas@outlook.com</a>
                </li>
                <li><a href="tel:556192284400" target="_blank"><i class="ri-phone-fill"></i> (61) 99228-4400</a></li>
                <li><p>CNPJ: 37313286000175</p></li>
            </ul>

        </div>

        <div class="copyright">
            <p>© 2024 Solução Balanças.<br> Todos os direitos reservados à <a href="https://www.linkedin.com/in/guilhermefrancafernandes/" target="_blank">FranTech</a>.</p>
        </div>
    `;
}

// --- Funções de comportamento (Menu Mobile e Dropdowns) ---

const showMenu = (toggleId, navId) => {
    const toggle = document.getElementById(toggleId),
        nav = document.getElementById(navId);

    if (toggle && nav) {
        toggle.addEventListener('click', () => {
            nav.classList.toggle('show-menu');
            toggle.classList.toggle('show-icon');
        });

        window.addEventListener('beforeunload', () => {
            nav.classList.remove('show-menu');
            toggle.classList.remove('show-icon');
        });
    }
};

showMenu('nav-toggle', 'nav-menu');

document.addEventListener('DOMContentLoaded', () => {
    const toggleDropdown = (dropdown) => {
        const dropdownMenu = dropdown.querySelector('.dropdown__menu');
        const arrow = dropdown.querySelector('.dropdown__arrow');
        if (dropdownMenu.style.maxHeight) {
            dropdownMenu.style.maxHeight = null;
            arrow.style.transform = 'rotate(0deg)';
        } else {
            dropdownMenu.style.maxHeight = dropdownMenu.scrollHeight + "px";
            arrow.style.transform = 'rotate(180deg)';
        }
    };

    const dropdowns = document.querySelectorAll('.dropdown__item');
    dropdowns.forEach((dropdown) => {
        const dropdownArrow = dropdown.querySelector('.dropdown__arrow');
        if (dropdownArrow) {
            dropdownArrow.addEventListener('click', (event) => {
                event.stopPropagation();
                toggleDropdown(dropdown);
            });
        }
    });
});