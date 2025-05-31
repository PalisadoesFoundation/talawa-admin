[Admin Docs](/)

***

# Function: default()

> **default**(): `Element`

Defined in: [src/App.tsx:109](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/App.tsx#L109)

This is the main function for our application. It sets up all the routes and components,
defining how the user can navigate through the app. The function uses React Router's `Routes`
and `Route` components to map different URL paths to corresponding screens and components.

## Important Details
- **UseEffect Hook**: This hook checks user authentication status using the `CHECK_AUTH` GraphQL query.
- **Routes**:
  - The root route ("/") takes the user to the `LoginPage`.
  - Protected routes are wrapped with the `SecuredRoute` component to ensure they are only accessible to authenticated users.
  - Admin and Super Admin routes allow access to organization and user management screens.
  - User portal routes allow end-users to interact with organizations, settings, chat, events, etc.

## Returns

`Element`

The rendered routes and components of the application.
