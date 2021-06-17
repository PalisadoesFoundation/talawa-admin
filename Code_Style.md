
# Talawa Admin Code Style

For Talawa Admin, most of the rules for the code style have been enforced with ESLint, but this document serves to provide an overview of the Code style used in Talawa Admin and the Rationale behind it.

The code style must be strictly adhered to, to ensure that there is consistency throughout the contributions made to Talawa-Admin

code style should not be changed and must be followed.

## Tech Stack

. React.js 

. CSS module

. Axios (for fetching data)

. React bootstrap

## Component Structure

. Components should be strictly functional components

. Should make use of React hooks where appropriate


## Code Style and Naming Conventions

. All React components *must* be written in PascalCase, with their file names, and associated CSS modules being written in PascalCase

. All other files may follow the camelCase naming convention

. All the Return fragment should be closed in empty tag

. Use of classes is refrained 


## Test and Code Linting 

Unit tests must be written for *all* code submissions to the repository, 
the code submitted must also be linted ESLint and formatted with Prettier.

## Folder/Directory Structure

### Sub Directories of `src`

`components`  - The directory for base components that will be used in the various views/screens

`screens` - This houses all of the views/screens to be navigated through in Talawa-Admin

`hooks` - This houses the user defined hooks to be used within Talawa-Admin

`util` - This holds the utility functions that do not fall into any of the other categories

`axios` - This houses all of the functions and code that is related to handling data with axios

`reducers` - This houses the reducers created to be used with Redux for state management

## Imports

Absolute imports have been set up for the project, so imports may be done directly from `src`.

An example being

```
import Navbar from 'components/Navbar/Navbar';
```

