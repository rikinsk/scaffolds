FROM node:carbon

WORKDIR /ts-app

COPY package*.json ./

RUN npm ci

COPY . .

CMD ["npm", "start"]

