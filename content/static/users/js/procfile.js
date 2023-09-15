const btnForm1 = document.querySelector("#btnForm1");
const btnForm2 = document.querySelector("#btnForm2");
const btnSave1 = document.querySelector('#btnSave1');
const btnSave2 = document.querySelector('#btnSave2');
const btnCancel1 = document.querySelector('#btnCancel1');
const btnCancel2 = document.querySelector('#btnCancel2');



document.addEventListener('DOMContentLoaded', function () {
    // Verificar se o alerta já foi exibido anteriormente
    const formSubmitted = localStorage.getItem("formSubmitted");
    const alertSuccess = document.querySelector('#myalert');

    if (formSubmitted === "true") {
        alertSuccess.style.display = "block";

        setTimeout(function () {
            // Altere o estilo da div para torná-la invisível após 4 segundos
            alertSuccess.style.display = "none";
            // Defina o localStorage como "false" após 4 segundos
            localStorage.setItem("formSubmitted", "false");
        }, 4000); // 4000 milissegundos = 4 segundos
    }
});



function editForm(index, event) {
    event.preventDefault();

    let form, inputs, buttonContainer

    if (index === 1) {
        form = document.querySelector('#form1');
        inputs = form.querySelectorAll("input");
        buttonContainer = document.querySelector("#button-container1");

        btnForm1.style.display = "none";
        buttonContainer.style.display = "flex";


    } else {
        form = document.querySelector('#form2');
        inputs = form.querySelectorAll("input");
        buttonContainer = document.querySelector("#button-container2");

        btnForm2.style.display = "none";
        buttonContainer.style.display = "flex";


    }

    inputs.forEach(function (input) {
        input.removeAttribute("disabled");
        input.classList.add("enabled-input");
    });

    selects = form.querySelectorAll("select");
    selects.forEach(function (select) {
        select.removeAttribute("disabled");
    });


}

btnForm1.addEventListener("click", function (event) {
    editForm(1, event);
});

btnForm2.addEventListener("click", function (event) {
    editForm(2, event);
});



// Salvar Formulário
function SaveForm(index) {
    let form, inputs, buttonContainer;
    const alertSuccess = document.querySelector('#myalert');

    if (index === 1) {
        form = document.querySelector('#form1');
        buttonContainer = document.querySelector("#button-container1");
    } else {
        form = document.querySelector('#form2');
        buttonContainer = document.querySelector("#button-container2");
    }

    inputs = form.querySelectorAll("input:not([name='csrfmiddlewaretoken'])");
    inputs.forEach(function (input) {
        input.setAttribute("disabled", "true");
        input.classList.remove("enabled-input");
    });

    // Defina o localStorage como "true" quando o formulário for salvo
    localStorage.setItem("formSubmitted", "true");
}

btnSave1.addEventListener("click", function (event) {
    document.querySelector('#form1').submit();
    setTimeout(function () {
        SaveForm(1, event);
    }, 100);  // Aguarda 200 milissegundos antes de desabilitar os campos
});

btnSave2.addEventListener("click", function (event) {
    document.querySelector('#form2').submit();
    setTimeout(function () {
        SaveForm(2, event);
    }, 100);
});


var btnSavePassword = document.getElementById("btnSavePassword");
var spinners = document.querySelectorAll(".spinner-border, .spinner-grow");
var buttonContainer = document.getElementById("buttonContainer");
var alertBox = document.querySelector('.alert');

btnSavePassword.addEventListener("click", function () {
    // Altera o texto do botão e desabilita o botão
    btnSavePassword.textContent = "Salvando...";
    btnSavePassword.disabled = true;

    // Mostra os spinners
    spinners.forEach(function (spinner) {
        spinner.classList.remove("d-none");
    });

    // Aguarda 1,5 segundos (1500 milissegundos)
    setTimeout(function () {
        // Reverte o texto do botão e habilita o botão
        btnSavePassword.textContent = "Salvo!";


        // Oculta os spinners
        spinners.forEach(function (spinner) {
            spinner.classList.add("d-none");
        });

        // Exibe o alerta
        alertBox.style.display = 'flex';

        // Aguarda mais 2 segundos (2000 milissegundos)
        setTimeout(function () {
            // Oculta o alerta
            alertBox.style.display = 'none';
            btnSavePassword.textContent = "Salvar";

            // Submete o formulário (assumindo que o formulário tem um ID chamado "meuFormulario")
            btnSavePassword.disabled = false;
            var form = document.getElementById("myFormPassword");
            form.submit();
        }, 2000);

    }, 1500);
});
