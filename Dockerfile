FROM nginx 
MAINTAINER Douglas Chimento "dchimento@gmail.com"
COPY  webapp /usr/share/nginx/html
EXPOSE 8000
