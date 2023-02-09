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
  - [Elevate the permissions for created account](#elevate-the-permissions-for-created-account)
  - [Sign in to talawa-admin](#sign-in-to-talawa-admin)
  - [Running tests](#running-tests)
  - [Linting code files](#linting-code-files)
  - [Setting up Talawa-Admin and API for Talawa App](#setting-up-talawa-admin-and-api-for-talawa-app)
    - [On Your Local Machine](#on-your-local-machine)

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

    cp .env.example .env

This `.env` file must be populated with the following environment variables for `talawa-admin` to work:-

| Variable                     | Description                                 |
| ---------------------------- | ------------------------------------------- |
| REACT_APP_TALAWA_URL         | URL endpoint for talawa-api graphql service |
| REACT_APP_RECAPTCHA_SITE_KEY | Site key for authentication using reCAPTCHA |

Follow the instructions from section [Setting up REACT_APP_TALAWA_URL in .env file](#setting-up-REACT_APP_TALAWA_URL-in-env-file) up to and including section [Setting up REACT_APP_RECAPTCHA_SITE_KEY in .env file](#setting-up-REACT_APP_RECAPTCHA_SITE_KEY-in-env-file) to set up these environment variables.

<br/>

## Setting up REACT_APP_TALAWA_URL in .env file

Make sure to go through [this](https://github.com/PalisadoesFoundation/talawa-api/blob/develop/INSTALLATION.md#accessing-talawa-api) section on `talawa-api's` installation docs.

Copy/paste the endpoint for accessing talawa-api graphql service to the variable named `REACT_APP_TALAWA_URL` in `.env` file.

    REACT_APP_TALAWA_URL="http://localhost:4000/graphql/"

<br/>

## Setting up REACT_APP_RECAPTCHA_SITE_KEY in .env file

Make sure to go through [this](https://github.com/PalisadoesFoundation/talawa-api/blob/develop/INSTALLATION.md#setting-up-recaptcha_secret_key-in-env-file) section on `talawa-api's` installation docs.

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

## Elevate the permissions for created account

You have to manually elevate your account's permissions to make it `admin approved` and make it have `SUPERADMIN` privileges.

For the account you created:-

1.  Set `adminApproved` field to `true`:-

        adminApproved: true

2.  Set `userType` field to `SUPERADMIN`:-

        userType: "SUPERADMIN"

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
   1. [talawa-api](https://github.com/PalisadoesFoundation/talawa-api)
   2. [talawa-admin](https://github.com/PalisadoesFoundation/talawa-admin)
2. You need to setup your own instance of MongoDB database locally or on cloud.

#### Setting up your own instance of MongoDB database on your local machine

1. Login to your MongoDB account from here https://www.mongodb.com/
2. Create your own database user.
3. After you've have done it properly your interface will look like this:![Screenshot_246](https://user-images.githubusercontent.com/121368112/217745593-da2afd38-9ea7-42e0-b8f9-c58b569525bf.png)

##### Further instructions to connect and edit data through MongoDB Compass

1. Click on connect and choose MongoDB Compass.![Screenshot_247](https://user-images.githubusercontent.com/121368112/217745906-2f91cfd9-e378-4660-8d27-770454bb3796.png)
2. Copy the connection string open MongoDB Compass and paste it while creating new connection.
3. Make sure to replace `<password>` with your password.
4. You'll end up having interface like this:![Screenshot_248](https://user-images.githubusercontent.com/121368112/217746200-91a0e5a0-0a07-4ba6-b8e2-0ea59fae69ba.png)
5. Select `user` collections and edit the data. Change:
    1. `userType` from ADMIN to SUPERADMIN
    2. `adminApproved` from false to true
 ![Screenshot_251](https://user-images.githubusercontent.com/121368112/217746536-c2388f4c-8fd8-4039-a22d-2bf0e2e1eb0a.png)

##### Further instructions to connect and edit data through MONGOSH

1. Click on connect and choose Mongo Shell.
2. Copy the connection string do the necessary changes to it.
3. Add password to it.
    ![Screenshot_253](https://user-images.githubusercontent.com/121368112/217747201-d11b7174-8541-4b4d-a4b2-b9b3ca06adef.png)

4. You can use the following command to edit the `user` collections and edit the data:
  `db.users.updateOne({userType: "ADMIN"}, {$set: {userType: "SUPERADMIN", adminApproved: true}})`
  
* After you have created the [talawa-admin](https://github.com/PalisadoesFoundation/talawa-admin) user account, you'll need to create an organization.
    i. Login to your [talawa-admin](https://github.com/PalisadoesFoundation/talawa-admin) account and create an `organization`.
    ii. Click the `Create Organization` button on the top corner.
    ![Screenshot_254](https://user-images.githubusercontent.com/121368112/217749588-266bb9e5-6ebd-43c9-8c51-28938d778f75.png)

* Install [talawa](https://github.com/PalisadoesFoundation/talawa) Please refer the INSTALLATION.md of the respective repository for further guidance
    - Then use the URL (Organization URL) in this form:
    - http://(IP-address):4000/graphql (See the below example)
    - Example : http://10.0.2.2:4000/graphql
  
        




