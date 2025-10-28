# Node.js Runtime
FROM node:22-alpine

# Working Directory
WORKDIR /app

# Copy package.json and package-lock.json files to the Container
COPY package*.json .

# Install Dependecies
RUN npm install

# Copy the Rest of the application
COPY . .


# Port on wiche the app runs
EXPOSE 8000

# Run the application
CMD ["node", "./src/server.js"]
