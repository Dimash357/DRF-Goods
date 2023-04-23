Бизнес идея

Охват аудитории (количество пользователей)
Условия рынка (количество конкурентов)
Команда...

MVP - быстро накидать прототип, первое время за счёт
вертикального масштрабирования (докупить сервер + gunicorn workers).

Архитектура:

DNS(A-запись===ip1, ip2, ip3, ) km.kz | web.km.kz
Nginx (передаёт запросы от провайдера - от пользователя до Gunicorn-a) + http(80) + https(443)
Gunicorn (проксирует запросы от Nginx до Django - тут если надо увеличиваем количество процессов)
Django (web-framework + drf + react)
Redis
PostgreSQL
######################################################################################################

sudo apt-get update -y
sudo apt-get install -y git curl wget build-essential gcc make libpq-dev unixodbc-dev zlib1g-dev libncurses5-dev libgdbm-dev libnss3-dev libssl-dev libreadline-dev libffi-dev libsqlite3-dev libbz2-dev gettext
sudo apt-get install -y nginx gunicorn postgresql postgresql-contrib redis
sudo apt install -y snapd
sudo snap install --classic certbot gh
sudo apt-get install -y python3-dev python3-pip python3-venv

sudo apt autoremove -y
ping 185.4.180.190 -t

#################################

sudo passwd postgres
sudo -i -u postgres
psql postgres
\l
\d
CREATE USER pgs_usr WITH PASSWORD '12345Qwerty!';
CREATE DATABASE pgs_db OWNER pgs_usr;
GRANT ALL PRIVILEGES ON DATABASE pgs_db TO pgs_usr;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public to pgs_usr;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public to pgs_usr;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public to pgs_usr;
\l
\q
exit

sudo systemctl status postgresql
sudo systemctl start postgresql
sudo systemctl restart postgresql

##########################################

sudo systemctl status redis
redis-cli --version
redis-cli
PING
exit

#######################################

git clone https://github.com/bogdandrienko/web_prod
mkdir web && cd web
python3 -m venv env
source env/bin/activate
pip install -r requirements.txt
pip install django django-environ django-grappelli gunicorn psycopg2-binary pillow djangorestframework djangorestframework-simplejwt django-cors-headers celery django_redis
pip freeze > requirements.txt

django-admin startproject django_settings .
django-admin startapp django_app

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'pgs_db',
        'USER': 'pgs_usr',
        'PASSWORD': '12345Qwerty!',
        'HOST': '127.0.0.1',
        'PORT': '5432',
    },
    'extra': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    },
}

CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": "redis://127.0.0.1:6379/1",
        'TIMEOUT': '120',
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient",
        }
    },
    'extra': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
        'LOCATION': 'django_ram_cache_table',
    },
    'special': {
        'BACKEND': 'django.core.cache.backends.db.DatabaseCache',
        'LOCATION': 'django_cache_table',
        'TIMEOUT': '120',
        'OPTIONS': {
            'MAX_ENTIES': 200,
        }
    },
}

python manage.py check --database default
python manage.py makemigrations
python manage.py migrate
python manage.py createcachetable
python manage.py createsuperuser

python manage.py collectstatic --noinput
python manage.py test
python manage.py runserver 0.0.0.0:8000
gunicorn --bind 0.0.0.0:8000 django_settings.wsgi

#######################################

sudo nano /etc/systemd/system/gunicorn.socket
<file>
[Unit]
Description=gunicorn socket
[Socket]
ListenStream=/run/gunicorn.sock
[Install]
WantedBy=sockets.target
</file>

sudo nano /etc/systemd/system/gunicorn.service
<file>
[Unit]
Description=Gunicorn for the Django example project
Requires=gunicorn.socket
After=network.target
[Service]
Type=notify
User=ubuntu
Group=www-data
RuntimeDirectory=gunicorn
WorkingDirectory=/home/ubuntu/web
ExecStart=/home/ubuntu/web/env/bin/gunicorn --workers 3 --bind unix:/run/gunicorn.sock django_settings.wsgi:application
ExecReload=/bin/kill -s HUP $MAINPID
KillMode=mixed
TimeoutStopSec=5
PrivateTmp=true
[Install]
WantedBy=multi-user.target
</file>

sudo systemctl daemon-reload
sudo systemctl start gunicorn
sudo systemctl enable --now gunicorn.service
sudo systemctl daemon-reload
sudo systemctl restart gunicorn
sudo systemctl status gunicorn.service

######################################################################################################################################################
# TEMP пока не купили домен

sudo usermod -aG ubuntu www-data
sudo nano /etc/nginx/sites-available/185.4.180.190.conf
<file>
server {
listen 80;
listen [::]:80;
server_name 185.4.180.190;
root /home/ubuntu/web;

location /.well-known/acme-challenge/ {}

location /favicon.ico {
    alias /home/ubuntu/web/static/logo.png;
    access_log off; log_not_found off;
    expires max;
}

location /robots.txt {
    alias /home/ubuntu/web/static/robots.txt;
    access_log off; log_not_found off;
    expires max;
}

location /static/ {
    alias /home/ubuntu/web/static/;
    expires max;
}

location /media/ {
    alias /home/ubuntu/web/static/media/;
    expires max;
}

location / {
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header Host $http_host;
    proxy_redirect off;
    proxy_buffering off;
    proxy_pass http://unix:/run/gunicorn.sock;
}
}
</file>

sudo ln -s /etc/nginx/sites-available/185.4.180.190.conf /etc/nginx/sites-enabled/185.4.180.190.conf
sudo service nginx start
sudo systemctl status nginx.service
sudo ufw allow 'Nginx Full'
sudo systemctl reload nginx.service

