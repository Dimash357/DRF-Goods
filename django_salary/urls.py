from django.urls import re_path, path
from django_salary import views

urlpatterns = [
    re_path(r"^olx/profile/register/$", views.profile_register, name="profile_register"),
    re_path(r"^olx/profile/login/$", views.profile_login, name="profile_login"),
    re_path(r"^olx/profile/logout/$", views.profile_logout, name="profile_logout"),

    re_path(r"^olx/$", views.category_list, name="category_list"),

    path("olx/category/<slug:slug>/", views.category, name="category"),
    re_path(r"^olx/tovar/detail/$", views.tovar_detail, name="tovar_detail"),

    re_path(r"^olx/tovar/create/$", views.tovar_create, name="tovar_create"),

]
