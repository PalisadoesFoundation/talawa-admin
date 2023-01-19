# Talawa-admin installation

This document provides instructions on how to set up and start a running instance of `talawa-admin` on your local system. The instructions are written to be followed in sequence so make sure to go through each of them step by step without skipping any sections.

<br/>

# Table of contents

1. [Set up talawa-api](#set-up-talawa-api)
2. [Clone this repository](#clone-this-repository)
3. [Change directory into the cloned repo](#change-directory-into-the-cloned-repo)
4. [Creating .env file](#creating-env-file)
5. [Setting up REACT_APP_BACKEND_ENDPOINT in .env file](#setting-up-react_app_backend_endpoint-in-env-file)
6. [Setting up REACT_APP_RECAPTCHA_KEY in .env file](#setting-up-react_app_recaptcha_key-in-env-file)
7. [Setting up yarn](#setting-up-yarn)
8. [Installing required packages/dependencies](#installing-required-packagesdependencies)
9. [Running talawa-admin](#running-talawa-admin)
10. [Accessing talawa-admin](#accessing-talawa-admin)
11. [Elevate the permissions for created account](#elevate-the-permissions-for-created-account)
12. [Sign in to talawa-admin](#sign-in-to-talawa-admin)
13. [Running tests](#running-tests)
14. [Linting code files](#linting-code-files)

<br/>

## Set up talawa-api

Talawa-admin needs URL endpoint to a running instance of `talawa-api` graphql service to perform its operations. You need to set up a local instance of talawa-api on your system.

Follow the [installation guide](https://github.com/PalisadoesFoundation/talawa-api/blob/develop/INSTALLATION.md) on talawa-api repo to set it up.

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

    cp .env.sample .env

This `.env` file must be populated with the following environment variables for `talawa-admin` to work:-

| Variable                   | Description                                 |
| -------------------------- | ------------------------------------------- |
| REACT_APP_BACKEND_ENDPOINT | URL endpoint for talawa-api graphql service |
| REACT_APP_RECAPTCHA_KEY    | Site key for authentication using reCAPTCHA |

Follow the instructions from section [Setting up REACT_APP_BACKEND_ENDPOINT in .env file](#setting-up-react_app_backend_endpoint-in-env-file) up to and including section [Setting up REACT_APP_RECAPTCHA_KEY in .env file](#setting-up-react_app_recaptcha_key-in-env-file) to set up these environment variables.

<br/>

## Setting up REACT_APP_BACKEND_ENDPOINT in .env file

Copy/paste the endpoint for [accessing](https://github.com/PalisadoesFoundation/talawa-api/blob/develop/INSTALLATION.md#accessing-talawa-api) talawa-api graphql service to the variable named `REACT_APP_BACKEND_ENDPOINT` in `.env` file.

    REACT_APP_BACKEND_ENDPOINT="http://localhost:4000/graphql/"

<br/>

## Setting up REACT_APP_RECAPTCHA_KEY in .env file

Make sure to go through [this](https://github.com/PalisadoesFoundation/talawa-api/blob/develop/INSTALLATION.md#setting-up-recaptcha_secret_key-in-env-file) section on `talawa-api's` installation docs.

`Talawa-admin` needs the `reCAPTCHA site key` for the `reCAPTCHA` service you set up during `talawa-api` installation as shown in this screenshot:-

![reCAPTCHA site key](https://github.com/PalisadoesFoundation/talawa-api/blob/develop/image/recaptcha_secret.webp)

Copy/paste this `reCAPTCHA site key` to the variable named `REACT_APP_RECAPTCHA_KEY` in `.env` file.

    REACT_APP_RECAPTCHA_KEY="this_is_the_recaptcha_key"

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

## Elevate the permissions for created account

You have to manually elevate your account's permissions to make it `admin approved` and make it have `SUPERADMIN` privileges. 

For the account you created:-

1. Set `adminApproved` field to `true`:-

        adminApproved: true
    
2. Set `userType` field to `SUPERADMIN`:-

        userType: "SUPERADMIN"

<br/>

## Sign in to talawa-admin

Now sign in to talawa-admin using the `email` and `password` you used to sign up.

## Running tests

You can run the tests for `talawa-admin` using this command:-

    yarn test

<br/>

## Linting code files

You can lint your code files using this command:-

    yarn lint
