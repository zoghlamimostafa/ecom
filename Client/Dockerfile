FROM node:18-alpine as build

WORKDIR /usr/src/app

# Copier package.json
COPY package*.json ./
RUN npm ci --silent

# Copier le code source et build
COPY . .
RUN npm run build

# Production stage avec Nginx
FROM nginx:alpine
COPY --from=build /usr/src/app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
