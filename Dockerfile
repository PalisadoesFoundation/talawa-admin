FROM node:20.10.0 AS build

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 4321

CMD ["npm", "run", "serve"]