
# Talawa Admin Code Style

For Talawa Admin, most of the rules for the code style have been enforced with ESLint, but this document serves to provide an overview of the Code style used in Talawa Admin and the Rationale behind it.

The code style must be strictly adhered to, to ensure that there is consistency throughout the contributions made to Talawa-Admin

code style should not be changed and must be followed.

## Tech Stack

- Typescript

- React.js 

- CSS module

- React bootstrap

- Material UI

- GraphQL

- Jest & Enzyme for testing

## Component Structure

- Components should be strictly functional components

- Should make use of React hooks where appropriate


## Code Style and Naming Conventions

- All React components *must* be written in PascalCase, with their file names, and associated CSS modules being written in PascalCase

- All other files may follow the camelCase naming convention

- All the Return fragment should be closed in empty tag

- Use of custom classes directly are refrained, use of modular css is encouraged along with bootstrap classes

**Wrong way ❌**
```
<div className="myCustomClass">...</div>
<div className={`${styles.myCustomClass1} myCustomClass2`}>...</div> // No using personal custom classes directly, here you should  not use myCustomClass2
.container{...} // No changing the property of already existing classes reserved by boostrap directly in css files
```

**Correct ways ✅** 
```
<div className={styles.myCustomClass}>...</div> // Use custom class defined in modular css file
<div className={`${styles.myCustomClass} relative bg-danger`}>...</div> // Use classes already defined in Bootstrap
<div className={styles.myCustomClass + ' relative bg-danger' }>...</div> // Use classes already defined in Bootstrap
```

- All components should be either imported from React-Bootstrap library or Material UI library, components should not be written using plain Bootstrap classes and attributes without leveraging the React-Bootstrap library.

**Example: Bootstrap Dropdown**

**Wrong way ❌**

Using plain Bootstrap classes and attributes without leveraging the React-Bootstrap library should be refrained. While it may work for basic functionality, it doesn't fully integrate with React and may cause issues when dealing with more complex state management or component interactions. 
```
    <div class="dropdown">
        <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
            Dropdown button
        </button>
        <ul class="dropdown-menu">
            <li><a class="dropdown-item" href="#">Action</a></li>
            <li><a class="dropdown-item" href="#">Another action</a></li>
            <li><a class="dropdown-item" href="#">Something else here</a></li>
        </ul>
    </div>
```
    

**Correct way ✅**

It's recommended to use the React-Bootstrap library for seamless integration of Bootstrap components in a React application.
```
import Dropdown from 'react-bootstrap/Dropdown';

function BasicExample() {
  return (
    <Dropdown>
      <Dropdown.Toggle variant="success" id="dropdown-basic">
        Dropdown Button
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
        <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
        <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default BasicExample;
```


## Test and Code Linting 

Unit tests must be written for *all* code submissions to the repository, 
the code submitted must also be linted ESLint and formatted with Prettier.

## Folder/Directory Structure

### Sub Directories of `src`

`assets` - This houses all of the static assets (only images/svgs not css and js) used in the project

`components`  - The directory for base components that will be used in the various views/screens

`Constant` - This houses all of the constants used in the project

`GraphQl` - This houses all of the GraphQL queries and mutations used in the project

`screens` - This houses all of the views/screens to be navigated through in Talawa-Admin

`state` - This houses all of the state management code for the project

`utils` - This holds the utility functions that do not fall into any of the other categories


## Imports

Absolute imports have been set up for the project, so imports may be done directly from `src`.

An example being

```
import Navbar from 'components/Navbar/Navbar';
```

