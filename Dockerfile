# Production stage
FROM node:14-alpine as production

WORKDIR /app

COPY ./dist .
COPY package*.json ./

RUN npm install

# Expose the port your app will run on (if needed)
EXPOSE 3000

# Define the command to run your application
CMD ["npm", "run", "start:docker"]
