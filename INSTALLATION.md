# Talwa-Admin Installation

Talawa Admin is mainly written and built using react.js and typescript. We are providing some common approaches to set it up on your system.

## Prerequisites

This mode of installation helps to run all the installation steps automatically.

You must have the following installed on your system:

- [NodeJS 12.20.16](https://www.nodejs.org) or higher
- [Yarn 1.22.17](https://yarnpkg.com/) or higher
- Before starting the installation process run the talwa-api by [following this doc](https://github.com/PalisadoesFoundation/talawa-api/blob/develop/INSTALLATION.md)

## Installation (Automated Installer)
This method will automate most of the work needed for setting up talawa-admin.

```
yarn setup
```

## Installation (Manually)
This is the method that we recommend :-

1.  Clone this repo to your local machine

        git clone https://github.com/PalisadoesFoundation/talawa-admin
        cd talawa-admin
        yarn install

2.  Talawa-Admin uses a configuration file named `.env` in the root directory. It is not a part of the repo and you will need to create it. There is a sample configuration file named `.env.example` in the root diretory. Create a new `.env` file by copying the contents of the `.env.example` file.
        
        cp .env.example .env
     In the newly created .env file in your local system, you will find two env variables-

        REACT_APP_BACKEND_ENDPOINT=
        REACT_APP_RECAPTCHA_KEY=
      
3.  Run Talawa-api locally in your system, and put its url into the same section of the `.env` file. By default, it will be `http://localhost:4000/graphql`

        Talawa-API: https://github.com/PalisadoesFoundation/talawa-api //setup this project locally by following the installation guide 
 Start the api server and pass the url to this variable in .env file 
    REACT_APP_BACKEND_ENDPOINT=`<local talawa-api url>`

4.  Get the google `recaptcha site key` from google recaptcha admin or https://www.google.com/recaptcha/admin/create from here for reCAPTCHA v2 and "I'm not a robot" Checkbox, and paste the key here.
    Note: In domains, fill localhost
    
    After the key generation in the Google Console,
    
    Copy the `site key` and pass it to this variable in talwa-admin's .env file
    
        REACT_APP_RECAPTCHA_KEY=
    
    Go to the local talwa-api code and pass the `secret key` to this variable in its .env file
    
        RECAPTCHA_SECRET_KEY=

    Note: the secret key and the site key should be generated at the same time for TALAWA-ADMIN and TALAWA-API
    
        

5.  When finished, your `.env` file should have the following field filled in.

    - REACT_APP_BACKEND_ENDPOINT
    - REACT_APP_RECAPTCHA_KEY

    Please review the contents of the `.env.example` file for additional details.
    
## Compilation
These commands will help you to compile the code and see the live chnages in your local machine :-

Compiles and hot-reloads for development

```
yarn serve
```

Compiles and minifies for production

```
yarn build
```
## Testing

You can run the tests for talawa-admin using this command :-

Run your end-to-end tests

```
yarn test:e2e
```

Lints and fixes files

```
yarn lint
```
## Server

To stop the server use this keybind in the terminal where the above command is executed :-

```sh
   CTRL + C
```
## Installation: using docker
Follow these steps to get Talawa-admin working with Docker :-

See [Docker Container](Docker_Container/README.md)
## Next Steps After Setup
1. Register on the admin portal 
2. After you get a `waiting for approval` notification , go to your mongoDB talawa-api instance , go to users and set the fields of the newly registered user to the new values-
        
        adminApproved:true
        userType:SUPERADMIN
3. Now you should be able to login to the admin-console with your credentials.
