from django import template
from django.templatetags.static import StaticNode

register = template.Library()


@register.simple_tag
def product_image_url(product_id):
    img_path = f'store/img/img-{product_id}.png'
    return StaticNode.handle_simple(img_path)
