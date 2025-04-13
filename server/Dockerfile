FROM node:18
WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm ci
COPY . .
WORKDIR /app
EXPOSE 3001
CMD ["node", "index.js"]