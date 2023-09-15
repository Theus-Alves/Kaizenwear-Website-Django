const btnPay = document.querySelector('#btnPay');


// Recupere o número do conteúdo atual do localStorage, se estiver disponível
var currentContent = localStorage.getItem("currentContent");

if (!currentContent) {
    // Se não houver valor armazenado, defina-o como 1 (ou qualquer valor inicial desejado)
    currentContent = 1;
} else {
    // Converta o valor do localStorage para um número
    currentContent = parseInt(currentContent);
}

loadPag();


function updateProgressBar() {
    const progressBar = document.querySelector(".progress-bar");
    const progressSteps = document.querySelectorAll(".progress-step");

    const percentage = (currentContent - 1) * 50; // 1 => 0%, 2 => 50%, 3 => 100%
    progressBar.style.width = percentage + "%";

    for (let i = 0; i < progressSteps.length; i++) {
        if (i < currentContent) {
            progressSteps[i].classList.add("progress-done");
        } else {
            progressSteps[i].classList.remove("progress-done");
        }
    }
    localStorage.setItem("currentContent", currentContent);
}

function nextContent(contentNumber) {
    hideAllContents();

    if (contentNumber === 3) {
        btnPay.disabled = false;
    } else {
        btnPay.disabled = true;
    }

    currentContent = contentNumber;
    if (currentContent > 3) {
        currentContent = 1;
    }

    showContent(currentContent);
    updateProgressBar();
}

function loadContentCheck(contentNumber) {

    btnPay.disabled = true;

    hideAllContents();
    showContent(contentNumber);
    currentContent = contentNumber;
    updateProgressBar();
}

function hideAllContents() {
    const contents = document.getElementsByClassName("content");
    for (let i = 0; i < contents.length; i++) {
        contents[i].style.display = "none";
    }

}

function showContent(contentNumber) {
    const targetContent = document.getElementById(`content${contentNumber}`);
    targetContent.style.display = "block";

}

// Função para atualizar o carrinho via AJAX
function updateCheckout(cartItems) {
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

            loadContentCheckout(cartItems, totalCart);
        })
        .catch(error => {
            console.error('Erro ao enviar solicitação:', error);
        });
}

function loadContentCheckout(cartItems, totalCart) {
    const ListCheckout = document.querySelector('.check-list');
    // Limpa o conteúdo existente na lista antes de adicionar novos itens
    ListCheckout.innerHTML = '';

    cartItems.forEach((product) => {
        const newList = document.createElement('li');
        newList.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        newList.innerHTML = `
            <div class="content-side">
                <img src="${product.image_front}" alt="teste">
                <div class="info-product">
                    <p>${product.name}</p>
                    <div class="info">
                        <span>${product.size}</span>
                        <span>R$ ${(product.price * product.qtd).toFixed(2).replace('.', ',')}</span>
                    </div>
                </div>
                <span style="height: 1.35rem; color: #fff; background-color: #3b3c3b; margin-top: 1rem;"
                    class="badge badge-primary badge-pill">${product.qtd}un.</span>
            </div>
        `;

        ListCheckout.appendChild(newList);
    });

    const subtotal = document.querySelector('.subtotal');
    const total = document.querySelector('.total');
    subtotal.innerHTML = `R$ ${(totalCart).toFixed(2).replace('.', ',')}`;
    total.innerHTML = `<strong>R$ ${(totalCart).toFixed(2).replace('.', ',')}</strong>`;
}

// Função para carregar a página
function loadPag() {
    // Recuperando o valor de 'cartItems' do localStorage
    var cartItems = localStorage.getItem('cartItems');

    if (cartItems === null) {
        console.log("Erro: 'cartItems' não encontrado no localStorage!");
    } else {
        updateCheckout(JSON.parse(cartItems));
    }
}

loadPag(); // Chama a função para carregar a página

const btnFinal = document.querySelector('#btn-final');

