# Sitio estático — sin Node ni build
FROM nginx:alpine

# Configuración del servidor (antes de copiar el sitio)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Contenido público (rutas relativas desde la raíz del dominio)
COPY index.html styles.css script.js /usr/share/nginx/html/
COPY images/ /usr/share/nginx/html/images/
COPY music/ /usr/share/nginx/html/music/

EXPOSE 80
