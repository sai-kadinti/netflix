FROM nginx:alpine
RUN rm -rf /var/www/html/*
COPY /build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
