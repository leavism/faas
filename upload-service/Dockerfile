FROM node:latest

WORKDIR /usr/src/upload-service

COPY package*.json ./
COPY . .

RUN npm install

EXPOSE 3000

CMD ["npm", "run", "dev"]