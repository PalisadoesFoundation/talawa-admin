[**talawa-admin**](README.md)

***

# components/UserPortal/OrganizationNavbar

OrganizationNavbar Component

This component renders a responsive navigation bar for an organization portal.
It includes branding, navigation links, language selection, and user account options.

## File

OrganizationNavbar.tsx

## Author

Talawa Team

## Param

Component props.

## Param

The current active page identifier.

## Remarks

- Uses `react-bootstrap` for layout and styling.
- Integrates `i18next` for language translation.
- Fetches organization details using Apollo GraphQL query.
- Provides user logout functionality and redirects to the home page.

## Requires

react

## Requires

react-bootstrap

## Requires

i18next

## Requires

js-cookie

## Requires

@apollo/client

## Requires

@mui/icons-material

## Requires

react-router-dom

## Requires

utils/useLocalstorage

## Requires

utils/languages

## Example

```tsx
<OrganizationNavbar currentPage="home" />
```

## Functions

- [default](components\UserPortal\OrganizationNavbar\README\functions\default.md)
