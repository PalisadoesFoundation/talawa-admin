[**talawa-admin**](../README.md)

***

# LoginPortalToggle

A React functional component that provides a toggle interface for switching
between 'admin' and 'user' roles. It uses navigation links styled with
conditional classes to indicate the active role.

## Remarks

This component is designed to work with the `react-router-dom` library for
navigation and `react-i18next` for internationalization. It also utilizes
Bootstrap's grid system for layout and custom CSS modules for styling.

## Param

The props for the component.

## Param

A callback function invoked when the active role is toggled.
                        It receives the new role ('admin' or 'user') as an argument.

## Example

```tsx
<LoginPortalToggle onToggle={(role) => console.log(role)} />
```

## Component

## Functions

- [default](functions/default.md)
