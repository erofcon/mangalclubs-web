# Деплой web на VPS

Эта инструкция для запуска frontend вместе с backend из соседнего репозитория `mangalclubs-core`.

На сервере web работает в отдельном Docker-контейнере с Next.js. Caddy из backend-проекта принимает HTTP/HTTPS и направляет запросы:

- `mangalclubs.ru` в web;
- `mangalclubs.ru/api/v1/*`, `mangalclubs.ru/media/*` и `mangalclubs.ru/health` в API;
- `api.mangalclubs.ru` напрямую в API.

Отдельный Nginx не нужен. Обновление делаю вручную, когда сам решу выкатить новую версию.

## 1. Что подготовить

К этому моменту на VPS должны быть Docker, Docker Compose и уже клонированный backend в `/opt/mangalclubs-core`.

В DNS должны быть `A` записи на IP VPS:

- `mangalclubs.ru`;
- `api.mangalclubs.ru`.

`.env` в git не заливаю. Переменные для production web задаю в `.env` backend-проекта, потому что именно его `docker-compose.yml` собирает и запускает оба приложения.

## 2. Залить код

Сначала код надо залить в git-репозиторий. Лучше приватный.

Потом на VPS:

```bash
cd /opt
git clone <web-repo-url> mangalclubs-web
cd mangalclubs-web
```

После этого рядом должны лежать оба репозитория:

```text
/opt/mangalclubs-core
/opt/mangalclubs-web
```

Если репозиторий приватный, на сервере нужен доступ: deploy key, SSH-ключ или HTTPS token.

## 3. Настроить `.env` backend-проекта

Перехожу в backend:

```bash
cd /opt/mangalclubs-core
nano .env
```

Добавляю или проверяю эти строки:

```env
DOMAIN=api.mangalclubs.ru
WEB_DOMAIN=mangalclubs.ru
WEB_DIR=../mangalclubs-web

NEXT_PUBLIC_API_URL=https://api.mangalclubs.ru
NEXT_PUBLIC_SITE_URL=https://mangalclubs.ru

CORS_ORIGINS=https://mangalclubs.ru
COOKIE_SECURE=true
```

`NEXT_PUBLIC_*` попадают в сборку Next.js. Если меняю одну из этих строк, обязательно пересобираю контейнер web.

`WEB_DIR` оставляю как есть, если оба репозитория лежат рядом в `/opt`. Если web лежит в другой папке, указываю путь к нему относительно `/opt/mangalclubs-core`.

## 4. Первый запуск

Собираю и запускаю всё из backend-проекта:

```bash
cd /opt/mangalclubs-core
docker compose up -d --build
```

Проверяю контейнеры:

```bash
docker compose ps
docker compose logs -f web
```

Caddy сам получает HTTPS-сертификаты, когда оба домена уже смотрят на VPS.

Снаружи проверяю:

```bash
curl -I https://mangalclubs.ru
curl https://mangalclubs.ru/health
curl https://api.mangalclubs.ru/health
```

В браузере дополнительно проверяю главную страницу, карточку организации, изображения, авторизацию и создание заказа.

## 5. Обновление вручную

Когда надо выкатить новую версию frontend:

```bash
cd /opt/mangalclubs-web
git pull

cd /opt/mangalclubs-core
docker compose up -d --build web caddy
docker compose ps
```

Если менял backend или его `.env`, запускаю полное обновление:

```bash
cd /opt/mangalclubs-core
git pull
docker compose up -d --build
```

## 6. Если что-то не открылось

Смотрю логи:

```bash
cd /opt/mangalclubs-core
docker compose logs -f web
docker compose logs -f caddy
docker compose logs -f api
```

Проверяю Caddy-конфигурацию внутри контейнера:

```bash
docker compose exec caddy caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile
```

Если Caddy не выпустил сертификат, сначала проверяю DNS-записи и доступность портов 80 и 443 снаружи.
