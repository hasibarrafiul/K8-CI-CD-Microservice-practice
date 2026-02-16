# Stage 1: Build
FROM node:22-alpine AS builder

WORKDIR /app

# Copy root config files first for better caching
COPY package*.json ./
COPY tsconfig.json ./
COPY nest-cli.json ./

# Install dependencies (from root package.json)
RUN npm install

# Copy the entire monorepo source
COPY . .

# Build the specific service
RUN npm run build auth-service

# Stage 2: Production
FROM node:22-alpine

WORKDIR /app

# Copy package files and install only production dependencies
COPY --from=builder /app/package*.json ./
RUN npm install --only=production

# Copy the build output from the builder stage
COPY --from=builder /app/dist ./dist

EXPOSE 3000

# Run the compiled main.js
CMD ["node", "dist/apps/auth-service/main"]