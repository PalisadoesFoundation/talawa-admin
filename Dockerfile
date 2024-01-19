FROM node:20-alpine

WORKDIR /usr/src/app

COPY package* .

RUN npm install --legacy-peer-deps

COPY . .

EXPOSE 3000

CMD ["npm", "run", "serve"]
