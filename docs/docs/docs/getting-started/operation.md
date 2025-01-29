---
id: operation
title: Operation, Registration & Login
slug: /operation
sidebar_position: 2
---

This page outlines how to successfully operate the application

## Operation

Operation of the application requires these steps.

### Running Talawa-Admin

Run the following command to start `talawa-admin` development server:

```bash
npm run serve

```

### Accessing Talawa-Admin

By default `talawa-admin` runs on port `4321` on your system's localhost. It is available on the following endpoint:

```

http://localhost:4321/

```

If you have specified a custom port number in your `.env` file, Talawa-Admin will run on the following endpoint:

```

http://localhost:{{customPort}}/

```

Replace `{{customPort}}` with the actual custom port number you have configured in your `.env` file.

## Registration

The first time you navigate to the running talawa-admin's website you'll land at talawa-admin registration page. Sign up using whatever credentials you want and create the account. Make sure to remember the email and password you entered because they'll be used to sign you in later on.

## Login

The login process is different depending on the scenario

### Normal Login

Now sign in to talawa-admin using the `email` and `password` you used to sign up.

### First Time API Administrator Login

The email address and password are defined these API environment variables:

1. `API_ADMINISTRATOR_USER_EMAIL_ADDRESS`
1. `API_ADMINISTRATOR_USER_NAME`
1. `API_ADMINISTRATOR_USER_PASSWORD`

In a development environment, the defaults are:

1. `API_ADMINISTRATOR_USER_EMAIL_ADDRESS`=administrator@email.com
1. `API_ADMINISTRATOR_USER_NAME`=administrator
1. `API_ADMINISTRATOR_USER_PASSWORD`=password
