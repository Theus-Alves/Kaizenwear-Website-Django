function loadContent(cartItems, totalCart, CurrentCart) {
    const productTemplate = document.querySelector('#product-template');
    const restantCart2 = document.querySelector('.restant-cart-2');
    const restantCart = document.querySelector('.restant-cart');
    const containerCart = document.querySelector('.container-cart')
    const ContentTotal = document.querySelector('.total')


    // Limpar o conteúdo existente da barra lateral do carrinho
    productTemplate.innerHTML = '';
    restantCart2.style.display = 'none';
    restantCart.style.display = 'block';
    containerCart.style.display = 'block';
    ContentTotal.style.display = 'block';



    if (cartItems) {
        cartItems.forEach((product) => {
            const newProductDiv = document.createElement('div');
            newProductDiv.classList.add('product');
            newProductDiv.innerHTML = `
            <div class="pre-content">
                <h5>${product.name}</h5>
            </div>
            <div class="side-by-side">
                <div class="content">
                    <img src="${product.image_front}" alt="${product.name}">
                </div>
            </div>
            <div class="side-by-side">
                <div class="content">
                    <p style="color: #979797;">${product.size}</p>
                    <p style="color: black;">R$ ${(product.price * product.qtd).toFixed(2).replace('.', ',')}</p>
                    <div class="number-input-container">
                        <button class="control-button" onclick="decrement(this)" data-productid="${product.id}">-</button>
                        <input type="number" class="number-input input-cart" value="${product.qtd}" disabled>
                        <button class="control-button" onclick="increment(event, this)" data-productid="${product.id}">+</button>
                    </div>
                    <a onclick="remove(event, this)" data-productid="${product.id}" id="btn-remover" href="#">REMOVER</a> 
                </div>
            </div>
        `;

            // Crie o elemento <hr> após a div do produto
            const hrElement = document.createElement('hr');
            hrElement.classList.add('hr-product');

            productTemplate.appendChild(newProductDiv);
            productTemplate.appendChild(hrElement);
            ContentTotal.innerHTML = `
        <div class="total">
            <h5>Total</h5>
            <p"><strong>R$ ${(totalCart).toFixed(2).replace('.', ',')}</strong></p>
            <br><br>
        </div>
        `;


            const contador = document.querySelector('.contador-cart');
            contador.innerHTML = CurrentCart;
            const contadorCart = 'contadorCart';

            localStorage.setItem(contadorCart, CurrentCart);

        });
    } else {
        productTemplate.innerHTML = '';
        restantCart2.style.display = 'block';
        restantCart.style.display = 'none';
        containerCart.style.display = 'none';
        ContentTotal.style.display = 'none';

        const contador = document.querySelector('.contador-cart');
        contador.innerHTML = 0;
    }

}


// Função para atualizar o carrinho via AJAX
function updateCart(cartItems) {
    fetch('/add_cart/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(cartItems)
    })
        .then(response => response.json())
        .then(data => {

            const cartItems = data.Cart;
            // Suponha que 'data' seja a resposta JSON que você recebeu
            const totalCart = data.Total;
            const numberCart = data.numberCart;


            loadContent(cartItems, totalCart, numberCart)
        })
        .catch(error => {
            console.error('Erro ao enviar solicitação:', error);
        });
}
