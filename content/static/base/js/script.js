document.addEventListener('DOMContentLoaded', function () {


    const contador = document.querySelector('.contador-cart');
    const numberCart = localStorage.getItem('contadorCart');

    if (numberCart) {
        contador.innerHTML = numberCart
    } else {
        contador.innerHTML = 0;
    }



});

