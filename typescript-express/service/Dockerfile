FROM node:carbon

WORKDIR /app

COPY ./package*.json ./

RUN npm ci

COPY ./* ./

CMD ["npm", "start"]

