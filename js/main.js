const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);

const lenis = new Lenis({
    duration: isMobile ? 0.8 : 1.4,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
    smoothTouch: true,
    touchMultiplier: 1.5,
});

gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

document.addEventListener("DOMContentLoaded", function () {
    gsap.registerPlugin(ScrollTrigger);

    const tl = gsap.timeline({ defaults: { ease: "expo.out" } });


    tl.fromTo('#hero-desc',
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 1.2 },
        '-=1.2'
    );

    tl.fromTo('#hero-ctas',
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 1.2 },
        '-=0.9'
    );

    gsap.to('#bg-blur-1', {
        x: 60, y: -50, scale: 1.12,
        duration: 18,
        repeat: -1, yoyo: true,
        ease: "sine.inOut"
    });
    gsap.to('#bg-blur-2', {
        x: -50, y: 55, scale: 1.15,
        duration: 22,
        repeat: -1, yoyo: true,
        ease: "sine.inOut"
    });

    gsap.to('.diffuser-stick-1', {
        rotate: -3, duration: 4.5,
        repeat: -1, yoyo: true, ease: "sine.inOut"
    });
    gsap.to('.diffuser-stick-2', {
        rotate: 5, duration: 5.5,
        repeat: -1, yoyo: true, ease: "sine.inOut"
    });
    gsap.to('.diffuser-stick-3', {
        rotate: 10, duration: 5,
        repeat: -1, yoyo: true, ease: "sine.inOut"
    });

    const srConfig = {
        origin: 'bottom',
        distance: '24px',
        duration: 1200,
        delay: 0,
        opacity: 0,
        scale: 1,
        easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
        reset: false,
        mobile: true,
        desktop: true,
    };

    ScrollReveal().reveal('.scroll-reveal', {
        ...srConfig,
        interval: 50,
    });

    let cart = [];

    const cartBtn = document.getElementById('cart-btn');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartDrawer = document.getElementById('cart-drawer');
    const closeCart = document.getElementById('close-cart');
    const cartItemsList = document.getElementById('cart-items-list');
    const cartSubtotal = document.getElementById('cart-subtotal');
    const cartCount = document.getElementById('cart-count');
    const goToCheckout = document.getElementById('go-to-checkout');
    const backToItems = document.getElementById('back-to-items');
    const checkoutForm = document.getElementById('checkout-form');
    const cartStepItems = document.getElementById('cart-step-items');
    const cartStepCheckout = document.getElementById('cart-step-checkout');

    const toggleCart = (show) => {
        if (show) {
            cartOverlay.classList.add('open');
            cartDrawer.classList.add('open');
            document.body.classList.add('overflow-hidden');
        } else {
            cartOverlay.classList.remove('open');
            cartDrawer.classList.remove('open');
            document.body.classList.remove('overflow-hidden');
            cartStepItems.classList.remove('hidden');
            cartStepCheckout.classList.add('hidden');
        }
    };

    cartBtn.addEventListener('click', () => toggleCart(true));
    closeCart.addEventListener('click', () => toggleCart(false));
    cartOverlay.addEventListener('click', () => toggleCart(false));

    const renderCart = () => {
        cartItemsList.innerHTML = '';
        let total = 0;
        let totalItems = 0;

        if (cart.length === 0) {
            cartItemsList.innerHTML = '<div class="flex flex-col items-center justify-center h-48 text-black/40"><p class="text-xs uppercase tracking-widest">Carrinho Vazio</p></div>';
            cartSubtotal.innerText = 'R$ 0,00';
            cartCount.innerText = '0';
            cartCount.classList.add('scale-0');
            goToCheckout.disabled = true;
            goToCheckout.classList.add('opacity-50', 'pointer-events-none');
            return;
        }

        goToCheckout.disabled = false;
        goToCheckout.classList.remove('opacity-50', 'pointer-events-none');

        cart.forEach((item, index) => {
            total += item.price * item.qty;
            totalItems += item.qty;

            const itemEl = document.createElement('div');
            itemEl.className = 'flex items-center justify-between border-b border-black/5 pb-4';
            itemEl.innerHTML = `
                <div class="flex-1 pr-4">
                    <h4 class="font-title text-xs font-bold uppercase tracking-wider">${item.name}</h4>
                    <p class="text-[10px] text-black/50 mt-0.5">R$ ${Number.isInteger(item.price) ? item.price : item.price.toFixed(2).replace('.', ',')}</p>
                </div>
                <div class="flex items-center space-x-2">
                    <button class="qty-btn text-[10px] w-6 h-6 border border-black/10 flex items-center justify-center hover:bg-black/5 transition-colors" data-action="decrease" data-index="${index}">-</button>
                    <span class="text-xs font-semibold w-4 text-center">${item.qty}</span>
                    <button class="qty-btn text-[10px] w-6 h-6 border border-black/10 flex items-center justify-center hover:bg-black/5 transition-colors" data-action="increase" data-index="${index}">+</button>
                    <button class="remove-btn text-[10px] text-red-500 pl-2 uppercase tracking-widest hover:text-red-700 transition-colors" data-index="${index}">Remover</button>
                </div>
            `;
            cartItemsList.appendChild(itemEl);
        });

        cartSubtotal.innerText = `R$ ${Number.isInteger(total) ? total : total.toFixed(2).replace('.', ',')}`;
        cartCount.innerText = totalItems;
        cartCount.classList.remove('scale-0');
    };

    cartItemsList.addEventListener('click', (e) => {
        const target = e.target;
        if (target.classList.contains('qty-btn')) {
            const index = parseInt(target.getAttribute('data-index'));
            const action = target.getAttribute('data-action');
            if (action === 'increase') {
                cart[index].qty++;
            } else if (action === 'decrease') {
                if (cart[index].qty > 1) {
                    cart[index].qty--;
                } else {
                    cart.splice(index, 1);
                }
            }
            renderCart();
        } else if (target.classList.contains('remove-btn')) {
            const index = parseInt(target.getAttribute('data-index'));
            cart.splice(index, 1);
            renderCart();
        }
    });

    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
            const id = button.getAttribute('data-id');
            const name = button.getAttribute('data-name');
            const price = parseFloat(button.getAttribute('data-price'));

            const existingItem = cart.find(item => item.id === id);
            if (existingItem) {
                existingItem.qty++;
            } else {
                cart.push({ id, name, price, qty: 1 });
            }

            renderCart();
            toggleCart(true);
        });
    });

    goToCheckout.addEventListener('click', () => {
        cartStepItems.classList.add('hidden');
        cartStepCheckout.classList.remove('hidden');
    });

    backToItems.addEventListener('click', () => {
        cartStepCheckout.classList.add('hidden');
        cartStepItems.classList.remove('hidden');
    });

    const phoneInput = document.getElementById('cust-phone');
    phoneInput.addEventListener('input', (e) => {
        const val = e.target.value.replace(/\D/g, '');
        if (val.length <= 10) {
            e.target.value = val.replace(/^(\d{2})(\d)/, '($1) $2').replace(/(\d{4})(\d)/, '$1-$2').substring(0, 14);
        } else {
            e.target.value = val.replace(/^(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2').substring(0, 15);
        }
    });

    const cepInput = document.getElementById('cust-cep');
    cepInput.addEventListener('input', (e) => {
        const val = e.target.value.replace(/\D/g, '');
        e.target.value = val.replace(/^(\d{5})(\d)/, '$1-$2').substring(0, 9);
    });

    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('cust-name').value;
        const phone = phoneInput.value;
        const cep = cepInput.value;
        const state = document.getElementById('cust-state').value;
        const street = document.getElementById('cust-street').value;
        const number = document.getElementById('cust-number').value;
        const neighborhood = document.getElementById('cust-neighborhood').value;
        const city = document.getElementById('cust-city').value;
        const payment = document.getElementById('cust-payment').value;

        let itemsText = '';
        let total = 0;
        cart.forEach(item => {
            const itemTotal = item.price * item.qty;
            total += itemTotal;
            itemsText += `  - ${item.qty}x *${item.name}* - R$ ${itemTotal.toFixed(2).replace('.', ',')}\n`;
        });

        const totalText = `R$ ${total.toFixed(2).replace('.', ',')}`;
        const paymentIcon = payment === 'Pix' ? 'Pix (transferência instantânea)' : 'Cartão de Crédito';

        const message =
`*Novo Pedido - SELA Fragrâncias*

------------------------------------
*ITENS DO PEDIDO*
------------------------------------
${itemsText}
*TOTAL: ${totalText}*

------------------------------------
*DADOS DE ENTREGA*
------------------------------------
Nome: ${name}
WhatsApp: ${phone}
Endereço: ${street}, No ${number}
Bairro: ${neighborhood}
Cidade: ${city} - ${state.toUpperCase()}
CEP: ${cep}

------------------------------------
*FORMA DE PAGAMENTO*
------------------------------------
${paymentIcon}

Aguardo a confirmação. Obrigado!`;

        const encodedMessage = encodeURIComponent(message);
        const waUrl = `https://wa.me/5581986069657?text=${encodedMessage}`;
        window.open(waUrl, '_blank');
    });



    renderCart();

    // Mobile Carousel Navigation
    const carousel = document.getElementById('products-carousel');
    const prevBtn = document.getElementById('prev-prod');
    const nextBtn = document.getElementById('next-prod');

    if (carousel && prevBtn && nextBtn) {
        const getScrollAmount = () => {
            // Each card is w-full of the carousel container on mobile
            return carousel.offsetWidth;
        };

        prevBtn.addEventListener('click', () => {
            carousel.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
        });

        nextBtn.addEventListener('click', () => {
            carousel.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
        });
    }

    const reviewsTrack = document.getElementById('reviews-track');
    if (reviewsTrack) {
        const originalCards = Array.from(reviewsTrack.children);
        originalCards.forEach(card => {
            const clone = card.cloneNode(true);
            reviewsTrack.appendChild(clone);
        });
    }
});
