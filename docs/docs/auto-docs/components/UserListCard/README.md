[**talawa-admin**](../../README.md)

***

# components/UserListCard

**`Function`**

UserListCard Component

This component renders a button that allows adding a user as an admin
to a specific organization. It utilizes GraphQL mutation to perform
the operation and provides feedback to the user via toast notifications.

## File

UserListCard.tsx

## Author

Palisadoes

## Requires

React

## Requires

react-bootstrap/Button

## Requires

@apollo/client - For GraphQL mutation handling

## Requires

components/NotificationToast/NotificationToast - For displaying toast notifications

## Requires

react-i18next - For internationalization and translations

## Requires

react-router-dom - For accessing route parameters

## Requires

utils/errorHandler - For handling errors

## Requires

GraphQl/Mutations/mutations - Contains the ADD_ADMIN_MUTATION

## Requires

style/app-fixed.module.css - For styling the button

## Param

The props for the component

## Param

Unique key for the component

## Param

The ID of the user to be added as an admin

## Remarks

- The `useParams` hook is used to retrieve the current organization ID
  from the URL.
- The `useTranslation` hook is used for internationalization.
- The button reloads the page after a successful operation.

## Functions

- [default](functions/default.md)
