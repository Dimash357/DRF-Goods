from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.http import HttpResponse, HttpRequest
from django.shortcuts import render, redirect
import re
from django_salary import models


# Create your views here.


def profile_register(request: HttpRequest) -> HttpResponse:
    if request.method == "GET":
        return render(request, "django_salary/profile_register.html", context={})
    elif request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]
        password1 = request.POST["password1"]
        password2 = request.POST["password2"]

        if password1 != password2:
            raise Exception("incorrect password")
        if not re.match(re.compile(r"^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$"), password1):
            raise Exception("incorrect password")

        User.objects.create_user(
            username=username,
            email=email,
            password=password1
        )
        return redirect("profile_login")


def profile_login(request):
    if request.method == 'GET':
        return render(request, 'django_salary/profile_login.html', context={})
    elif request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)
        if user is None:
            raise Exception("incorrect password")
        login(request, user)
        return redirect('category_list')


def profile_logout(request):
    logout(request)
    return redirect('profile_login')


def category_list(request: HttpRequest) -> HttpResponse:
    if request.method == "GET":
        categories = models.Category.objects.all()
        return render(request, "django_salary/home.html", context={"categories": categories})


def category(request: HttpRequest, slug) -> HttpResponse:
    if request.method == "GET":
        """
select * from Tovar where category.slug = cat.slug 
[(1, 'Машина', '300000.00'), ...]

(select id, name, slug from Category where slug = "slug") as cat
(1, 'Электроника', 'electro')
        """

        category_obj = models.Category.objects.get(slug=slug)  # (1, 'Электроника', 'electro')
        tovars = models.Tovar.objects.filter(category=category_obj)  # [(1, 'Машина', '300000.00'), ...]
        name = f"Категория: {category_obj.name}"
        return render(request, "django_salary/category.html", context={"tovars": tovars, "name": name})


def tovar_by_user(request, username: str):
    user_obj = User.objects.get(username=username)
    tovars = models.Tovar.objects.filter(seller=user_obj)
    return render(request, "django_salary/category.html", context={"tovars": tovars})


def tovar_detail(request):
    return HttpResponse("<h1>profile_register</h1>")


def tovar_create(request):
    return HttpResponse("<h1>profile_register</h1>")
