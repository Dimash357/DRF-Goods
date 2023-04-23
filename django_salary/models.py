from django.db import models
from django.urls import reverse
from django.utils import timezone
from django.contrib.auth.models import User


class Category(models.Model):
    name = models.CharField(verbose_name="Наименование категории товаров", max_length=200)
    slug = models.SlugField(verbose_name="Ссылка на категорию товаров", max_length=200, unique=True)

    # avatar
    # descrp

    class Meta:
        app_label = "django_salary"
        ordering = ('name',)
        verbose_name = 'Категория'
        verbose_name_plural = 'Категории'

    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return reverse('category_detail', args=[self.slug])


class Tovar(models.Model):
    title = models.CharField(verbose_name="Наименование товара", max_length=200)
    slug = models.SlugField(verbose_name="Ссылка на товар", max_length=200, unique=True)
    category = models.ForeignKey(Category, null=True, default=None, on_delete=models.SET_NULL)
    seller = models.ForeignKey(User, on_delete=models.CASCADE)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to='ads/%Y/%m/%d/', blank=True)
    created = models.DateTimeField(default=timezone.now)
    updated = models.DateTimeField(auto_now=True)

    class Meta:
        app_label = "django_salary"
        ordering = ('-created',)
        verbose_name = 'Товар'
        verbose_name_plural = 'Товары'

    def __str__(self):
        return self.title

    def get_absolute_url(self):
        return reverse('ad_detail', args=[self.slug])
