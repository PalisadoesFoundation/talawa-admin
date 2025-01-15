[**talawa-admin**](../../README.md)

***

[talawa-admin](../../modules.md) / [App](../README.md) / default

# Function: default()

> **default**(): `JSX.Element`

Defined in: [src/App.tsx:75](https://github.com/bint-Eve/talawa-admin/blob/16ddeb98e6868a55bca282e700a8f4212d222c01/src/App.tsx#L75)

This is the main function for our application. It sets up all the routes and components,
defining how the user can navigate through the app. The function uses React Router's `Routes`
and `Route` components to map different URL paths to corresponding screens and components.
THESE ARE THE DETAILS FOR THIS MAIN FUNCTION

## Important Details
- **UseEffect Hook**: This hook checks user authentication status using the `CHECK_AUTH` GraphQL query.
- **Plugins**: It dynamically loads additional routes for any installed plugins.
- **Routes**:
  - The root route ("/") takes the user to the `LoginPage`.
  - Protected routes are wrapped with the `SecuredRoute` component to ensure they are only accessible to authenticated users.
  - Admin and Super Admin routes allow access to organization and user management screens.
  - User portal routes allow end-users to interact with organizations, settings, chat, events, etc.

## Returns

`JSX.Element`

The rendered routes and components of the application.
