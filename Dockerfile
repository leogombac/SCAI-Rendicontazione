# Stage 1
FROM node:16.10-alpine as build-step
RUN mkdir -p /Rendicontazione
WORKDIR /Rendicontazione
COPY package.json /Rendicontazione
RUN npm install --legacy-peer-deps
RUN npm install -g @angular/cli --legacy-peer-deps
COPY . .
RUN npm run build 

# Stage 2
FROM nginx:1.17.1-alpine

COPY --from=build-step /Rendicontazione/dist/demo/ /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 8080

## # Stage 1
## FROM node:16.10-alpine as build-step
## #RUN mkdir -p /Rendicontazione
## RUN mkdir -p /var/www
## WORKDIR /var/www
## COPY package.json /var/www
## #COPY package-lock.json /var/www
## RUN npm install
## 
## 
## COPY . /var/www/
## 
## ENV  PORT=4200
## EXPOSE 4200
## CMD ["npm", "build", "--host=0.0.0.0"]
## 
## # Stage 2
## FROM nginx:1.17-alpine
## RUN mkdir -p /var/www
## COPY --from=build /var/www/dist /var/www/dist
## COPY deployment/vhost.conf /etc/nginx/conf.d/default.conf