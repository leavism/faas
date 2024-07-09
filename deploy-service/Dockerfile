FROM node:latest

WORKDIR /usr/src/deploy-service

COPY package*.json ./
COPY . .

RUN npm install

CMD ["npm", "run", "dev"]