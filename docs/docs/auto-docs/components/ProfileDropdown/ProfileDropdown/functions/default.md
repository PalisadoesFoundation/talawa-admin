[**talawa-admin**](../../../../README.md)

***

[talawa-admin](../../../../README.md) / [components/ProfileDropdown/ProfileDropdown](../README.md) / default

# Function: default()

> **default**(): `Element`

Defined in: [src/components/ProfileDropdown/ProfileDropdown.tsx:24](https://github.com/gautam-divyanshu/talawa-admin/blob/619e831a8e34de2906df3277eb6df8b5309fb2fc/src/components/ProfileDropdown/ProfileDropdown.tsx#L24)

Renders a profile dropdown menu for the user.

This component displays the user's profile picture or an avatar, their name (truncated if necessary),
and their role (SuperAdmin, Admin, or User). It provides options to view the profile or log out.

- If a user image is available, it displays that; otherwise, it shows an avatar.
- The displayed name is truncated if it exceeds a specified length.
- The logout function revokes the refresh token and clears local storage before redirecting to the home page.

## Returns

`Element`

JSX.Element - The profile dropdown menu.
