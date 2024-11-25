
  # Stage 1: Build
  FROM node:20.10.0-alpine AS build
  
  # Set working directory
  WORKDIR /usr/src/app
  
  # Copy package files and install dependencies
  COPY package*.json ./ 
  RUN npm install
  
  # Copy source code and build
  COPY . . 
  RUN npm run build
  
  # Expose the specified port
  EXPOSE 4321
  
  # Start the application
  CMD ["npm", "run", "serve"]
  