[Admin Docs](/)

***

# Function: default()

> **default**(): `Element`

Defined in: src/components/ProfileCard/ProfileCard.tsx:21

Renders a profile card for the user.

This component displays the user's profile picture or an avatar, their name (truncated if necessary),
and their role (SuperAdmin, Admin, or User). It provides options to view the profile.

- If a user image is available, it displays that; otherwise, it shows an avatar.
- The displayed name is truncated if it exceeds a specified length.

## Returns

`Element`

JSX.Element - The profile card .
