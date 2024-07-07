FROM node:20.10.0 AS build

WORKDIR /usr/src/app

COPY . .

RUN npm install -g typescript

RUN npm install

RUN npm run build

EXPOSE 4321

CMD ["npm", "run", "serve"]