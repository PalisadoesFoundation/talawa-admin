---
id: configuration
title: Configuration
slug: /configuration
sidebar_position: 2
---

It's important to configure Talawa-Admin. Here's how to do it.

## Automated Setup

You can use our interactive setup script for the configuration. Use the following command for the same.

```bash
pnpm run setup
```

All the options in "setup" can be done manually as well and this is covered in a section below.

## Manual Setup

The setup script only modifies the most common configuration parameters. This section explains how to manually edit these values.

### The .env Configuration File

A file named .env is required in the root directory of talawa-admin for storing environment variables used at runtime. It is not a part of the repo and you will have to create it. For a sample of `.env` file there is a file named `.env.example` in the root directory. Create a new `.env` file by copying the contents of the `.env.example` into `.env` file. Use this command:

```
cp .env.example .env

```

#### .env Parameters

This `.env` file must be populated with the following environment variables for `talawa-admin` to work:

| Variable                        | Description                                       |
| ------------------------------- | ------------------------------------------------- |
| PORT                            | Custom port for Talawa-Admin development purposes |
| REACT_APP_TALAWA_URL            | URL endpoint for talawa-api graphql service       |
| REACT_APP_BACKEND_WEBSOCKET_URL | URL endpoint for websocket end point              |
| REACT_APP_USE_RECAPTCHA         | Whether you want to use reCAPTCHA or not          |
| REACT_APP_RECAPTCHA_SITE_KEY    | Site key for authentication using reCAPTCHA       |

#### Setting up PORT in .env file

Add a custom port number for Talawa-Admin development purposes to the variable named `PORT` in the `.env` file.

#### Setting up REACT_APP_TALAWA_URL in .env file

Add the endpoint for accessing talawa-api graphql service to the variable named `REACT_APP_TALAWA_URL` in the `.env` file.

```
REACT_APP_TALAWA_URL="http://API-IP-ADRESS:4000/graphql"

```

If you are a software developer working on your local system, then the URL would be:

```
REACT_APP_TALAWA_URL="http://localhost:4000/graphql"

```

If you are trying to access Talawa Admin from a remote host with the API URL containing `localhost`, You will have to change the API URL to

```
REACT_APP_TALAWA_URL="http://YOUR-REMOTE-ADDRESS:4000/graphql"

```
:::tip Proxy Configuration
To avoid CORS issues when hosting the Admin and API on different IP addresses, you can use a **relative path** for the backend URL.

Talawa-Admin includes a pre-configured Reverse Proxy (via Vite in Dev, and Nginx/Apache in Prod).

**Recommended Configuration:**
```bash
REACT_APP_TALAWA_URL=/graphql
REACT_APP_BACKEND_WEBSOCKET_URL=/graphql

#### Setting up REACT_APP_BACKEND_WEBSOCKET_URL in .env file

The endpoint for accessing talawa-api WebSocket graphql service for handling subscriptions is automatically added to the variable named `REACT_APP_BACKEND_WEBSOCKET_URL` in the `.env` file.

```
REACT_APP_BACKEND_WEBSOCKET_URL="ws://API-IP-ADRESS:4000/graphql"

```

If you are a software developer working on your local system, then the URL would be:

```
REACT_APP_BACKEND_WEBSOCKET_URL="ws://localhost:4000/graphql"

```

If you are trying to access Talawa Admin from a remote host with the API URL containing `localhost`, You will have to change the API URL to

```
REACT_APP_BACKEND_WEBSOCKET_URL="ws://YOUR-REMOTE-ADDRESS:4000/graphql"

```

For additional details, please refer the `How to Access the Talawa-API URL` section in the INSTALLATION.md file found in the [Talawa-API repo](https://github.com/PalisadoesFoundation/talawa-api).

#### Setting up REACT_APP_RECAPTCHA_SITE_KEY in .env file

This is an optional parameter.

You may not want to setup reCAPTCHA since the project will still work. Moreover, it is recommended to not set it up in development environment.

If you want to setup Google reCAPTCHA now, you may refer to the `RECAPTCHA` section in the INSTALLATION.md file found in [Talawa-API repo](https://github.com/PalisadoesFoundation/talawa-api).

`Talawa-admin` needs the `reCAPTCHA site key` for the `reCAPTCHA` service you set up during `talawa-api` installation as shown in this screenshot:

![reCAPTCHA site key](../../../static/img/markdown/installation/REACT_SITE_KEY.webp)

Copy/paste this `reCAPTCHA site key` to the variable named `REACT_APP_RECAPTCHA_SITE_KEY` in `.env` file.

```
REACT_APP_RECAPTCHA_SITE_KEY="this_is_the_recaptcha_key"

```

#### Setting up Compiletime and Runtime logs

Set the `ALLOW_LOGS` to "YES" if you want warnings , info and error messages in your console or leave it blank if you dont need them or want to keep the console clean
