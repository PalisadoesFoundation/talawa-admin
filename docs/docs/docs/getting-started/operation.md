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

To do.

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
<!-- add -->

## Stopping the Application (Non-Docker Production Server)

When running Talawa Admin in a non-Docker production environment, you have several options to stop the application depending on how it was started.

### Method 1: If Running in Terminal Foreground

If you started the application directly in your terminal window:

```bash
# Simply press Ctrl+C in the terminal
Ctrl + C
```

This sends a SIGINT signal to gracefully stop the Node.js process.

### Method 2: Using PM2 Process Manager

If you're using PM2 to manage your application:

```bash
# Stop the application
pm2 stop talawa-admin

# Stop and remove from PM2 process list
pm2 delete talawa-admin

# Stop all PM2 processes
pm2 stop all

# View all running processes
pm2 list

# View detailed process information
pm2 show talawa-admin
```

### Method 3: Using systemd Service (Linux)

If you configured Talawa Admin as a systemd service:

```bash
# Stop the service
sudo systemctl stop talawa-admin

# Check service status
sudo systemctl status talawa-admin

# Disable service from starting automatically on boot
sudo systemctl disable talawa-admin

# Stop and disable in one command
sudo systemctl disable --now talawa-admin
```

### Method 4: Using NSSM (Windows Service)

If you're running as a Windows service using NSSM:

```cmd
# Stop the service
nssm stop talawa-admin

# Check service status
nssm status talawa-admin

# Remove the service completely
nssm remove talawa-admin confirm
```

### Method 5: Finding and Killing the Process Manually

If you're unsure how the application was started:

**On Windows:**
```cmd
# Find the process using the application port (e.g., 4321)
netstat -ano | findstr :4321

# Note the PID (Process ID) from the output, then kill it
taskkill /PID <PID> /F

# Example:
taskkill /PID 12345 /F
```

**On Linux/Mac:**
```bash
# Find the process using the port
lsof -i :4321

# Kill the process using its PID
kill -9 <PID>

# Or find and kill Node processes
pkill -f "node.*talawa"
```

### Verifying the Application Has Stopped

After stopping the application, verify it's no longer running:

**Windows:**
```cmd
netstat -ano | findstr :4321
# Should return nothing if stopped successfully
```

**Linux/Mac:**
```bash
lsof -i :4321
# Should return nothing if stopped successfully

# Or check for Node processes
ps aux | grep talawa
```

### Important Notes

- Always use graceful shutdown methods (Ctrl+C, PM2 stop, systemctl stop) before resorting to force kill
- If using a process manager like PM2, always use PM2 commands to maintain proper process tracking
- Make sure to stop any related services (like MongoDB, Redis) if they were started separately
- Check that no zombie processes remain after stopping the application
