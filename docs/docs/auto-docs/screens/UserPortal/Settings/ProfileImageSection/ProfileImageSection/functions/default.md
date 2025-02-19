[Admin Docs](/)

***

# Function: default()

> **default**(`props`, `deprecatedLegacyContext`?): `ReactNode`

Defined in: [src/screens/UserPortal/Settings/ProfileImageSection/ProfileImageSection.tsx:63](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/UserPortal/Settings/ProfileImageSection/ProfileImageSection.tsx#L63)

Renders the profile image section of the user settings

This component displays:
- The user's current avatar or a default avatar
- An edit button to change the profile picture
- A hidden file input for image upload

## Parameters

### props

`InterfaceProfileImageSectionProps`

### deprecatedLegacyContext?

`any`

**Deprecated**

**See**

[React Docs](https://legacy.reactjs.org/docs/legacy-context.html#referencing-context-in-lifecycle-methods)

## Returns

`ReactNode`

## Remarks

The component handles two cases:
1. When an avatar URL exists - displays the actual image
2. When no avatar URL exists - displays a default avatar with user's initials

The component uses Bootstrap classes and custom styling for layout and appearance.

## Example

```tsx
<ProfileImageSection
  userDetails={{ name: "John Doe", avatarURL: "https://example.com/avatar.jpg" }}
  selectedAvatar={null}
  fileInputRef={fileInputRef}
  handleFileUpload={handleFileUpload}
/>
```
