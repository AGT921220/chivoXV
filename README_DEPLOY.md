# Docker — invitación estática

Sitio HTML/CSS/JS servido con **Nginx Alpine** (sin Node ni build).

## Levantar

En la carpeta del proyecto:

```bash
docker compose up -d --build
```

El sitio queda en **http://127.0.0.1:8100** (mapeo `8100` → `80` dentro del contenedor).

```bash
curl -I http://127.0.0.1:8100
```

## Comandos útiles

```bash
docker compose logs -f invitacion-html
docker compose down
docker compose up -d --build   # tras cambiar HTML, CSS, JS, imágenes o audio
```

## Archivos

| Archivo | Uso |
|---------|-----|
| `Dockerfile` | Imagen Nginx + estáticos en `/usr/share/nginx/html` |
| `docker-compose.yml` | Servicio `invitacion-html`, puerto **8100** |
| `nginx.conf` | `index.html`, assets y caché básica |
| `.dockerignore` | Contexto de build más liviano |

La configuración del VPS, proxy o dominio la defines tú en tu entorno.

---

Desarrollado por **[AGSoftweb](https://agsoftweb.com.mx/)**.
