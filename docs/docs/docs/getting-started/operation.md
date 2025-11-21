---
id: operation
title: Operation
slug: /operation
sidebar_position: 3
---

This page outlines how to successfully operate the application


## Operation Using Docker

Docker is used to build, deploy, and manage applications within isolated, lightweight containers, effectively packaging an application with all its dependencies so it can run consistently across different environments, allowing for faster development, testing, and deployment of software.

We use it to simplify installation

### Prerequisites

Follow these steps to install Docker on your system:

1. The steps are different for Windows/Mac versus Linux users:

   1. [Docker Desktop for Windows/Mac](https://www.docker.com/products/docker-desktop)
   2. [Docker Engine for Linux](https://docs.docker.com/engine/install/)

1. You must ensure that docker is running for the Talawa-Admin application to work correctly.

The next steps will depend on whether you are:

1. an end user installing our software (Production Environments) or 
2. one of our open source contributors (Development Environments).

Please follow them closely.

#### For Production Environments

This section describes how to setup the application in a production environment.

1. Create a `.env` file as described in the [Configuration Guide](./configuration.md)

2. Configure `nginx.conf` file located at `config/docker/setup`. Modify it to fit your preferences before running the application.

3. Build and Run the Docker Image:

   Run the following command to run the Docker image:

   ```bash
   docker-compose -f docker/docker-compose.prod.yaml --env-file .env up
   ```

4. To stop the container run the following command:

   ```bash
   docker-compose -f docker/docker-compose.prod.yaml down
   ```

The application will be accessible at `http://localhost:4321`

#### For Development Environments

This section describes how to setup the application in a development  environment.

1. Create a `.env` file as described in the [Configuration Guide](./configuration.md)

2. Build and Run the Docker Image:

   Run the following command to run the Docker image:

   ```bash
   docker-compose -f docker/docker-compose.dev.yaml --env-file .env up
   ```

3. To stop the container run the following command:

   ```bash
   docker-compose -f docker/docker-compose.dev.yaml down
   ```

The application will be accessible at `http://localhost:4321`


## Operation Without Docker

If you are running Talawa-Admin natively then the next steps will depend on whether you are:

1. an end user installing our software (Production Environments) or 
2. one of our open source contributors (Development Environments).

Please follow them closely.

#### For Production Environments

Run the following command to start the development server:

```bash
pnpm run serve

```

#### For Development Environments

Run the following command to start the production server:

```bash
pnpm run serve &

```


