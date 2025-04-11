FROM node:18
WORKDIR /app
COPY package*.json ./
COPY server/package.json ./server/
RUN npm ci --only=production
COPY server/ ./server/
WORKDIR /app/server
EXPOSE 3000
CMD ["node", "index.js"]