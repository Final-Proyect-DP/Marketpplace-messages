# Use the official Node.js image as the base image
FROM node:16

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Copy the .env file
COPY .env .env

# Expose the port the app runs on
EXPOSE 4000

# Start the application
CMD ["node", "server/server.js"]