[**talawa-admin**](../../../../../README.md)

***

# Function: default()

> **default**(`props`): `Element`

Defined in: [src/components/UserPortal/UserPortalNavigationBar/UserDropdown.tsx:43](https://github.com/Anshikaaa06/talawa-admin/blob/9e54ad8a0be6c052a435c30f5a6bbbad9b905bb5/src/components/UserPortal/UserPortalNavigationBar/UserDropdown.tsx#L43)

UserProfileDropdown Component

## Parameters

### props

[`InterfaceUserDropdownProps`](../../../../../UserPortalNavigationBar/interface/interfaces/InterfaceUserDropdownProps.md)

Component props

## Returns

`Element`

The rendered dropdown component, or null if showUserProfile is false

## Description

Renders a dropdown menu for user profile actions including settings navigation
and logout functionality. This component is typically used in the navigation bar
to provide quick access to user-related actions.

## Component

## Example

```tsx
<UserProfileDropdown
  showUserProfile={true}
  testIdPrefix="navbar"
  dropDirection="start"
  handleLogout={handleLogoutAction}
  finalUserName="John Doe"
  navigate={navigate}
  tCommon={t}
  styles={navbarStyles}
  PermIdentityIcon={PermIdentityIcon}
/>
```

## See

[InterfaceUserDropdownProps](../../../../../UserPortalNavigationBar/interface/interfaces/InterfaceUserDropdownProps.md) for detailed prop type definitions
