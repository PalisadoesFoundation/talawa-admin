[**talawa-admin**](../../../../README.md)

***

# Function: ProfileAvatarDisplay()

> **ProfileAvatarDisplay**(`imageUrl`): `Element`

Defined in: [src/shared-components/ProfileAvatarDisplay/ProfileAvatarDisplay.tsx:41](https://github.com/BittuBarnwal7479/talawa-admin/blob/7329c220ecd98ce2ec3fc0b9fc39dd1a39bb1df4/src/shared-components/ProfileAvatarDisplay/ProfileAvatarDisplay.tsx#L41)

ProfileAvatarDisplay component renders a profile avatar based on the provided properties.
It handles image loading errors and falls back to an initial-based avatar.

## Parameters

### imageUrl

[`InterfaceProfileAvatarDisplayProps`](../../../../types/shared-components/ProfileAvatarDisplay/interface/interfaces/InterfaceProfileAvatarDisplayProps.md)

The URL of the avatar image.

## Returns

`Element`

JSX.Element - The ProfileAvatarDisplay component.

## Example

```
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
