const mainCarrosel = document.querySelector('.carrossel');

mainCarrosel.innerHTML = `
            <!-- Div criada para ajudar a posicionar na tela de 1728px -->
            <div class="carrossel__container">
                <!-- Slider main container -->
                <div class="swiper">

                    <!-- Additional required wrapper -->
                    <div class="swiper-wrapper">
                        <!-- Slides -->
                        <div class="swiper-slide"><a href="${pontoEndereco}/pages_categorias/promocoes.html"><img
                                    src="${pontoEndereco}/images_banners/banner_ofertas.png" alt=""></a>
                        </div>
                        <div class="swiper-slide"><a href="${pontoEndereco}/pages_navegation/assistencia.html"><img
                                    src="${pontoEndereco}/images_banners/banner_assistencia.png" alt=""></a></div>
                        <div class="swiper-slide"><a href="${pontoEndereco}/pages_categorias/etiquetas.html"><img
                                    src="${pontoEndereco}/images_banners/banner_etiquetas.png" alt=""></a>
                        </div>
                    </div>

                    <!-- Elemento que só aparece em telas de no minimo 1024px-->
                    <div class="swiper-button-prev"></div>
                    <div class="swiper-button-next"></div>

                <!-- If we need pagination -->
                <div class="swiper-pagination"></div>

            </div>
`;


const swiper = new Swiper('.swiper', {
    loop: true,
    spaceBetween: 10,
    slidesPerView: 1,
    autoplay: {
        delay: 4500,
        disableOnInteraction: true,
    },
    pagination: {
        el: '.swiper-pagination',
        type: 'bullets',
    },
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
});
