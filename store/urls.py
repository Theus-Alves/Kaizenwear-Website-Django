from . import views
from django.urls import path

urlpatterns = [
    path('', views.home, name='home'),
    path('product/<int:product_id>/', views.view_product, name='view_product'),
]
