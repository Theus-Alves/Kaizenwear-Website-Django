


// Funçao que adiciona o item ao carrinho

const buyBtn = document.querySelector('#btnBuy');

buyBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    event.preventDefault
    console.log('teste')

    // Acessar os dados do produto
    const productId = document.getElementById("btnBuy").getAttribute("data-productid");
    const quantity = parseInt(document.querySelector('#qtd_items').value, 10);
    const sizeSelect = document.querySelector('.form-control');
    const selectedSize = sizeSelect.options[sizeSelect.selectedIndex].text;

    // Criar um objeto com as informações do produto
    const productInfo = {
        id: productId,
        size: selectedSize,
        qtd: quantity
    };

    // Obter o carrinho atual do localStorage ou criar um novo array vazio
    const cartItemsJSON = localStorage.getItem('cartItems');
    const cartItems = cartItemsJSON ? JSON.parse(cartItemsJSON) : [];

    // Verificar se já existe um item com o mesmo ID e tamanho na lista
    const existingItemIndex = cartItems.findIndex(item => item.id === productId && item.size === selectedSize);

    if (existingItemIndex !== -1) {
        // Se já existe, apenas atualize a quantidade
        cartItems[existingItemIndex].qtd += quantity;
    } else {
        // Caso contrário, adicione o novo item
        cartItems.push(productInfo);
    }

    // Converter o carrinho atualizado em uma string JSON
    const updatedCartItemsJSON = JSON.stringify(cartItems);

    // Armazenar o carrinho atualizado de volta no localStorage
    localStorage.setItem('cartItems', updatedCartItemsJSON);

    // Verificar se a barra lateral não possui a classe 'open' antes de adicioná-la
    if (!cartSidebar.classList.contains('open')) {
        cartSidebar.classList.add('open');
        document.body.classList.add('no-scroll');
    }

    // Limpar o formulário (opcional)
    document.getElementById("qtd_items").value = 1;
    document.querySelector(".form-control").value = "P";



    // Chame a função updateCart() para enviar os dados ao Django via AJAX
    updateCart(cartItems);
});


