## Installation

This mode of installation helps to run all the installation steps automatically.

You must have the following installed on your system:

- [NodeJS 12.20.16](https://www.nodejs.org) or higher
- [Yarn 1.22.17](https://yarnpkg.com/) or higher

To start with the installation process,

1. Clone this repo to your local machine

   ```sh
      git clone https://github.com/PalisadoesFoundation/talawa-admin.git
      cd talawa-admin
   ```

2. Install the yarn packages required by talawa-admin :-

   ```sh
      yarn install
   ```

3. Talawa-Admin uses a configuration file named `.env` in the root directory. It is not a part of the repo and you will need to create it. There is a sample configuration file named `.env.sample` in the root directory. Create a new `.env` file by copying the contents of the `.env.sample` file.

   ```sh
      cp .env.example .env
   ```

4.  Run Talawa-api locally in your system, and put its url into the same.

      REACT_APP_BACKEND_ENDPOINT=

      Get the google recaptcha site key from google recaptcha admin or https://www.google.com/recaptcha/admin/create from here for reCAPTCHA v2 and "I'm not a robot" Checkbox, and paste the key here.
      Note: In domains, fill localhost

      REACT_APP_RECAPTCHA_KEY=
      Note: the secret key and the site key should be generated at the same time for TALAWA-ADMIN and TALAWA-API

6. The command below will run the talawa-admin server in development environment.

   ```sh
      yarn serve
   ```

7. To stop the server use this keybind in the terminal where the above command is executed.

   ```sh
      CTRL + C
   ```
