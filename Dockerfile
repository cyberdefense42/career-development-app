# Use Node.js 18
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production=false

# Copy source code
COPY . .

# Build the React app with ESLint disabled
ENV DISABLE_ESLINT_PLUGIN=true
ENV CI=false
RUN npm run build

# Expose port
EXPOSE $PORT

# Start the server
CMD ["npm", "start"]