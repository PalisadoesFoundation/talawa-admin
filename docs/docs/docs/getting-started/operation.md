---
id: operation
title: Operation
slug: /operation
sidebar_position: 3
---

This page outlines how to successfully operate the application

## Configuration Pre-Requisites

You will first need to create a `.env` file as described in the [Configuration Guide](./configuration.md)

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

### For Production Environments

This section describes how to setup the application in a production environment.

1. Configure `nginx.conf` file located at `config/docker/setup`. Modify it to fit your preferences before running the application.

#### Starting The Application

To start the application you will need to build, then run the Docker Image. These steps follow:

1. **Windows Systems:**
   1. Run the following command to first build the Docker image:

      ```bash
      docker-compose -f docker/docker-compose.prod.yaml build
      ```

   2. Run the following command to run the Docker image:

      ```bash
      docker-compose -f docker/docker-compose.prod.yaml --env-file .env up -d
      ```

      For troubleshooting purposes, you can run docker in interactive mode to directly see the logs by removing the `-d` at the end.

   3. The application will be accessible at
      ```
      http://localhost:4321
      ```

2. **Linux Systems:**
   1. Run the following command to first build the Docker image:

      ```bash
      docker compose -f docker/docker-compose.prod.yaml build
      ```

   2. Run the following command to run the Docker image:

      ```bash
      docker compose -f docker/docker-compose.prod.yaml --env-file .env up -d
      ```

      For troubleshooting purposes, you can run docker in interactive mode to directly see the logs by removing the `-d` at the end.

   3. The application will be accessible at
      ```
      http://localhost:4321
      ```

#### Stopping The Application

To stop the container run the following command:

1. **Windows Systems:** Run the following command to stop the Docker image:

   ```bash
   docker-compose -f docker/docker-compose.prod.yaml down
   ```

1. **Linux Systems:** Run the following command to stop the Docker image:

   ```bash
   docker compose -f docker/docker-compose.prod.yaml down
   ```

### For Development Environments

This section describes how to setup the application in a development environment.

#### Starting The Application

To start the application you will need to build, then run the Docker Image. These steps follow:

1. **Windows Systems:**
   1. Run the following command to first build the Docker image:

      ```bash
      docker-compose -f docker/docker-compose.dev.yaml build
      ```

   2. Run the following command to run the Docker image:

      ```bash
      docker-compose -f docker/docker-compose.dev.yaml --env-file .env up -d
      ```

      For troubleshooting purposes, you can run docker in interactive mode to directly see the logs by removing the `-d` at the end.

   3. The application will be accessible at
      ```
      http://localhost:4321
      ```

2. **Linux Systems:**
   1. Run the following command to first build the Docker image:

      ```bash
      docker compose -f docker/docker-compose.dev.yaml build
      ```

   2. Run the following command to run the Docker image:

      ```bash
      docker compose -f docker/docker-compose.dev.yaml --env-file .env up -d
      ```

      For troubleshooting purposes, you can run docker in interactive mode to directly see the logs by removing the `-d` at the end.

   3. The application will be accessible at
      ```
      http://localhost:4321
      ```

#### Stopping The Application

To stop the container run the following command:

1. **Windows Systems:** Run the following command to stop the Docker image:

   ```bash
   docker-compose -f docker/docker-compose.dev.yaml down
   ```

1. **Linux Systems:** Run the following command to stop the Docker image:

   ```bash
   docker compose -f docker/docker-compose.dev.yaml down
   ```

## Operation Without Docker

If you are running Talawa-Admin natively then the next steps will depend on whether you are:

1. an end user installing our software (Production Environments) or
2. one of our open source contributors (Development Environments).

Please follow them closely.

### For Production Environments

Follow these steps if you are running the app in a production environment without Docker.

#### Starting The Application

Run the following command to start the production server:

```bash
pnpm run serve &
```

#### Stopping The Application

Since the production server runs in the background, you need to find and stop the process:

1. Find the process ID:

   ```bash
   pgrep -f "pnpm run serve"
   ```

2. Stop the process using the process ID from step 1:

   ```bash
   kill <process_id>
   ```

   Replace `<process_id>` with the actual process ID number.

Alternatively, you can use a single command:

```bash
pkill -f "pnpm run serve"
```

### For Development Environments

Follow these steps if you are running the app in a development environment without Docker.

#### Starting The Application

Run the following command to start the development server:

```bash
pnpm run serve
```

The app will run until you hit: 

```
<CTRL-C>
```



