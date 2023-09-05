from django.contrib.auth.models import User
from django.db import models


class Product(models.Model):
    name = models.CharField(max_length=100)
    price = models.FloatField()
    image_front = models.ImageField(blank=True, null=True)
    image_back = models.ImageField(blank=True, null=True)
    product_code = models.CharField(max_length=6)
    description = models.TextField()

    def __str__(self):
        return self.name
    

class ProductStock(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    
    SIZE_CHOICES = (
        ('P', 'P'),
        ('M', 'M'),
        ('G', 'G'),
        ('GG', 'GG'),
    )
    size = models.CharField(max_length=2, choices=SIZE_CHOICES)
    stock_quantity = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.product} - {self.size}"





class Address(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    cep = models.CharField(max_length=10)
    street = models.CharField(max_length=200)
    number = models.CharField(max_length=10)
    district = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=50)
    country = models.CharField(max_length=50)
    complement = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.street}, {self.number}, {self.district}, {self.city}, {self.state}, {self.country}"


class Client(models.Model):

    fullname = models.CharField(max_length=100)
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    cpf = models.CharField(max_length=14, unique=True)
    phone_number = models.CharField(max_length=20)

    def __str__(self):
        return str(self.fullname)


class Order(models.Model):
    product_name = models.CharField(max_length=100)
    product_id = models.ForeignKey(Product, on_delete=models.CASCADE)
    total_units_sold = models.IntegerField()
    total_amount = models.FloatField()
    order_date = models.DateField(auto_now_add=True)
    client_id = models.ForeignKey(Client, on_delete=models.CASCADE)

    def __str__(self):
        return f"Pedido de {self.client_id} - {self.product_name}"
