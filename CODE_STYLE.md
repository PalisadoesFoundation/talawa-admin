# Talawa Admin Code Style

For Talawa Admin, most of the rules for the code style have been enforced with ESLint, but this document serves to provide an overview of the Code style used in Talawa Admin and the Rationale behind it.

The code style must be strictly adhered to, to ensure that there is consistency throughout the contributions made to Talawa-Admin

code style should not be changed and must be followed.

# Table of Contents

<!-- toc -->

- [Tech Stack](#tech-stack)
- [Component Structure](#component-structure)
- [Code Style and Naming Conventions](#code-style-and-naming-conventions)
- [Empty State Guidelines](#empty-state-guidelines)
  - [Preferred Pattern: EmptyState Component](#preferred-pattern-emptystate-component)
  - [NotFound vs EmptyState](#notfound-vs-emptystate)
  - [Migration Rule](#migration-rule)
  - [Refactoring Example](#refactoring-example)
  - [NotFound vs EmptyState Distinction](#notfound-vs-emptystate-distinction)
    - [Use `EmptyState` when:](#use-emptystate-when)
    - [Use `NotFound` when:](#use-notfound-when)
  - [Notes](#notes)
- [TSDoc](#tsdoc)
  - [How Contributors Can Improve Comments](#how-contributors-can-improve-comments)
- [Test and Code Linting](#test-and-code-linting)
- [Folder/Directory Structure](#folderdirectory-structure)
  - [Sub Directories of `src`](#sub-directories-of-src)
- [Imports](#imports)
- [Customising Bootstrap](#customising-bootstrap)

<!-- tocstop -->

## Tech Stack

- Typescript

- React.js

- CSS module

- React bootstrap

- Material UI

- GraphQL

- Vitest & React Testing Library for testing

## Component Structure

- Components should be strictly functional components

- Should make use of React hooks where appropriate

## Code Style and Naming Conventions

- All React components _must_ be written in PascalCase, with their file names, and associated CSS modules being written in PascalCase

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

## Empty State Guidelines

To ensure consistency across the application, all empty or no-data UI states must follow a standardized pattern.

### Preferred Pattern: EmptyState Component

The shared `EmptyState` component **must** be used for all new empty state implementations.

Use `EmptyState` for:
- Empty lists or tables
- No search results
- No organizations, users, events, or records
- Filtered views returning no data
- First-time or onboarding empty states

### NotFound vs EmptyState

| Use Case | Component |
|--------|-----------|
| No data / empty list | `EmptyState` |
| No search results | `EmptyState` |
| Resource does not exist (404) | `NotFound` |
| Invalid route | `NotFound` |

### Migration Rule

- Legacy `.notFound` CSS-based implementations are deprecated
- Existing screens should be migrated incrementally
- **For new empty state implementations, always use `EmptyState`**

### Refactoring Example

**Before (legacy pattern):**

```tsx
<div className={styles.notFound}>
  <h4>{t('noResultsFound')}</h4>
</div>

```

**After (preferred pattern):**

```tsx
import EmptyState from 'shared-components/EmptyState/EmptyState';

<EmptyState
  icon="search"
  message="noResultsFound"
  description="tryAdjustingFilters"
/>
```

### NotFound vs EmptyState Distinction

Although both components represent “absence” scenarios, they serve **different purposes** and must not be used interchangeably.

#### Use `EmptyState` when:
- The page or screen is valid, but the data set is empty
- A list, table, or search returns zero results
- Filters remove all visible items
- The user has no data yet (first-time or onboarding state)

**Examples:**
- No users in a table
- No organizations found after search
- No membership requests

#### Use `NotFound` when:
- A requested resource does not exist
- A route is invalid or inaccessible
- A user navigates to a non-existent entity

**Examples:**
- Invalid organization ID
- Unknown user profile URL
- 404-style navigation errors

### Notes

- Do not show EmptyState while data is loading
- Use LoadingState during fetch operations
- All user-visible text must use i18n keys


## TSDoc

Including TSDoc comments in each file is essential for maintaining a well-documented codebase. These comments provide clarity for developers and enable AI tools to better understand the code structure and functionality.

- AI tools rely on comments to infer the purpose and behavior of code.
- Detailed comments help AI generate accurate and meaningful unit tests.
- Clear documentation ensures contributors can quickly grasp the code's intent.

### How Contributors Can Improve Comments

- Specify all required props and their types for components.
- Include example usage snippets to demonstrate how to call the component.
- Clearly describe the purpose and behavior of functions or components.
- Ensure each file has a Top-level TSDoc comment.
- You may modify pre-written comments, but only when you have a complete understanding of their intent and context.

By adhering to these guidelines, contributors can ensure that the codebase remains well-documented and accessible to all developers.

## Test and Code Linting

Unit tests must be written for _all_ code submissions to the repository,
the code submitted must also be linted ESLint and formatted with Prettier.

## Folder/Directory Structure

### Sub Directories of `src`

`assets` - This houses all of the static assets used in the project

- `css` - This houses all of the css files used in the project
- `images` - This houses all of the images used in the project
- `scss` - This houses all of the scss files used in the project
  - `components -` All Sass files for components
  - `content -` All Sass files for content
  - `forms -` All Sass files for forms
  - `_talawa.scss` - Partial Sass file for Talawa
  - `_utilities.scss` - Partial Sass file for utilities
  - `_variables.scss` - Partial Sass file for variables
  - `app.scss` - Main Sass file for the app, imports all other partial Sass files

`components` - The directory for base components that will be used in the various views/screens

`Constant` - This houses all of the constants used in the project

`GraphQl` - This houses all of the GraphQL queries and mutations used in the project

`screens` - This houses all of the views/screens to be navigated through in Talawa-Admin

`state` - This houses all of the state management code for the project

`types` - This houses all of the reusable types and interfaces for the project

`utils` - This holds the utility functions that do not fall into any of the other categories

## Imports

Absolute imports have been set up for the project, so imports may be done directly from `src`.

An example being

```
import Navbar from 'components/Navbar/Navbar';
```

Imports should be grouped in the following order:

- React imports
- Third party imports
- Local imports

If there is more than one import from a single library, they should be grouped together

Example - If there is single import from a library, both ways will work

```
import Row from 'react-bootstrap/Row';
// OR
import { Row } from 'react-bootstrap';
```

If there are multiple imports from a library, they should be grouped together

```
import { Row, Col, Container } from 'react-bootstrap';
```

## Customising Bootstrap

Bootstrap v5.3.0 is used in the project.
Follow this [link](https://getbootstrap.com/docs/5.3/customize/sass/) to learn how to customise bootstrap.

**File Structure**

- `src/assets/scss/components/{'{partialFile}'}.scss` - where the {'{partialFile}'} are the following files

  - **\_accordion.scss**
  - **\_alert.scss**
  - **\_badge.scss**
  - **\_breadcrumb.scss**
  - **\_buttons.scss**
  - **\_card.scss**
  - **\_carousel.scss**
  - **\_close.scss**
  - **\_dropdown.scss**
  - **\_list-group.scss**
  - **\_modal.scss**
  - **\_nav.scss**
  - **\_navbar.scss**
  - **\_offcanvas.scss**
  - **\_pagination.scss**
  - **\_placeholder.scss**
  - **\_progress.scss**
  - **\_spinners.scss**

- `src/assets/scss/content/{'{partialFile}'}.scss` - where the {'{partialFile}'} are the following files

  - **\_table.scss**
  - **\_typography.scss**

- `src/assets/scss/forms/{'{partialFile}'}.scss` - where the {'{partialFile}'} are the following files

  - **\_check-radios.scss**
  - **\_floating-label.scss**
  - **\_form-control.scss**
  - **\_input-group.scss**
  - **\_range.scss**
  - **\_select.scss**
  - **\_validation.scss**

- `src/assets/scss/_utilities.scss` - The utility API is a Sass-based tool to generate utility classes.
- `src/assets/scss/_variables.scss` - This file contains all the Sass variables used in the project
- `src/assets/scss/_talawa.scss` - This files contains all the partial Sass files imported into it

**How to compile Sass file**

`src/assets/scss/app.scss` is the main Sass file for the app, it imports all other partial Sass files.
According to naming convention the file name of the partial Sass files should start with an underscore `_` and end with `.scss`, these partial Sass files are not meant to be compiled directly, they are meant to be imported into another Sass file. Only the main Sass file `src/assets/scss/app.scss` should be compiled.

The compiled CSS file is `src/assets/css/app.css` and it is imported into `src/index.tsx` file.

To compile the Sass file once, run the following command in the terminal

```
npx sass src/assets/scss/app.scss src/assets/css/app.css
```

To watch the Sass file for changes and compile it automatically, run the following command in the terminal

```
npx sass src/assets/scss/app.scss src/assets/css/app.css --watch
```

The `src/assets/css/app.css.map` file associates the generated CSS code with the original SCSS code. It allows you to see your SCSS code in the browser's developer tools for debugging.

To skip generating the map file, run

```
npx sass --no-source-map src/assets/scss/app.scss src/assets/css/app.css
```
