[Admin Docs](/)

***

# Function: ProfileAvatarDisplay()

> **ProfileAvatarDisplay**(`props`): `Element`

Defined in: [src/shared-components/ProfileAvatarDisplay/ProfileAvatarDisplay.tsx:40](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/ProfileAvatarDisplay/ProfileAvatarDisplay.tsx#L40)

ProfileAvatarDisplay component renders a profile avatar based on the provided properties.
It handles image loading errors and falls back to an initial-based avatar.

## Parameters

### props

[`InterfaceProfileAvatarDisplayProps`](../../../../types/shared-components/ProfileAvatarDisplay/interface/interfaces/InterfaceProfileAvatarDisplayProps.md)

The properties of the profile avatar display.

## Returns

`Element`

The ProfileAvatarDisplay component.

## Example

```ts
<ProfileAvatarDisplay
    imageUrl="https://example.com/avatar.jpg"
    altText="User Avatar"
    size="medium"
    shape="circle"
    customSize={48}
    name="John Doe"
    border={false}
    className=""
    style={{}}
    dataTestId="profile-avatar"
    objectFit="cover"
    enableEnlarge={true}
/>
```
