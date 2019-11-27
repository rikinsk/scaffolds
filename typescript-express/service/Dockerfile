FROM node:carbon

WORKDIR /ts-app

COPY package*.json ./

# Remove comment when using npm start
# RUN npm ci

COPY . .

CMD ["npm", "run", "dev"]

