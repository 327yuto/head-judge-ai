FROM node:20-alpine

WORKDIR /app

# Install dependencies for better performance
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci || npm install

# Copy application files
COPY . .

# Expose port
EXPOSE 3015

# Start the application
CMD ["npm", "run", "dev"]