# Build Stage
FROM node:22 AS builder
WORKDIR /app
COPY package*.json ./
COPY client/package.json ./client/
RUN npm ci
COPY client/ ./client/
WORKDIR /app/client
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL
RUN npm run build

# Production Stage
FROM nginx:alpine
COPY --from=builder /app/client/build /usr/share/nginx/html
COPY client/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]