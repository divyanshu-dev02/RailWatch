# =========================================================================
# RailWatch React Vite Frontend Multi-Stage Dockerfile
# Stage 1: Build static assets using Node.js
# Stage 2: Serve via Nginx Alpine
# =========================================================================

# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci --no-audit

# Copy source code and build
COPY . .
RUN npm run build

# Stage 2: Production Nginx Server
FROM nginx:alpine AS runner
WORKDIR /usr/share/nginx/html

# Remove default nginx HTML
RUN rm -rf ./*

# Copy built files from builder stage
COPY --from=builder /app/dist .

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
