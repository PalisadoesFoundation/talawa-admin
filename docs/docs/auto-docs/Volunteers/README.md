[**talawa-admin**](README.md)

***

# Volunteers

## File

Volunteers.tsx

## Description

This component renders the Volunteers page for an event in the Talawa Admin application.
It provides functionalities to view, search, filter, sort, and manage volunteers for a specific event.
The page includes a data grid to display volunteer details and modals for adding, viewing, and deleting volunteers.

## Requires

react

## Requires

react-i18next

## Requires

react-bootstrap

## Requires

react-router-dom

## Requires

@mui/icons-material

## Requires

@apollo/client

## Requires

@mui/x-data-grid

## Requires

@mui/material

## Requires

components/Loader/Loader

## Requires

components/Avatar/Avatar

## Requires

subComponents/SortingButton

## Requires

shared-components/SearchBar/SearchBar

## Requires

GraphQl/Queries/EventVolunteerQueries

## Requires

utils/interfaces

## Requires

./createModal/VolunteerCreateModal

## Requires

./deleteModal/VolunteerDeleteModal

## Requires

./viewModal/VolunteerViewModal

## Requires

style/app.module.css

## Component

## Example

```ts
// Usage
import Volunteers from './Volunteers';

function App() {
  return <Volunteers />;
}
```

## Remarks

- The component uses Apollo Client's `useQuery` to fetch volunteer data.
- It supports search, sorting, and filtering functionalities.
- Modals are used for adding, viewing, and deleting volunteers.
- Displays a loader while fetching data and handles errors gracefully.

## Functions

- [default](Volunteers\README\functions\default.md)
