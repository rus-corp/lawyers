#!/usr/bin/env sh
# Run from cron on the host. Certbot exits without changes until a certificate
# is close enough to expiry to need renewal.
set -eu

PROJECT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
cd "$PROJECT_DIR"

docker compose run --rm --no-deps \
  --entrypoint certbot \
  certbot renew --webroot --webroot-path /var/www/certbot

# Nginx reads certificates only when it starts or reloads.
docker compose exec -T nginx nginx -s reload
