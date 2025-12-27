[**talawa-admin**](README.md)

***

# UserProfile

UserProfile component displays the profile details of a user.

## Remarks

This component is designed to show user information such as name, email,
profile picture, and the date the user joined. It uses React-Bootstrap for
styling and Material-UI icons for visual elements. The component also
supports tooltips for displaying additional information.

## Param

Partial properties of the `InterfaceUser` type.

## Param

The first name of the user.

## Param

The last name of the user.

## Param

The date when the user joined.

## Param

The email address of the user.

## Param

The URL of the user's profile picture.

## Example

```tsx
<UserProfile
  firstName="John"
  lastName="Doe"
  createdAt="2023-01-01"
  email="john.doe@example.com"
  image="https://example.com/profile.jpg"
/>
```

## Dependencies

- `react-bootstrap` for Card and Button components.
- `@mui/icons-material` for CalendarMonthOutlinedIcon.
- `react-i18next` for translations.
- `react-tooltip` for tooltips.
- `Avatar` component for displaying a placeholder profile picture.

## Variables

- [default](UserProfile\README\variables\default.md)
