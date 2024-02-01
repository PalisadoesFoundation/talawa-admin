# Talawa-Admin Installation

This document provides instructions on how to set up and start a running instance of `talawa-admin` on your local system. The instructions are written to be followed in sequence so make sure to go through each of them step by step without skipping any sections.

# Table of Contents

<!-- toc -->

- [Prerequisites for Developers](#prerequisites-for-developers)
- [Installation](#installation)
  - [Setting up this repository](#setting-up-this-repository)
  - [Setting up npm](#setting-up-npm)
  - [Setting up Typescript](#setting-up-typescript)
  - [Installing required packages/dependencies](#installing-required-packagesdependencies)
- [Configuration](#configuration)
  - [Creating .env file](#creating-env-file)
  - [Setting up PORT in .env file](#setting-up-port-in-env-file)
  - [Setting up REACT_APP_TALAWA_URL in .env file](#setting-up-react_app_talawa_url-in-env-file)
  - [Setting up REACT_APP_RECAPTCHA_SITE_KEY in .env file](#setting-up-react_app_recaptcha_site_key-in-env-file)
  - [Setting up Compiletime and Runtime logs](#setting-up-compiletime-and-runtime-logs)
- [Post Configuration Steps](#post-configuration-steps)
  - [Running Talawa-Admin](#running-talawa-admin)
  - [Accessing Talawa-Admin](#accessing-talawa-admin)
  - [Talawa-Admin Registration](#talawa-admin-registration)
  - [Talawa-Admin Login](#talawa-admin-login)
- [Testing](#testing)
  - [Running tests](#running-tests)
  - [Debugging tests](#debugging-tests)
  - [Linting code files](#linting-code-files)
  - [Husky for Git Hooks](#husky-for-git-hooks)
      - [pre-commit hook](#pre-commit-hook)
      - [post-merge hook](#post-merge-hook)

<!-- tocstop -->

# Prerequisites for Developers

We recommend that you follow these steps before beginning development work on Talawa-Admin:

1. You need to have `nodejs` installed in your machine. We recommend using Node version greater than 20.0.0. You can install it either through [nvm](https://github.com/nvm-sh/nvm) (Node Version Manager) or by visiting the official [Nodejs](https://nodejs.org/download/release/v16.20.2/) website.
1. [Talawa-API](https://github.com/PalisadoesFoundation/talawa-api): (**This is mandatory**) The API system that the mobile app uses for accessing data. Setup your own **_local instance_**
1. [Talawa](https://github.com/PalisadoesFoundation/talawa): (Optional) The mobile app that people will use to access Talawa's features. This may be useful if you need to verify administrative features you have added or modified.

The INSTALLATION.md files in both repositories show you how. The Talawa-API INSTALLATION.md will also show you the Organization URL to use access Talawa Admin.

# Installation

You will need to have copies of your code on your local system. Here's how to do that.

## Setting up this repository

First you need a local copy of `talawa-admin`. Run the following command in the directory of choice on your local system.

1. Navigate to the folder where you want to setup the repository. Here, I will set it up in a folder called `talawa`.
2. Navigate to the folder and open a terminal in this folder (you can right-click and choose appropiate option based onn your OS). Next, we'll fork and clone the `talawa-admin` repository.
3. Navigate to [https://github.com/PalisadoesFoundation/talawa-admin/](hhttps://github.com/PalisadoesFoundation/talawa-admin/) and click on the `fork` button. It is placed on the right corner opposite the repository name `PalisadoesFoundation/talawa-admin`.
4. You should now see `talawa-admin` under your repositories. It will be marked as forked from `PalisadoesFoundation/talawa-admin`
5. Clone the repository to your local computer (replacing the values in `{{}}`):

```
$ git clone https://github.com/{{YOUR GITHUB USERNAME}}/talawa-admin.git
```

This will setup the repository and the code files locally for you. For more detailed instructions on contributing code, and managing the versions of this repository with Git, checkout [CONTRIBUTING.md here](./CONTRIBUTING.md)

**NOTE:** `All the commands we're going to execute in the following instructions will assume you are in the root directory of the cloned talawa-admin project. If you fail to do so, the commands will not work.`

## Setting up npm

Best way to install and manage `node.js` is making use of node version managers. Two most popular node version managers right now are [fnm](https://github.com/Schniz/fnm) and [nvm](https://github.com/nvm-sh/nvm). We'd recommend `fnm` because it's written in `rust` and is much faster than `nvm`. Install whichever one you want and follow their guide to set up `node.js` on your system.

## Setting up Typescript

As `talawa-admin` and `talawa-api` repositories are written using [Typescript](https://www.typescriptlang.org/), you will need to install typescript on your machine.
We recommend to install `Typescript` globally on your machine by running the following command in the terminal:

```
npm install -g typescript
```

For more details please refer to the installation guidelines provided in the [official docs](https://www.typescriptlang.org/download).

## Installing required packages/dependencies

Run the following command to install the packages and dependencies required by `talawa-admin`:

```
npm install
```

# Configuration

It's important to configure Talawa-Admin. Here's how to do it.

You can use our interactive setup script for the configuration. Use the following command for the same.

```
npm run setup
```

All the options in "setup" can be done manually as well and here's how to do it. - [Creating .env file](#creating-env-file)

## Creating .env file

A file named .env is required in the root directory of talawa-admin for storing environment variables used at runtime. It is not a part of the repo and you will have to create it. For a sample of `.env` file there is a file named `.env.example` in the root directory. Create a new `.env` file by copying the contents of the `.env.example` into `.env` file. Use this command:

```
cp .env.example .env
```

This `.env` file must be populated with the following environment variables for `talawa-admin` to work:

| Variable                     | Description                                       |
| ---------------------------- | ------------------------------------------------- |
| PORT                         | Custom port for Talawa-Admin development purposes |
| REACT_APP_TALAWA_URL         | URL endpoint for talawa-api graphql service       |
| REACT_APP_USE_RECAPTCHA      | Whether you want to use reCAPTCHA or not          |
| REACT_APP_RECAPTCHA_SITE_KEY | Site key for authentication using reCAPTCHA       |

Follow the instructions from the sections [Setting up PORT in .env file](#setting-up-port-in-env-file), [Setting up REACT_APP_TALAWA_URL in .env file](#setting-up-REACT_APP_TALAWA_URL-in-env-file), [Setting up REACT_APP_RECAPTCHA_SITE_KEY in .env file](#setting-up-REACT_APP_RECAPTCHA_SITE_KEY-in-env-file) and [Setting up Compiletime and Runtime logs](#setting-up-compiletime-and-runtime-logs) to set up these environment variables.

## Setting up PORT in .env file

Add a custom port number for Talawa-Admin development purposes to the variable named `PORT` in the `.env` file.

## Setting up REACT_APP_TALAWA_URL in .env file

Add the endpoint for accessing talawa-api graphql service to the variable named `REACT_APP_TALAWA_URL` in the `.env` file.

```
REACT_APP_TALAWA_URL="http://API-IP-ADRESS:4000/graphql/"
```

If you are a software developer working on your local system, then the URL would be:

```
REACT_APP_TALAWA_URL="http://localhost:4000/graphql/"
```

For additional details, please refer to to the `How to Access the Talawa-API URL` section in the INSTALLATION.md file found in the [Talawa-API repo](https://github.com/PalisadoesFoundation/talawa-api).

## Setting up REACT_APP_RECAPTCHA_SITE_KEY in .env file

You may not want to setup reCAPTCHA since the project will still work. Moreover, it is recommended to not set it up in development environment.

Just skip to the [Post Configuration Steps](#post-configuration-steps) if you don't want to set it up. Else, read the following steps.

If you want to setup Google reCAPTCHA now, you may refer to to the `RECAPTCHA` section in the INSTALLATION.md file found in [Talawa-API repo](https://github.com/PalisadoesFoundation/talawa-api).

`Talawa-admin` needs the `reCAPTCHA site key` for the `reCAPTCHA` service you set up during `talawa-api` installation as shown in this screenshot:

![reCAPTCHA site key](./public/images/REACT_SITE_KEY.webp)

Copy/paste this `reCAPTCHA site key` to the variable named `REACT_APP_RECAPTCHA_SITE_KEY` in `.env` file.

```
REACT_APP_RECAPTCHA_SITE_KEY="this_is_the_recaptcha_key"
```

## Setting up Compiletime and Runtime logs

Set the `ALLOW_LOGS` to "YES" if you want warnings , info and error messages in your console or leave it blank if you dont need them or want to keep the console clean

# Post Configuration Steps

It's now time to start Talawa-Admin and get it running

## Running Talawa-Admin

Run the following command to start `talawa-admin` development server:

```
npm run serve
```

## Accessing Talawa-Admin

By default `talawa-admin` runs on port `4321` on your system's localhost. It is available on the following endpoint:

```
http://localhost:4321/
```

If you have specified a custom port number in your `.env` file, Talawa-Admin will run on the following endpoint:

```
http://localhost:${{customPort}}/
```

Replace `${{customPort}}` with the actual custom port number you have configured in your `.env` file.

## Talawa-Admin Registration

The first time you navigate to the running talawa-admin's website you'll land at talawa-admin registration page. Sign up using whatever credentials you want and create the account. Make sure to remember the email and password you entered because they'll be used to sign you in later on.

## Talawa-Admin Login

Now sign in to talawa-admin using the `email` and `password` you used to sign up.

# Testing

It is important to test our code. If you are a contributor, please follow these steps.

## Running tests

You can run the tests for `talawa-admin` using this command:

```
npm run test
```

## Debugging tests

You can see the output of failing tests in broswer by running `jest-preview` package before running your tests

```
npm run jest-preview
npm run test
```

You don't need to re-run the `npm run jest-preview` command each time, simply run the `npm run test` command if the Jest Preview server is already running in the background, it'll automatically detect any failing tests and show the preview at `http://localhost:3336` as shown in this screenshot -

![Debugging Test Demo](./public/images/jest-preview.webp)

## Linting code files

You can lint your code files using this command:

```
npm run lint:fix
```

## Husky for Git Hooks

We are using the package `Husky` to run git hooks that run according to different git workflows.

#### pre-commit hook

We run a pre-commit hook which automatically runs code quality checks each time you make a commit and also fixes some of the issues. This way you don't have to run them manually each time.

If you don't want these pre-commit checks running on each commit, you can manually opt out of it using the `--no-verify` flag with your commit message as shown:-

        git commit -m "commit message" --no-verify

#### post-merge hook

We are also running a post-merge(post-pull) hook which will automatically run "npm install" only if there is any change made to pakage.json file so that the developer has all the required dependencies when pulling files from remote.

If you don't want this hook to run, you can manually opt out of this using the `no verify` flag while using the merge command(git pull):

        git pull --no-verify

<br/>
