from django.shortcuts import render, get_object_or_404, redirect, HttpResponseRedirect
from django.http import HttpResponse, JsonResponse
from .models import Client, Address, Product, Order, OrderItem
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.hashers import check_password
from django.views.decorators.csrf import csrf_exempt
import json
from datetime import date
import random
import smtplib
from email.message import EmailMessage
from decouple import config


full_navbar = True
order_current = dict()


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
            address_complet = f"{street}, {number}, {district}, {city}, {state}, {country}, {complement}"

            # busca um objeto Address associado ao usuário
            address, created = Address.objects.get_or_create(user=user, defaults={'cep': cep,
                                                                                  'street': street, 'number': number, 'district': district, 'city': city,
                                                                                  'state': state, 'country': country, 'complement': complement, 'address_complet': address_complet})

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


def setnewOrder(cartItems):
    global order_current

    if order_current:
        order_current.clear()

    cartCopy = dict(cartItems)
    order_current = cartCopy


@csrf_exempt
def add_cart(request):
    if request.method == 'POST':
        try:
            isPay = False
            # Obtenha os dados JSON da solicitação POST
            data = json.loads(request.body)

            # Verifique o valor do parâmetro personalizado 'source'
            if 'HTTP_X_REQUESTED_BY' in request.META and request.META['HTTP_X_REQUESTED_BY'] == 'btnPay':
                # solicitação foi feita pelo botão "btnPay"
                isPay = True

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

            orderPlaced = False
            setnewOrder(response_data)

            if isPay:

                user_id = request.user.id

                # Gere um novo número de pedido (se necessário)
                hash_order = random.randint(100000, 999999)
                order_number = f'C{user_id}P{hash_order}'

                # Obtenha uma instância válida do modelo User com base no ID
                user = User.objects.get(pk=user_id)

                # Crie uma nova ordem
                new_order = Order.objects.create(
                    user=user,
                    status="aguardando_pagamento",
                    order_number=order_number,
                    client=user.client,
                    address_client=user.address,
                    total_value=0,  # Você pode definir o valor total como 0 inicialmente e atualizá-lo posteriormente
                )

                total_value = 0  # Inicialize o valor total do pedido como 0

                for item in cart_result:
                    product_id = item['id']
                    total_units_sold = item['qtd']
                    total_amount = item['subtotal']
                    size = item['size']

                    try:
                        product = Product.objects.get(pk=product_id)

                        # Crie um item de pedido associado a este pedido
                        order_item = OrderItem.objects.create(
                            order=new_order,
                            product=product,
                            unit_price=product.price,
                            quantity=total_units_sold,
                            subtotal=total_amount,
                            size=size,
                        )

                        # Salve o item do pedido
                        order_item.save()

                        # Atualize o valor total do pedido
                        total_value += total_amount

                    except Product.DoesNotExist:

                        print("produto nao existe - ERRO")

                # Atualize o valor total do pedido
                new_order.total_value = total_value
                new_order.save()

                orderPlaced = True

            # Adicione orderPlaced ao response_data
            response_data['orderPlaced'] = orderPlaced

            return JsonResponse(response_data)

        except Exception as e:
            print(f"Ocorreu um erro: {str(e)}")

            return JsonResponse({'error': str(e)})


@csrf_exempt
def send_email(request):
    print('teste')
    return HttpResponseRedirect('/newOrder/')


def orders(request):
    user_id = request.user
    orders = Order.objects.filter(user=user_id)

    context = {
        'orders': orders,
    }

    for order in orders:
        order.total_items = order.orderitem_set.count()
        if order.total_items > 2:
            order.extra_items = order.total_items - 2

    return render(request, 'users/orders.html', context)


def newOrder(request):
    global order_current

    cart_items = order_current.get('Cart', [])
    total = order_current.get('Total', 0)
    total_items = order_current.get('numberCart', 0)

    # Crie um novo dicionário com as variáveis que você deseja passar para o template
    context = {
        'products': cart_items,
        'total': total,
        'total_items': total_items
    }

    return render(request, 'users/newOrder.html', context)


def policy(request):
    return render(request, 'users/resources/policy.html')


def terms(request):
    return render(request, 'users/resources/terms.html')


def checkout(request):

    if request.method == 'GET':

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

    elif request.method == 'POST':
        return redirect('newOrder')


@csrf_exempt
@login_required
def update_data(request):
    try:
        if request.method == 'POST':
            data = json.loads(request.body)
            user = request.user

            # Verifique se o usuário está autenticado antes de salvar os dados
            if user.is_authenticated:
                # Obtenha os dados do form1
                form1Data = data.get('form1Data', {})
                # Obtenha os dados do form2
                form2Data = data.get('form2Data', {})

                update_or_create_address_and_user_data(
                    user, form1Data, form2Data)
                return JsonResponse(data)
            else:
                return JsonResponse({"error": "Usuário não autenticado"}, status=401)

    except Exception as e:
        print(f"Erro no servidor: {str(e)}")
        return JsonResponse({"error": "Erro interno do servidor"}, status=500)


def update_or_create_address_and_user_data(user, form1Data, form2Data):
    # Verifique se o usuário já possui um registro de endereço
    try:
        address = Address.objects.get(user=user)
    except Address.DoesNotExist:
        address = None

    try:
        client = Client.objects.get(user=user)
    except Client.DoesNotExist:
        client = None

    # Atualize os dados do usuário
    if user.email != form1Data['email']:
        user.email = form1Data['email']
        user.save()

    if user.first_name != form1Data['first_name']:
        user.first_name = form1Data['first_name']
        user.save()

    if user.last_name != form1Data['last_name']:
        user.last_name = form1Data['last_name']
        user.save()

    if client:
        client.fullname = f"{form1Data['first_name']} {form1Data['last_name']}"
        client.cpf = form1Data['cpf']
        client.phone_number = form1Data['phone_number']

    else:
        client = Client.objects.create(
            fullname=f"{form1Data['first_name']} {form1Data['last_name']}",
            user=user,
            cpf=form1Data['cpf'],
            phone_number=form1Data['phone_number'],
        )

        client.save()

    # Crie ou atualize o registro de endereço
    if address:
        # Atualize os campos existentes
        address.cep = form2Data['cep']
        address.street = form2Data['street']
        address.number = form2Data['number']
        address.district = form2Data['district']
        address.city = form2Data['city']
        address.state = form2Data['state']
        address.country = form2Data['country']
        address.complement = form2Data['complement']
        address.save()
    else:
        # Crie um novo registro de endereço
        address = Address.objects.create(
            user=user,
            cep=form2Data['cep'],
            street=form2Data['street'],
            number=form2Data['number'],
            district=form2Data['district'],
            city=form2Data['city'],
            state=form2Data['state'],
            country=form2Data['country'],
            complement=form2Data['complement']
        )

        address.save()
