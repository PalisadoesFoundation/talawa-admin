
FROM node:14


WORKDIR /usr/src/app


COPY package*.json ./


RUN npm install


RUN npm install @apollo/client@latest graphql@latest


COPY . .


RUN npm run build


EXPOSE 4321


CMD [ "npm", "run", "serve" ]
