from django.contrib import admin
from .models import Client, Product, ProductStock, Order, Address


admin.site.register(Client)
admin.site.register(Product)
admin.site.register(ProductStock)
admin.site.register(Order)
admin.site.register(Address)
