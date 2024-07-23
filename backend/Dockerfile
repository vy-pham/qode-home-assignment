# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Stage 2: Production
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/dist .
COPY package*.json ./
RUN npm install --omit=dev

EXPOSE 3000
CMD ["npm", "start"]