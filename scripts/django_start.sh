cd ..
python3 -m venv env
source env/bin/activate
pip install -r requirements.txt
pip install django django-environ django-grappelli gunicorn psycopg2-binary pillow djangorestframework djangorestframework-simplejwt django-cors-headers celery django_redis
pip freeze > requirements.txt

python manage.py check --database default
python manage.py makemigrations
python manage.py migrate
python manage.py createcachetable

python manage.py runserver 0.0.0.0:8000
sh

