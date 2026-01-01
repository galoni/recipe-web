FROM node:20-slim

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the application (for production it would be npm run build, but for now we run dev)
# In docker-compose we override the command to 'npm run dev'

EXPOSE 3000

CMD ["npm", "run", "dev"]
