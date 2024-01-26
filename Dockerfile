FROM node:lts

WORKDIR /usr/src/app

COPY package* .

RUN npm install --legacy-peer-deps

COPY . .

EXPOSE $PORT

CMD ["npm", "run", "serve"]