btnFinal.addEventListener('click', () => {
    const infoPessoal = document.querySelector('.info-personal');
    const infoAddress = document.querySelector('.info-address');
    const formPessoal = document.querySelector('.form-personal');
    const formAddress = document.querySelector('.form-address');


    const nome_client = formPessoal.first_name.value;
    const sobrenome_client = formPessoal.last_name.value;
    const email_client = formPessoal.email.value;
    const cpfCnpj_client = formPessoal.cpf.value;
    const telefone_client = formPessoal.phone_number.value;

    infoPessoal.innerHTML = `
    <ul class="list-group list-group-flush">
        <li class="list-group-item mylist">
            <span class="title-check">E-mail</span>
            <span class="value-check">${email_client}</span>
        </li>
        <li class="list-group-item mylist" >
            <span class="title-check">Nome</span>
            <span class="value-check">${nome_client}</span>
        </li>
        <li class="list-group-item mylist">
            <span class="title-check">Sobrenome</span>
            <span class="value-check">${sobrenome_client}</span>
        </li>
        <li class="list-group-item mylist">
            <span class="title-check">CPF/CNPJ</span>
            <span class="value-check">${cpfCnpj_client}</span>
        </li>
        <li class="list-group-item mylist">
            <span class="title-check">Telefone</span>
            <span class="value-check">${telefone_client}</span>
        </li>
    </ul>
`;

    const cep_adsress = formAddress.cep.value;
    const street_address = formAddress.street.value;
    const number_address = formAddress.number.value;
    const district_address = formAddress.district.value;
    const complement_address = formAddress.complement.value;
    const city_address = formAddress.city.value;
    const state_address = formAddress.state.value;
    const country_address = formAddress.country.value;


    infoAddress.innerHTML = `
    <ul class="list-group list-group-flush listCheck">
        <li class="list-group-item mylist">
            <span class="title-check">CEP</span>
            <span class="value-check">${cep_adsress}</span>
        </li>
        <li class="list-group-item mylist">
        <span class="title-check">Rua</span>
            <span class="value-check">${street_address}</span>
        </li>
        <li class="list-group-item mylist">
            <span class="title-check">Numero</span>
            <span class="value-check">${number_address}</span>
        </li>
        <li class="list-group-item mylist">
            <span class="title-check">Bairro</span>
            <span class="value-check">${district_address}</span>
        </li>
        <li class="list-group-item mylist">
            <span class="title-check">Complemento</span>
            <span class="value-check">${complement_address}</span>
        </li>
        <li class="list-group-item mylist">
            <span class="title-check">Cidade</span>
            <span class="value-check">${city_address}</span>
        </li>
        <li class="list-group-item mylist">
            <span class="title-check">Estado</span>
            <span class="value-check">${state_address}</span>
        </li>
        <li class="list-group-item mylist">
            <span class="title-check">País</span>
            <span class="value-check">${country_address}</span>
        </li>
    </ul>
`;


});


function togoOrder() {
    const btnPayForm = document.querySelector('#btnPayForm');
    btnPayForm.submit();
}



btnPay.addEventListener('click', (event) => {
    event.preventDefault();

    // Obtenha o carrinho atualizado do localStorage
    var cartItems = localStorage.getItem('cartItems');


    if (cartItems) {
        var cartItemsObj = JSON.parse(cartItems);

        fetch('/add_cart/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-By': 'btnPay' // Adicione um cabeçalho personalizado
            },
            body: JSON.stringify(cartItemsObj)
        })
            .then(response => response.json())
            .then(data => {
                // Verifique o valor de orderPlaced no objeto data
                if (data.orderPlaced === true) {
                    console.log('Ordem colocada com sucesso.');

                    localStorage.removeItem('cartItems');
                    localStorage.removeItem('contadorCart');


                    togoOrder();
                    sendDataToDjango();


                } else {

                    console.log('mandar email')
                    var url = "/send_email";

                    fetch(url, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json'
                            // Adicione quaisquer outros cabeçalhos necessários aqui
                        }
                    })
                        .then(response => {
                            localStorage.removeItem('cartItems');
                            localStorage.removeItem('contadorCart');
                            togoOrder();

                        })
                        .catch(error => {
                            console.error("Erro na solicitação GET:", error);
                        });
                }

            });

    }

});


function sendDataToDjango() {
    const form1 = document.querySelector('#myform1');
    const form2 = document.querySelector('#myform2');

    // Capture os valores dos campos do formulário 1
    const email = form1.querySelector("[name='email']").value;
    const firstName = form1.querySelector("[name='first_name']").value;
    const lastName = form1.querySelector("[name='last_name']").value;
    const cpf = form1.querySelector("[name='cpf']").value;
    const phone = form1.querySelector("[name='phone_number']").value;

    // Capture os valores dos campos do formulário 2
    const cep = form2.querySelector("[name='cep']").value;
    const street = form2.querySelector("[name='street']").value;
    const number = form2.querySelector("[name='number']").value;
    const district = form2.querySelector("[name='district']").value;
    const complement = form2.querySelector("[name='complement']").value;
    const city = form2.querySelector("[name='city']").value;
    const state = form2.querySelector("[name='state']").value;
    const country = form2.querySelector("[name='country']").value;

    // Crie um objeto com os dados a serem enviados para o Django
    const data = {
        form1Data: {
            email: email,
            first_name: firstName,
            last_name: lastName,
            cpf: cpf,
            phone_number: phone,
        },
        form2Data: {
            cep: cep,
            street: street,
            number: number,
            district: district,
            complement: complement,
            city: city,
            state: state,
            country: country,
        },
    };

    // Enviar dados para o Django via AJAX
    fetch("/update_data/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            // Adicione quaisquer outros cabeçalhos necessários aqui
        },
        body: JSON.stringify(data),
    })
        .then((response) => response.json())
        .then((responseData) => {
            // Trate a resposta do Django, se necessário
            console.log(responseData);
        })
        .catch((error) => {
            console.error("Erro ao enviar solicitação:", error);
        });
}





