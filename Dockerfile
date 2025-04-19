# Use Node.js 18 as the base image
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Install system dependencies
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy app source
COPY . .

# Set environment to production
ENV NODE_ENV=production

# Create volume for persistent data
VOLUME [ "/usr/src/app/data" ]

# Start the bot
CMD [ "node", "index.js" ]
