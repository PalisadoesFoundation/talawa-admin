
FROM node:lts


WORKDIR /usr/src/app


COPY package*.json ./


RUN npm install && npm install @apollo/client@latest graphql@latest


COPY . .


RUN npm run build


EXPOSE 4321


CMD [ "npm", "run", "serve" ]

