const cartSidebar = document.getElementById('cart-sidebar');
const myNavbar = document.querySelector('.mynavbar');
const cartIcon = myNavbar.querySelector('.bag');
const continueButtons = document.querySelectorAll('.btn-continue');
const fecharBar = document.querySelector('.btn-fechar');
const clearCartLink = document.querySelector('#clear-cart');
const inputCart = document.querySelector('.input-cart');



continueButtons.forEach(continueButton => {
    continueButton.addEventListener('click', () => {
        cartSidebar.classList.remove('open');
        document.body.classList.remove('no-scroll');
    });
});

fecharBar.addEventListener('click', () => {
    cartSidebar.classList.remove('open');
    document.body.classList.remove('no-scroll');
});

if (cartIcon) {
    cartIcon.addEventListener('click', () => {
        cartSidebar.classList.toggle('open');
        document.body.classList.toggle('no-scroll');

        var cartItems = localStorage.getItem('cartItems');

        if (cartItems === null) {
            console.log("Erro: 'cartItems' não encontrado no localStorage!");
            const restantCart2 = document.querySelector('.restant-cart-2');
            const restantCart = document.querySelector('.restant-cart');

            restantCart2.style.display = 'block';
            restantCart.style.display = 'none';

        } else {
            updateCart(JSON.parse(cartItems));
        }

    });
}


clearCartLink.addEventListener('click', (event) => {
    event.preventDefault();

    // Remover a chave 'cartItems' do localStorage para limpar o carrinho
    localStorage.removeItem('cartItems');

    const restantCart2 = document.querySelector('.restant-cart-2');
    const restantCart = document.querySelector('.restant-cart');
    const containerCart = document.querySelector('.container-cart');

    let numberCart = localStorage.getItem('contadorCart');
    const contador = document.querySelector('.contador-cart');

    contador.innerHTML = 0;
    numberCart = 0;
    localStorage.setItem('contadorCart', numberCart);


    containerCart.innerHTML = '';
    restantCart2.style.display = 'block';
    restantCart.style.display = 'none';



});


function increment(event, button) {

    event.preventDefault();
    var inputElement = button.parentNode.querySelector(".number-input");
    var currentValue = parseInt(inputElement.value, 10);

    inputElement.value = currentValue + 1;

    const productId = button.getAttribute("data-productid");
    const cartItemsJSON = localStorage.getItem('cartItems');
    const cartItems = cartItemsJSON ? JSON.parse(cartItemsJSON) : [];

    const existingItemIndex = cartItems.findIndex(item => item.id === productId);

    if (existingItemIndex !== -1) {
        // Atualize a quantidade no carrinho
        cartItems[existingItemIndex].qtd = currentValue + 1;
        const updatedCartItemsJSON = JSON.stringify(cartItems);
        localStorage.setItem('cartItems', updatedCartItemsJSON);
        // Atualize a exibição do carrinho após incrementar
        updateCart(cartItems);
    }
}



function decrement(button) {

    var inputElement = button.parentNode.querySelector(".number-input");
    var currentValue = parseInt(inputElement.value, 10);

    if (currentValue > 1) {
        inputElement.value = currentValue - 1;

        const productId = button.getAttribute("data-productid");
        const cartItemsJSON = localStorage.getItem('cartItems');
        const cartItems = cartItemsJSON ? JSON.parse(cartItemsJSON) : [];

        const existingItemIndex = cartItems.findIndex(item => item.id === productId);

        if (existingItemIndex !== -1) {
            // Atualize a quantidade no carrinho
            cartItems[existingItemIndex].qtd = currentValue - 1;
            const updatedCartItemsJSON = JSON.stringify(cartItems);
            localStorage.setItem('cartItems', updatedCartItemsJSON);
            // Atualize a exibição do carrinho após decrementar
            updateCart(cartItems);
        }
    }
}



function remove(event, button) {

    event.preventDefault();

    const productId = button.getAttribute("data-productid");
    const cartItemsJSON = localStorage.getItem('cartItems');
    let cartItems = cartItemsJSON ? JSON.parse(cartItemsJSON) : [];

    const existingItemIndex = cartItems.findIndex(item => item.id === productId);

    if (existingItemIndex !== -1) {
        // Remova o item do carrinho
        cartItems.splice(existingItemIndex, 1);
        const updatedCartItemsJSON = JSON.stringify(cartItems);
        localStorage.setItem('cartItems', updatedCartItemsJSON);

        // Verifique se o carrinho está vazio
        if (cartItems.length === 0) {

            let numberCart = localStorage.getItem('contadorCart');
            numberCart = 0;
            localStorage.setItem('contadorCart', numberCart);


        }
    }

    updateCart(cartItems);
}


