---
id: installation
title: Installation
slug: /installation
sidebar_position: 1
---

Installation is not difficult, but there are many steps. This is a brief explanation of what needs to be done:

1. Install `git`
2. Download the code from GitHub using `git`
3. Install `node.js` (Node), the runtime environment the application will need to work.
4. Configure the Node Package Manager (`pnpm`) to automatically use the correct version of Node for our application.
5. Use `pnpm` to install TypeScript, the language the application is written in.
6. Install other supporting software such as the database.
7. Configure the application
8. Start the application

These steps are explained in more detail in the sections that follow.

## Prerequisites

In this section we'll explain how to set up all the prerequisite software packages to get you up and running.

### Install git

The easiest way to get the latest copies of our code is to install the `git` package on your computer.

Follow the setup guide for `git` on official [git docs](https://git-scm.com/downloads). Basic `git` knowledge is required for open source contribution so make sure you're comfortable with it. [Here's](https://youtu.be/apGV9Kg7ics) a good tutorial to get started with `git` and `github`.

### Setting up this repository

First you need a local copy of `talawa-admin`. Run the following command in the directory of choice on your local system.

1. On your computer, navigate to the folder where you want to setup the repository.
2. Open a `cmd` (Windows) or `terminal` (Linux or MacOS) session in this folder.
   1. An easy way to do this is to right-click and choose appropriate option based on your OS.

The next steps will depend on whether you are an end user installalling our software, or one of our open source contributors.

#### For Talawa Administrator End Users

Clone the repository to your local computer using this command:

```bash
$ git clone https://github.com/PalisadoesFoundation/talawa-admin.git
```

Proceed to the next section.
   
#### For Our Open Source Contributor Software Developers

Follow these steps carefully in forking and cloning the `talawa-admin` repository.

   1. Follow the steps in our [Git Guide for Developers](https://developer.palisadoes.org/docs/git-guide/introduction/quickstart)
   2. As a developer you will be working with our `develop` branch.
   1. You will    now have a local copy of the code files.
   1. For more detailed instructions on contributing code, please review the following documents in the root directory of the code:
      1. CONTRIBUTING.md
      2. CODE_OF_CONDUCT.md
      3. CODE_STYLE.md
      4. DOCUMENTATION.md
      5. INSTALLATION.md
      6. ISSUE_GUIDELINES.md
      7. PR_GUIDELINES.md

Proceed to the next section.

### Install node.js

The best way to install and manage `node.js` is making use of node version managers. We recommend using `fnm`, which will be described in more detail later.

Follow these steps to install the `node.js` packages in Windows, Linux and MacOS.

#### For Windows Users

Follow these steps:

1. Install `node.js` from their website at https://nodejs.org
   1. When installing, don't click the option to install the `necessary tools`. These are not needed in our case.
2. Install [fnm](https://github.com/Schniz/fnm). Please read all the steps in this section first.
   1. All the commands listed on this page will need to be run in a Windows terminal session in the `talawa-admin` directory.
   2. Install `fnm` using the `winget` option listed on the page.
   3. Setup `fnm` to automatically set the version of `node.js` to the version required for the repository using these steps:
      1. Refer to the `Shell Setup` section of the `fnm` site's installation page for recommendations.
      2. Open a `Windows PowerShell` terminal window
      3. Run the recommended `Windows PowerShell` command to open `notepad`.
      4. Paste the recommended string into `notepad`
      5. Save the document.
      6. Exit `notepad`
      7. Exit PowerShell
      8. This will ensure that you are always using the correct version of `node.js`

Proceed to the next section.

#### For Linux and MacOS Users

Follow these steps:

1. Install `node.js` from their website at https://nodejs.org
2. Install [fnm](https://github.com/Schniz/fnm).
   1. Refer to the `Shell Setup` section of the `fnm` site's installation page for recommendations.
   2. Run the respective recommended commands to setup your node environment
   3. This will ensure that you are always using the correct version of `node.js`

Proceed to the next section.

### Install pnpm

The application uses `pnpm` to manage the various `node.js` packages that need to be installed.

Install `pnpm` from the [pnpm website](https://pnpm.io/installation)

### Install TypeScript

TypeScript is a typed superset of JavaScript that compiles to plain JavaScript. It adds optional types, classes, and modules to JavaScript, and supports tools for large-scale JavaScript applications.

To install TypeScript, you can use the `pnpm` command:

```bash
pnpm install -g typescript
```

This command installs TypeScript globally on your system so that it can be accessed from any project.

### Install The Required Packages

Run the following command to install the packages and dependencies required by the app:

```
pnpm install
```

The prerequisites are now installed. The next step will be to get the app up and running.

## Installation using Docker

Docker is used to build, deploy, and manage applications within isolated, lightweight containers, effectively packaging an application with all its dependencies so it can run consistently across different environments, allowing for faster development, testing, and deployment of software.

We use it to simplify installation

### Prerequisites

Follow these steps to install Docker on your system:

1. The steps are different for Windows/Mac versus Linux users:

   1. [Docker Desktop for Windows/Mac](https://www.docker.com/products/docker-desktop)
   2. [Docker Engine for Linux](https://docs.docker.com/engine/install/)

1. You must ensure that docker is running for the Talawa-Admin application to work correctly.

You now need to setup the environment. This follows next.

#### Development Setup

If you prefer to use Docker, you can install the app using the following command:

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

#### Production Setup

If you prefer to use Docker, you can install the app using the following command:

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
