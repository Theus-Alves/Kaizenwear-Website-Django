from . import views
from django.urls import path

urlpatterns = [
    path('auth/', views.auth, name='auth'),
    path('policy/', views.policy, name='policy'),
    path('terms/', views.terms, name='terms'),
    path('checkout/', views.checkout, name='checkout'),
    path('myprocfile/', views.procfile, name='procfile'),
    path('myorders/', views.client_orders, name='client_orders'),
    path('logout/', views.logout_view, name='logout'),
    path('add_cart/', views.add_cart, name='add_cart'),
    path('order/', views.order, name='order'),

]
