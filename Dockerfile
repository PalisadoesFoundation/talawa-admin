FROM node:14

# install simple http server
RUN npm install -g http-server

# set working directory
WORKDIR /app

COPY package*.json ./

#install dependencies
RUN npm install

# copy project files
COPY . .


# build the project file
RUN npm run build


EXPOSE 8080

# serve the project file over a simple http server
# nginx reverse proxy will be added later
CMD [ "http-server", "dist" ]