# Dockerfile for React Frontend

# Use an official Node runtime as a parent image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Expose the port (default for Vite)
EXPOSE 3000

# Start the application
CMD ["npm", "run", "serve"]
