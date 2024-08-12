FROM node:lts

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install \
    && npm install @apollo/client@latest graphql@latest \
    && npm uninstall react react-dom \
    && npm install react@latest react-dom@latest \
    && npm install --save-dev @types/react @types/react-dom \
    && npm install --save react-toastify@latest

COPY . .


RUN npm run build


EXPOSE 4321


CMD [ "npm", "run", "serve" ]