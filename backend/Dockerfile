FROM node:20-alpine AS build

WORKDIR /app

# Install dependencies first so Docker can reuse this layer when only code changes.
COPY package.json package-lock.json ./
RUN npm install 

COPY . .

# Uploaded images live here; docker-compose mounts a volume on it.
RUN mkdir -p uploads && chown -R node:node /app
USER node

EXPOSE 5000
CMD ["node", "server.js"]
