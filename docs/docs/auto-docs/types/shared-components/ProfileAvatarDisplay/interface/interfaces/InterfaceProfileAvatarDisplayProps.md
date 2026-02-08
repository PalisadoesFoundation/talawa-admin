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

Defined in: [src/types/shared-components/ProfileAvatarDisplay/interface.ts:30](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/ProfileAvatarDisplay/interface.ts#L30)

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

Defined in: [src/types/shared-components/ProfileAvatarDisplay/interface.ts:31](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/ProfileAvatarDisplay/interface.ts#L31)

***

### enableEnlarge?

> `optional` **enableEnlarge**: `boolean`

Defined in: [src/types/shared-components/ProfileAvatarDisplay/interface.ts:28](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/ProfileAvatarDisplay/interface.ts#L28)

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

Defined in: [src/types/shared-components/ProfileAvatarDisplay/interface.ts:32](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/ProfileAvatarDisplay/interface.ts#L32)

***

### objectFit?

> `optional` **objectFit**: `"fill"` \| `"none"` \| `"cover"` \| `"contain"` \| `"scale-down"`

Defined in: [src/types/shared-components/ProfileAvatarDisplay/interface.ts:25](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/ProfileAvatarDisplay/interface.ts#L25)

(Optional) CSS object-fit value for the image.

***

### onClick()?

> `optional` **onClick**: () => `void`

Defined in: [src/types/shared-components/ProfileAvatarDisplay/interface.ts:26](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/ProfileAvatarDisplay/interface.ts#L26)

#### Returns

`void`

***

### onError()?

> `optional` **onError**: () => `void`

Defined in: [src/types/shared-components/ProfileAvatarDisplay/interface.ts:33](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/ProfileAvatarDisplay/interface.ts#L33)

#### Returns

`void`

***

### onLoad()?

> `optional` **onLoad**: () => `void`

Defined in: [src/types/shared-components/ProfileAvatarDisplay/interface.ts:34](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/ProfileAvatarDisplay/interface.ts#L34)

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
