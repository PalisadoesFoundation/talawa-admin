[**talawa-admin**](README.md)

***

# components/UpdateSession/UpdateSession

**`Interface`**

## File

UpdateSession.tsx

## Description

A React component that allows users to update the session timeout for a community.
             It fetches the current timeout value from the server, displays it, and provides
             a slider to update the timeout value. The updated value is submitted to the server
             via a GraphQL mutation.

## Description

Props for the `UpdateTimeout` component.

## Component

## Name

UpdateTimeout

## Description

A React functional component that manages and updates the session timeout for a community.

## Param

Component props.

## Example

```ts
<UpdateTimeout onValueChange={(value) => console.log(value)} />
```

## Remarks

- Fetches the current session timeout using a GraphQL query.
- Allows users to update the timeout using a slider.
- Submits the updated timeout value to the server using a GraphQL mutation.
- Displays a success toast on successful update or handles errors gracefully.

## Dependencies

- `react`, `react-bootstrap`, `@mui/material`, `@apollo/client`, `react-toastify`
- Custom modules: `GraphQl/Queries/Queries`, `GraphQl/Mutations/mutations`, `utils/errorHandler`, `components/Loader/Loader`

## Todo

- Add additional validation for slider input if needed.
- Improve error handling for edge cases.

## Variables

- [default](components\UpdateSession\UpdateSession\README\variables\default.md)
