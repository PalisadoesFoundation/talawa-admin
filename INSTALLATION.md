## Installation
### Prerequisites
This mode of installation helps to run all the installation steps automatically.

You must have the following installed on your system:

- [NodeJS 12.20.16](https://www.nodejs.org) or higher
- [Yarn 1.22.17](https://yarnpkg.com/) or higher
- Before starting the installation process run the talwa-api by [following this doc](https://github.com/PalisadoesFoundation/talawa-api/blob/develop/INSTALLATION.md)


## Installation (Automated Installer)

```
yarn setup
```
## Installation (Manually)

1.  Clone this repo to your local machine

        git clone https://github.com/PalisadoesFoundation/talawa-admin
        cd talawa-admin
        yarn install

2.  Talawa-ADMIN uses a configuration file named `.env` in the root directory. It is not a part of the repo and you will need to create it. There is a sample configuration file named `.env.example` in the root diretory. Create a new `.env` file by copying the contents of the `.env.example` file.

        cp .env.example .env

3.  Run Talawa-api locally in your system, and put its url into the same section of the `.env` file.

        Talawa-API: https://github.com/PalisadoesFoundation/talawa-api

      REACT_APP_BACKEND_ENDPOINT=

4.  Get the google `recaptcha site key` from google recaptcha admin or https://www.google.com/recaptcha/admin/create from here for reCAPTCHA v2 and "I'm not a robot" Checkbox, and paste the key here.
      Note: In domains, fill localhost

      REACT_APP_RECAPTCHA_KEY=
      
      Note: the secret key and the site key should be generated at the same time for TALAWA-ADMIN and TALAWA-API
      
5. When finished, your `.env` file should have the following field filled in.

    - REACT_APP_BACKEND_ENDPOINT
    - REACT_APP_RECAPTCHA_KEY

    Please review the contents of the `.env.example` file for additional details.

## Compiles and hot-reloads for development

```
yarn serve
```

## Compiles and minifies for production

```
yarn build
```

## Run your end-to-end tests

```
yarn test:e2e
```

## Lints and fixes files

```
yarn lint
```
## To stop the server use this keybind in the terminal where the above command is executed.

   ```sh
      CTRL + C
   ```

## Express Installation

See [Follow this guide](./INSTALLATION.md).

## Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

## Project setup using docker

See [Docker Container](Docker_Container/README.md)

## For Code Style

See [Code Stlye](Code_Style.md)



