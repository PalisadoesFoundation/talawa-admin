[Admin Docs](/)

***

# Interface: InterfaceProfileAvatarDisplayProps

Defined in: [src/types/shared-components/ProfileAvatarDisplay/interface.ts:5](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/ProfileAvatarDisplay/interface.ts#L5)

Props for the ProfileAvatarDisplay component.

## Properties

### border?

> `optional` **border**: `boolean`

Defined in: [src/types/shared-components/ProfileAvatarDisplay/interface.ts:15](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/ProfileAvatarDisplay/interface.ts#L15)

(Optional) Flag to add a border around the avatar.

***

### className?

> `optional` **className**: `string`

Defined in: [src/types/shared-components/ProfileAvatarDisplay/interface.ts:17](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/ProfileAvatarDisplay/interface.ts#L17)

(Optional) Additional CSS class names.

***

### crossOrigin?

> `optional` **crossOrigin**: `"anonymous"` \| `"use-credentials"`

Defined in: [src/types/shared-components/ProfileAvatarDisplay/interface.ts:31](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/ProfileAvatarDisplay/interface.ts#L31)

need to support other props which are in images

***

### customSize?

> `optional` **customSize**: `number`

Defined in: [src/types/shared-components/ProfileAvatarDisplay/interface.ts:13](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/ProfileAvatarDisplay/interface.ts#L13)

(Optional) Custom size in pixels (used when size='custom').

***

### dataTestId?

> `optional` **dataTestId**: `string`

Defined in: [src/types/shared-components/ProfileAvatarDisplay/interface.ts:23](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/ProfileAvatarDisplay/interface.ts#L23)

(Optional) Test ID for testing purposes.

***

### decoding?

> `optional` **decoding**: `"sync"` \| `"async"` \| `"auto"`

Defined in: [src/types/shared-components/ProfileAvatarDisplay/interface.ts:33](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/ProfileAvatarDisplay/interface.ts#L33)

(Optional) Decoding strategy for the image element.

***

### enableEnlarge?

> `optional` **enableEnlarge**: `boolean`

Defined in: [src/types/shared-components/ProfileAvatarDisplay/interface.ts:29](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/ProfileAvatarDisplay/interface.ts#L29)

If true, clicking the avatar opens an enlarged modal view

***

### fallbackName

> **fallbackName**: `string`

Defined in: [src/types/shared-components/ProfileAvatarDisplay/interface.ts:21](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/ProfileAvatarDisplay/interface.ts#L21)

Required name used for fallback avatar generation.

***

### imageUrl?

> `optional` **imageUrl**: `string`

Defined in: [src/types/shared-components/ProfileAvatarDisplay/interface.ts:7](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/ProfileAvatarDisplay/interface.ts#L7)

(Optional) URL of the avatar image to display.

***

### loading?

> `optional` **loading**: `"eager"` \| `"lazy"`

Defined in: [src/types/shared-components/ProfileAvatarDisplay/interface.ts:35](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/ProfileAvatarDisplay/interface.ts#L35)

(Optional) Loading strategy for the image element.

***

### objectFit?

> `optional` **objectFit**: `"fill"` \| `"none"` \| `"cover"` \| `"contain"` \| `"scale-down"`

Defined in: [src/types/shared-components/ProfileAvatarDisplay/interface.ts:25](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/ProfileAvatarDisplay/interface.ts#L25)

(Optional) CSS object-fit value for the image.

***

### onClick()?

> `optional` **onClick**: () => `void`

Defined in: [src/types/shared-components/ProfileAvatarDisplay/interface.ts:27](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/ProfileAvatarDisplay/interface.ts#L27)

(Optional) Click handler for the avatar.

#### Returns

`void`

***

### onError()?

> `optional` **onError**: () => `void`

Defined in: [src/types/shared-components/ProfileAvatarDisplay/interface.ts:37](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/ProfileAvatarDisplay/interface.ts#L37)

Error handler for the image element.

#### Returns

`void`

***

### onLoad()?

> `optional` **onLoad**: () => `void`

Defined in: [src/types/shared-components/ProfileAvatarDisplay/interface.ts:39](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/ProfileAvatarDisplay/interface.ts#L39)

Load handler for the image element.

#### Returns

`void`

***

### shape?

> `optional` **shape**: `"circle"` \| `"square"` \| `"rounded"`

Defined in: [src/types/shared-components/ProfileAvatarDisplay/interface.ts:11](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/ProfileAvatarDisplay/interface.ts#L11)

(Optional) Shape: 'circle', 'square', or 'rounded'.

***

### size?

> `optional` **size**: `"small"` \| `"custom"` \| `"medium"` \| `"large"`

Defined in: [src/types/shared-components/ProfileAvatarDisplay/interface.ts:9](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/ProfileAvatarDisplay/interface.ts#L9)

(Optional) Size preset: 'small', 'medium', 'large', or 'custom'.

***

### style?

> `optional` **style**: `CSSProperties`

Defined in: [src/types/shared-components/ProfileAvatarDisplay/interface.ts:19](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/ProfileAvatarDisplay/interface.ts#L19)

(Optional) Inline React CSS properties.