# TEMP пока не купили домен
######################################################################################################################################################





######################################################################################################################################################
# SSL

sudo rm /etc/nginx/sites-available/185.4.180.190.conf
sudo rm /etc/nginx/sites-enabled/185.4.180.190.conf
sudo rm /etc/nginx/sites-available/bogdandrienko.site-http.conf
sudo rm /etc/nginx/sites-available/bogdandrienko.site-https.conf
sudo rm /etc/nginx/sites-enabled/bogdandrienko.site-http.conf
sudo rm /etc/nginx/sites-enabled/bogdandrienko.site-https.conf

sudo nano /etc/nginx/sites-available/bogdandrienko.site-http.conf
<file>
server {
listen 80;
listen [::]:80;
server_name bogdandrienko.site www.bogdandrienko.site;
root /home/ubuntu/web;

location /.well-known/acme-challenge/ {}

location /favicon.ico {
    alias /home/ubuntu/web/static/logo.png;
    access_log off; log_not_found off;
    expires max;
}

location /robots.txt {
    alias /home/ubuntu/web/static/robots.txt;
    access_log off; log_not_found off;
    expires max;
}

location /static/ {
    alias /home/ubuntu/web/static/;
    expires max;
}

location /media/ {
    alias /home/ubuntu/web/static/media/;
    expires max;
}

location / {
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header Host $http_host;
    proxy_redirect off;
    proxy_buffering off;
    proxy_pass http://unix:/run/gunicorn.sock;
}
}
</file>

sudo ln -s /etc/nginx/sites-available/bogdandrienko.site-http.conf /etc/nginx/sites-enabled/bogdandrienko.site-http.conf
sudo service nginx start
sudo ufw allow 'Nginx Full'
sudo systemctl reload nginx.service
sudo systemctl status nginx.service


#####################################################
# TODO САЙТ НА 80 порту ДОЛЖЕН РАБОТАТЬ!


#################################################################################################


sudo certbot certonly --webroot -w /home/ubuntu/web -d bogdandrienko.site -m bogdandrienko@gmail.com --agree-tos
sudo openssl dhparam -out /etc/nginx/dhparam.pem 2048

sudo nano /etc/nginx/sites-available/bogdandrienko.site-http.conf
<file>
server {
listen 80;
listen [::]:80;
server_name bogdandrienko.site www.bogdandrienko.site;
root /home/bogdan/web;
location /.well-known/acme-challenge/ {}
location / {
    return 301 https://$server_name$request_uri;
}
}
</file>

sudo rm /etc/nginx/sites-enabled/bogdandrienko.site-http.conf
sudo ln -s /etc/nginx/sites-available/bogdandrienko.site-http.conf /etc/nginx/sites-enabled/bogdandrienko.site-http.conf
sudo service nginx start
sudo ufw allow 'Nginx Full'
sudo systemctl reload nginx.service
sudo systemctl status nginx.service

sudo nano /etc/nginx/sites-available/bogdandrienko.site.https.conf
<file>
server {
listen 443 ssl http2;
listen [::]:443 ssl http2;
ssl_certificate /etc/letsencrypt/live/bogdandrienko.site/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/bogdandrienko.site/privkey.pem;
ssl_session_timeout 1d;
ssl_session_cache shared:MozSSL:10m;
ssl_dhparam /etc/nginx/dhparam.pem;
ssl_protocols TLSv1.2;
ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;
ssl_prefer_server_ciphers off;
ssl_stapling on;
ssl_stapling_verify on;
ssl_trusted_certificate /etc/letsencrypt/live/bogdandrienko.site/chain.pem;
resolver 1.1.1.1;
client_max_body_size 50M;
server_name bogdandrienko.site www.bogdandrienko.site;
root /home/ubuntu/web;
location /.well-known/acme-challenge/ {}
location /favicon.ico {
    alias /home/ubuntu/web/static/logo.png;
    access_log off; log_not_found off;
    expires max;
}
location /robots.txt {
    alias /home/ubuntu/web/static/robots.txt;
    access_log off; log_not_found off;
    expires max;
}
location /static/ {
    alias /home/ubuntu/web/static/;
    expires max;
}
location /media/ {
    alias /home/ubuntu/web/static/media/;
    expires max;
}
location / {
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header Host $http_host;
    proxy_redirect off;
    proxy_buffering off;
    proxy_pass http://unix:/run/gunicorn.sock;
}
}
</file>
sudo ln -s /etc/nginx/sites-available/bogdandrienko.site.https.conf /etc/nginx/sites-enabled/bogdandrienko.site.https.conf
sudo service nginx start
sudo ufw allow 'Nginx Full'
sudo systemctl reload nginx.service
sudo systemctl status nginx.service

#################################################################################################
# таймер для CERTBOT (должен обновлять примерно раз в 90 дней автоматически)

certbot renew --force-renewal --post-hook "systemctl reload nginx.service"

sudo nano /etc/systemd/system/certbot-renewal.service
<file>
[Unit]
Description=Certbot Renewal

[Service]
ExecStart=/snap/bin/certbot renew --force-renewal --post-hook "systemctl reload nginx.service"
</file>

sudo nano /etc/systemd/system/certbot-renewal.timer
<file>
[Unit]
Description=Timer for Certbot Renewal

[Timer]
OnBootSec=300
OnUnitActiveSec=90d

[Install]
WantedBy=multi-user.target
</file>

sudo systemctl stop certbot-renewal.timer
sudo systemctl start certbot-renewal.timer
sudo systemctl enable certbot-renewal.timer
systemctl status certbot-renewal.timer

