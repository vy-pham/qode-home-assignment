# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app
ENV NEXT_PUBLIC_HOST_URL=https://qode-assignment.phamgiavy.com
COPY . .
RUN npm install
RUN npm run build

# Stage 2: Production
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/.next/standalone .
COPY --from=builder /app/.next/static ./.next/static
COPY public ./public

EXPOSE 3000
CMD ["node", "server.js"]