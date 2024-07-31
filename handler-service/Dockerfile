FROM node:latest

WORKDIR /usr/src/handler-service

COPY package*.json ./
COPY . .

RUN npm install

EXPOSE 3001

CMD ["npm", "run", "dev"]