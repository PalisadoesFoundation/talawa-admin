## Steps to start the build with Docker 

### Project Setup

- Install [Docker](https://desktop.docker.com/win/stable/amd64/Docker%20Desktop%20Installer.exe?utm_source=docker&amp;utm_medium=webreferral&amp;utm_campaign=dd-smartbutton&amp;utm_location=module)

- Build and Tag The Docker Image 

``$ docker build -t sample:dev``

- Then Spin up the container once build is done 

```
$ docker run \
    -it \
    --rm \
    -v ${PWD}:/app \
    -v /app/node_modules \
    -p 3001:3000 \
    -e CHOKIDAR_USEPOLLING=true \
    sample:dev
```

- Whats Happening here 

1. The ``docker run`` command creates and runs a new conatiner instance from the image we just created 

2. ``-it`` starts the container in interactive mode

3. ``--rm`` removes the container and volumes after the container exists.

4. ``-v ${PWD}:/app`` mounts the code into the container at "/app".

5. Since we want to use the container version of the “node_modules” folder, we configured another volume: ``-v /app/node_modules`` . You should now be able to remove the local “node_modules” flavor.

6. ``-p 3001:3000`` exposes port 3000 to other Docker containers on the same network (for inter-container communication) and port 3001 to the host.

7. Finally , ``-e CHOKIDAR_USEPOLLING=true`` enables a polling mechanism via chokidar (which wraps ``fs.watch``, ``fs.watchFile``, and ``fsevents``) so that hot-reloading will work.

### For using compose file 

- Build the image and fire up the container 

`` $ docker-compose up -d --build ``

- Ensure the app is running in the browser and test hot - reloading again. Bring down the container before moving on 

``$ docker-compose stop``

- Now your container is ready to run




