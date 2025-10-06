# Use Node.js 24-slim image
FROM node:24-slim

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json .

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Expose port
EXPOSE 4173

# Run the app
CMD ["npm", "run", "start"]
