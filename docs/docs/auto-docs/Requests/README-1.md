[Admin Docs](/)

***

# Requests

## File

Requests.tsx

## Description

This file contains the implementation of the Requests component, which displays
             a list of membership requests for an organization. It includes features like
             infinite scrolling, search functionality, and role-based access control.

## Requires

react

## Requires

@apollo/client

## Requires

react-bootstrap

## Requires

react-i18next

## Requires

react-toastify

## Requires

react-router-dom

## Requires

@mui/material

## Requires

GraphQl/Queries/Queries

## Requires

components/TableLoader/TableLoader

## Requires

components/RequestsTableItem/RequestsTableItem

## Requires

subComponents/SearchBar

## Requires

utils/interfaces

## Requires

utils/useLocalstorage

## Requires

style/app-fixed.module.css

## Component

## Name

Requests

## Description

Displays a list of membership requests for an organization. Includes search,
             infinite scrolling, and role-based access control. Redirects unauthorized users
             to the organization list page.

## Example

```ts
<Requests />
```

## Remarks

- Uses Apollo Client's `useQuery` for fetching data.
- Implements infinite scrolling using `react-infinite-scroll-component`.
- Displays a search bar for filtering requests by user name.
- Handles role-based access control for `ADMIN` and `SUPERADMIN` roles.
- Displays appropriate messages when no data is available.

## Functions

- [default](functions/default-1.md)
