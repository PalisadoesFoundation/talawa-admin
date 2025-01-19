[Admin Docs](/)

***

# Function: default()

> **default**(): `JSX.Element`

Defined in: [src/App.tsx:74](https://github.com/syedali237/talawa-admin/blob/dd4a08e622d0fa38bcf9758a530e8cdf917dbac8/src/App.tsx#L74)

This is the main function for our application. It sets up all the routes and components,
defining how the user can navigate through the app. The function uses React Router's `Routes`
and `Route` components to map different URL paths to corresponding screens and components.

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
