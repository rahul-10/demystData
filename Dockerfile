FROM node:16-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

ENV DEFAULT_TODO_COUNT 20
ENV DEFAULT_TODO_SOURCE https://jsonplaceholder.typicode.com/todos/_id
ENV MAX_COUNT_FOR_EVEN_TODO 100

CMD ["node", "src/index.js"]
