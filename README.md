# Talawa Admin

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![GitHub stars](https://img.shields.io/github/stars/PalisadoesFoundation/talawa-admin.svg?style=social&label=Star&maxAge=2592000)](https://github.com/PalisadoesFoundation/talawa-admin)
[![GitHub forks](https://img.shields.io/github/forks/PalisadoesFoundation/talawa-admin.svg?style=social&label=Fork&maxAge=2592000)](https://github.com/PalisadoesFoundation/talawa-admin)
[![codecov](https://codecov.io/gh/PalisadoesFoundation/talawa-admin/branch/develop/graph/badge.svg?token=II0R0RREES)](https://codecov.io/gh/PalisadoesFoundation/talawa-admin)

[![N|Solid](src/assets/talawa-logo-lite-200x200.png)](https://github.com/PalisadoesFoundation/talawa-admin)

Talawa is a modular open source project to manage group activities of both non-profit organizations and businesses.

Core features include:

1.  Membership management
2.  Groups management
3.  Event registrations
4.  Recurring meetings
5.  Facilities registrations

`talawa` is based on the original `quito` code created by the [Palisadoes Foundation][pfd] as part of its annual Calico Challenge program. Calico provides paid summer internships for Jamaican university students to work on selected open source projects. They are mentored by software professionals and receive stipends based on the completion of predefined milestones. Calico was started in 2015. Visit [The Palisadoes Foundation's website](http://www.palisadoes.org/) for more details on its origin and activities.

# Talawa Components

`talawa` has these major software components:

1. **talawa**: [A mobile application with social media features](https://github.com/PalisadoesFoundation/talawa)
1. **talawa-api**: [An API providing access to user data and features](https://github.com/PalisadoesFoundation/talawa-api)
1. **talawa-admin**: [A web based administrative portal](https://github.com/PalisadoesFoundation/talawa-admin)
1. **talawa-docs**: [The online documentation website](https://github.com/PalisadoesFoundation/talawa-docs)

# Documentation

- The `talawa` documentation can be found [here](https://palisadoesfoundation.github.io/talawa-docs/).
- Want to contribute? Look at [CONTRIBUTING.md](CONTRIBUTING.md) to get started.
- Visit the [Talawa-Docs GitHub](https://github.com/PalisadoesFoundation/talawa-docs) to see the code.

## Project Setup (Automated Installer)

```
yarn setup
```

# Project Setup (Manually)

1.  Clone this repo to your local machine

        git clone https://github.com/PalisadoesFoundation/talawa-admin
        cd talawa-admin
        yarn install

2.  Talawa-ADMIN uses a configuration file named `.env` in the root directory. It is not a part of the repo and you will need to create it. There is a sample configuration file named `.env.example` in the root diretory. Create a new `.env` file by copying the contents of the `.env.example` file.

        cp .env.example .env

3.  Run Talawa-api locally in your system, and copy the URL to the `REACT_APP_BACKEND_ENDPOINT` section of the `.env` file.

        Talawa-API: https://github.com/PalisadoesFoundation/talawa-api

4.  When finished, your `.env` file should have the following field filled in.

    - REACT_APP_BACKEND_ENDPOINT

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

## Express Installation

See [Follow this guide](./INSTALLATION.md).

## Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

## Project setup using docker

See [Docker Container](Docker_Container/README.md)

## For Code Style

See [Code Stlye](Code_Style.md)
