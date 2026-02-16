# Stage 1: Build the React app
FROM node:22-alpine AS build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Pass environment variables during build time
ARG VITE_AUTH_SERVICE_URL
ARG VITE_USER_SERVICE_URL
ENV VITE_AUTH_SERVICE_URL=$VITE_AUTH_SERVICE_URL
ENV VITE_USER_SERVICE_URL=$VITE_USER_SERVICE_URL

RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:stable-alpine
# Copy built files from stage 1
COPY --from=build-stage /app/dist /usr/share/nginx/html
# Copy a custom nginx config if you have one, or use default
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]