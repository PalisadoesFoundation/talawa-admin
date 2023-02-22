# Talawa-admin installation

This document provides instructions on how to set up and start a running instance of `talawa-admin` on your local system. The instructions are written to be followed in sequence so make sure to go through each of them step by step without skipping any sections.

<br/>

# Table of contents

- [Talawa-admin installation](#talawa-admin-installation)
- [Table of contents](#table-of-contents)
  - [Set up talawa-api](#set-up-talawa-api)
  - [Clone this repository](#clone-this-repository)
  - [Change directory into the cloned repo](#change-directory-into-the-cloned-repo)
  - [Creating .env file](#creating-env-file)
  - [Setting up REACT\_APP\_TALAWA\_URL in .env file](#setting-up-react_app_talawa_url-in-env-file)
  - [Setting up REACT\_APP\_RECAPTCHA\_SITE\_KEY in .env file](#setting-up-react_app_recaptcha_site_key-in-env-file)
  - [Setting up yarn](#setting-up-yarn)
  - [Installing required packages/dependencies](#installing-required-packagesdependencies)
  - [Running talawa-admin](#running-talawa-admin)
  - [Accessing talawa-admin](#accessing-talawa-admin)
  - [Sign up on talawa-admin](#sign-up-on-talawa-admin)
  - [Sign in to talawa-admin](#sign-in-to-talawa-admin)
  - [Running tests](#running-tests)
  - [Linting code files](#linting-code-files)
  - [Setting up Talawa-Admin and API for Talawa App](#setting-up-talawa-admin-and-api-for-talawa-app)
    - [On Your Local Machine](#on-your-local-machine)

<br/>

## Set up talawa-api

Talawa-admin needs URL endpoint to a running instance of `talawa-api` graphql service to perform its operations. You need to set up a local instance of talawa-api on your system.

Follow the instructions in the INSTALLATION.md file of the [Talawa-API repo](https://github.com/PalisadoesFoundation/talawa-api) to set it up.

<br/>

## Clone this repository

First you need a local copy of `talawa-admin`. Run the following command in the directory of choice on your local system.

    git clone https://github.com/PalisadoesFoundation/talawa-admin

This will download a local copy of `talawa-admin` in that directory.

## Change directory into the cloned repo

Right after cloning the repo you can change the directory of your current `terminal(shell)` to the root directory of cloned repository using this command:-

    cd ./talawa-admin

**NOTE:-** `All the commands we're going to execute in the following instructions will assume you are in the root directory of the cloned talawa-admin project. If you fail to do so, the commands will not work.`

## Creating .env file

A file named .env is required in the root directory of talawa-admin for storing environment variables used at runtime. It is not a part of the repo and you will have to create it. For a sample of `.env` file there is a file named `.env.sample` in the root directory. Create a new `.env` file by copying the contents of the `.env.sample` into `.env` file. Use this command:-

    cp .env.example .env

This `.env` file must be populated with the following environment variables for `talawa-admin` to work:-

| Variable                     | Description                                 |
| ---------------------------- | ------------------------------------------- |
| REACT_APP_TALAWA_URL         | URL endpoint for talawa-api graphql service |
| REACT_APP_RECAPTCHA_SITE_KEY | Site key for authentication using reCAPTCHA |

Follow the instructions from section [Setting up REACT_APP_TALAWA_URL in .env file](#setting-up-REACT_APP_TALAWA_URL-in-env-file) up to and including section [Setting up REACT_APP_RECAPTCHA_SITE_KEY in .env file](#setting-up-REACT_APP_RECAPTCHA_SITE_KEY-in-env-file) to set up these environment variables.

<br/>

## Setting up REACT_APP_TALAWA_URL in .env file

Refer to to the `REACT_APP_TALAWA_URL` section in the INSTALLATION.md file found in the [Talawa-API repo](https://github.com/PalisadoesFoundation/talawa-api).

Copy/paste the endpoint for accessing talawa-api graphql service to the variable named `REACT_APP_TALAWA_URL` in `.env` file.

    REACT_APP_TALAWA_URL="http://localhost:4000/graphql/"

<br/>

## Setting up REACT_APP_RECAPTCHA_SITE_KEY in .env file

Refer to to the `RECAPTCHA` section in the INSTALLATION.md file found in [Talawa-API repo](https://github.com/PalisadoesFoundation/talawa-api).


`Talawa-admin` needs the `reCAPTCHA site key` for the `reCAPTCHA` service you set up during `talawa-api` installation as shown in this screenshot:-

![reCAPTCHA site key](./public/REACT_SITE_KEY.webp)

Copy/paste this `reCAPTCHA site key` to the variable named `REACT_APP_RECAPTCHA_SITE_KEY` in `.env` file.

    REACT_APP_RECAPTCHA_SITE_KEY="this_is_the_recaptcha_key"

<br/>

## Setting up yarn

If you've followed the previous steps you should have already set up node.js on your system. [Click here](https://yarnpkg.com/getting-started/install) for the official setup guide for yarn.

<br/>

## Installing required packages/dependencies

Run the following command to install the packages and dependencies required by `talawa-admin`:-

        yarn

<br/>

## Running talawa-admin

Run the following command to start `talawa-admin` development server:-

        yarn serve

<br/>

## Accessing talawa-admin

By default `talawa-admin` runs on port `3000` on your system's localhost. It is available on the following endpoint:-

        http://localhost:3000/

<br/>

## Sign up on talawa-admin

The first time you navigate to the running talawa-admin's website you'll land at talawa-admin sign up page. Sign up using whatever credentials you want and create the account. Make sure to remember the email and password you entered because they'll be used to sign you in later on.

<br/>

## Sign in to talawa-admin

Now sign in to talawa-admin using the `email` and `password` you used to sign up.

<br/>

## Running tests

You can run the tests for `talawa-admin` using this command:-

    yarn test

<br/>

## Linting code files

You can lint your code files using this command:-

    yarn lint

## Setting up Talawa-Admin and API for Talawa App

Talawa mobile app requires [talawa-api](https://github.com/PalisadoesFoundation/talawa-api) running locally or remotely, which will be used as an `organisation url`.

### On Your Local Machine

You need to setup your own local instance of [Talawa-API](https://github.com/PalisadoesFoundation/talawa-api) and [Talawa-admin](https://github.com/PalisadoesFoundation/talawa-admin). The advantage is that you'll be working with the latest code.

1. You need to first setup the 2 supporting projects locally. Please refer the INSTALLATION.md of the respective repository for further guidance.
   1. [Talawa-API repo](https://github.com/PalisadoesFoundation/talawa-api)
   2. [Talawa-ADMIN repo](https://github.com/PalisadoesFoundation/talawa-admin)
   
* Install [talawa](https://github.com/PalisadoesFoundation/talawa) Please refer the INSTALLATION.md of the respective repository for further guidance
    - Then use the URL (Organization URL) in this form:
    - http://(IP-address):4000/graphql (See the below example)
    - Example : http://10.0.2.2:4000/graphql
  
        




