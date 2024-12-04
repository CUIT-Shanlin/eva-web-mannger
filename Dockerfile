FROM nginx:1.26.2

MAINTAINER dkh

COPY dist/  /usr/share/nginx/html/

COPY default.conf /etc/nginx/conf.d/default.conf