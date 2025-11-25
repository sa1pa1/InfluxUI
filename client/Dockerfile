# Client Dockerfile
FROM node:20.14.0-alpine

# Set working directory
WORKDIR /usr/src/app/

# Copy and install dependencies
COPY package*.json ./
RUN npm install

COPY . .

# Build the app to create /dist files
RUN npm run build

# Run a basic lint check
RUN npm run lint -- --max-warnings 0

EXPOSE 5000

CMD ["npm", "run", "dev"]