from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
from .models import Client, Address, Product
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.hashers import check_password
from django.views.decorators.csrf import csrf_exempt
import json


full_navbar = True


def auth(request):

    full_navbar = False
    if request.method == 'GET':
        return render(request, 'users/auth.html', {'full_navbar': full_navbar})

    elif request.method == 'POST':
        # Formulário de Login
        if 'formLogin' in request.POST:
            email = request.POST.get('email')
            username = email.split('@')[0]

            # Autenticação do usuário
            user = authenticate(username=username,
                                password=request.POST.get('password'))

            if user:
                login(request, user)
                return redirect('home')
            else:
                return HttpResponse("Email ou senha inválidos")

        # Formulário de Registro
        elif 'formRegister' in request.POST:
            email = request.POST.get('email')
            username = email.split('@')[0]
            first_name = request.POST.get('first_name')
            last_name = request.POST.get('last_name')

            if request.POST.get('password') != request.POST.get('confirmPassword'):
                return HttpResponse("Senhas não são iguais")

            user = User.objects.filter(email=email).first()
            if user:
                return HttpResponse("Já existe uma conta neste email, faça login")

            user = User.objects.create_user(
                username=username, email=email, password=request.POST.get('password'), first_name=first_name, last_name=last_name)

            user.save()
            login(request, user)
            return redirect('home')


def logout_view(request):
    logout(request)
    return redirect('home')


@login_required
def procfile(request):

    full_navbar = True

    if request.method == 'GET':
        if request.user.is_authenticated:
            try:
                client = Client.objects.get(user=request.user)
            except Client.DoesNotExist:
                client = None

            try:
                address = Address.objects.get(user=request.user)
            except Address.DoesNotExist:
                address = None

            return render(request, 'users/procfile.html', {'client': client, 'address': address, 'full_navbar': full_navbar})
        else:
            return render(request, 'users/procfile.html')

    elif request.method == 'POST':

        if 'formPassword' in request.POST:
            password = request.POST.get('password')
            new_password = request.POST.get('new_password')
            repeated_password = request.POST.get('repeated_password')

            # Você pode acessar o objeto de usuário autenticado assim:
            user = request.user

            if check_password(password, user.password):
                if new_password == repeated_password:
                    try:
                        # Se as senhas coincidem, atualiza a senha do usuário
                        user.set_password(new_password)
                        user.save()
                        login(request, user)
                        print("Senha Alterada")
                        return redirect('profile')

                    except:
                        print('Houve algum erro')
                else:
                    print('As novas senhas não coincidem')
            else:
                print('Senha atual incorreta')

       # Formulário Informações Pessoais
        if 'formInfo' in request.POST:

            email = request.POST.get("email")
            first_name = request.POST.get("first_name")
            last_name = request.POST.get("last_name")
            cpf = request.POST.get("cpf")
            phone_number = request.POST.get("phone_number")
            user = request.user
            fullname = f"{first_name} {last_name}"

            # Tenta buscar um objeto Client associado ao usuário
            client, created = Client.objects.get_or_create(user=user, defaults={
                                                           'fullname': fullname, 'cpf': cpf, 'phone_number': phone_number})

            # Se o objeto já existia, atualiza seus valores
            if not created:
                client.fullname = fullname
                client.cpf = cpf
                client.phone_number = phone_number
                user.first_name = first_name
                user.last_name = last_name
                client.save()
                user.save()

            show_success_message = True
            return redirect('procfile')

        # Formulário Endereço
        elif 'formAddress' in request.POST:

            user = request.user
            cep = request.POST.get("cep")
            street = request.POST.get("street")
            number = request.POST.get("number")
            district = request.POST.get("district")
            city = request.POST.get("city")
            state = request.POST.get("state")
            country = request.POST.get("country")
            complement = request.POST.get("complement")

            # busca um objeto Address associado ao usuário
            address, created = Address.objects.get_or_create(user=user, defaults={'cep': cep,
                                                                                  'street': street, 'number': number, 'district': district, 'city': city,
                                                                                  'state': state, 'country': country, 'complement': complement})

            # Se o objeto já existia, atualiza seus valores
            if not created:
                address.cep = cep
                address.street = street
                address.number = number
                address.district = district
                address.city = city
                address.state = state
                address.country = country

                address.save()

            show_success_message = True

            return redirect('procfile')

        else:
            return redirect('procfile')


@csrf_exempt
def add_cart(request):
    if request.method == 'POST':
        try:
            # Obtenha os dados JSON da solicitação POST
            data = json.loads(request.body)

            # Crie um dicionário para rastrear as quantidades dos produtos
            cart_dict = {}

            # Variável para rastrear o total do carrinho
            total_cart = 0
            number_cart = 0

            # Itere sobre os itens do carrinho e agrupe-os por 'id' e 'size'
            for item in data:
                product_id = item['id']
                size = item['size']
                quantity = item['qtd']

                # Verifique se o produto já está no dicionário
                if (product_id, size) in cart_dict:
                    # Se estiver, adicione a quantidade existente
                    cart_dict[(product_id, size)] += quantity
                else:
                    # Caso contrário, defina a quantidade inicial
                    cart_dict[(product_id, size)] = quantity

            # Consultando o banco de dados para obter informações detalhadas dos produtos
            products = Product.objects.filter(
                id__in=[product_id for product_id, _ in cart_dict.keys()])

            # Lista com informações detalhadas e quantidades
            cart_result = []
            for product in products:
                product_id = str(product.id)
                for size, quantity in cart_dict.items():
                    if product_id == size[0]:
                        # Calcula o subtotal para o produto atual
                        subtotal = product.price * quantity

                        # Adiciona o subtotal ao total do carrinho
                        total_cart += subtotal
                        number_cart += quantity

                        cart_result.append({
                            'id': product_id,
                            'size': size[1],
                            'qtd': quantity,
                            'name': product.name,
                            'price': product.price,
                            'subtotal': subtotal,  # Adiciona o subtotal ao resultado
                            'image_front': product.image_front.url,
                        })

            # Verifique se o carrinho está vazio
            if not cart_result:
                return JsonResponse({'Cart': None, 'Total': 0, 'numberCart': 0})

            # Retorne a nova lista como JSON, incluindo o total do carrinho
            response_data = {'Cart': cart_result,
                             'Total': total_cart, 'numberCart': number_cart}

            return JsonResponse(response_data)
        except Exception as e:
            response_data = {'error': str(e)}
            return JsonResponse(response_data, status=400)


def client_orders(request):
    return render(request, 'users/client_orders.html')


@csrf_exempt
def order(request):
    if request.method == 'GET':
        return render(request, 'users/order.html')

    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            # Receba a lista de itens do carrinho
            cartItems = data.get('cartItems', [])

            # Agora você pode aplicar sua lógica aqui com a lista de itens do carrinho (cartItems)

            # Exemplo: Calcular o total do carrinho
            total = sum(item.get('price', 0) for item in cartItems)

            # Exemplo de resposta JSON
            response_data = {'success': True, 'total': total}

            return JsonResponse(response_data)

        except Exception as e:
            response_data = {'error': str(e)}


def policy(request):
    return render(request, 'users/resources/policy.html')


def terms(request):
    return render(request, 'users/resources/terms.html')


def checkout(request):

    client = None
    address = None
    full_navbar = False

    if request.user.is_authenticated:
        try:
            client = Client.objects.get(user=request.user)
        except Client.DoesNotExist:
            client = None

        try:
            address = Address.objects.get(user=request.user)
        except Address.DoesNotExist:
            address = None

    return render(request, 'users/checkout.html', {'client': client, 'address': address, 'full_navbar': full_navbar})
