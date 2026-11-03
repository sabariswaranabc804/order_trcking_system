# -----------------------------
# Stage 1: Build React App
# -----------------------------
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (ignore peer dependency conflicts)
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Build the React app (Vite outputs to /dist)
RUN npm run build

# -----------------------------
# Stage 2: Serve with NGINX
# -----------------------------
FROM nginx:alpine

# Remove default nginx static files
RUN rm -rf /usr/share/nginx/html/*

# Copy built app from previous stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]
