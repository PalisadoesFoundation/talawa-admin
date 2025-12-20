[Admin Docs](/)

***

# Interface: InterfaceProfileAvatarDisplayProps

Defined in: [src/types/shared-components/ProfileAvatarDisplay/interface.ts:17](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/ProfileAvatarDisplay/interface.ts#L17)

Props for the ProfileAvatarDisplay component.

## Properties

### altText

> **altText**: `string`

Defined in: [src/types/shared-components/ProfileAvatarDisplay/interface.ts:19](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/ProfileAvatarDisplay/interface.ts#L19)

Required alt text for accessibility.

***

### border?

> `optional` **border**: `boolean`

Defined in: [src/types/shared-components/ProfileAvatarDisplay/interface.ts:23](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/ProfileAvatarDisplay/interface.ts#L23)

Optional flag to add a border around the avatar.

***

### className?

> `optional` **className**: `string`

Defined in: [src/types/shared-components/ProfileAvatarDisplay/interface.ts:24](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/ProfileAvatarDisplay/interface.ts#L24)

Optional additional CSS class names.

***

### crossOrigin?

> `optional` **crossOrigin**: `"anonymous"` \| `"use-credentials"`

Defined in: [src/types/shared-components/ProfileAvatarDisplay/interface.ts:33](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/ProfileAvatarDisplay/interface.ts#L33)

***

### customSize?

> `optional` **customSize**: `number`

Defined in: [src/types/shared-components/ProfileAvatarDisplay/interface.ts:22](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/ProfileAvatarDisplay/interface.ts#L22)

Optional custom size in pixels (used when size='custom').

***

### dataTestId?

> `optional` **dataTestId**: `string`

Defined in: [src/types/shared-components/ProfileAvatarDisplay/interface.ts:27](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/ProfileAvatarDisplay/interface.ts#L27)

Optional test ID for testing purposes.

***

### decoding?

> `optional` **decoding**: `"sync"` \| `"async"` \| `"auto"`

Defined in: [src/types/shared-components/ProfileAvatarDisplay/interface.ts:34](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/ProfileAvatarDisplay/interface.ts#L34)

***

### enableEnlarge?

> `optional` **enableEnlarge**: `boolean`

Defined in: [src/types/shared-components/ProfileAvatarDisplay/interface.ts:31](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/ProfileAvatarDisplay/interface.ts#L31)

If true, clicking the avatar opens an enlarged modal view

***

### fallbackName

> **fallbackName**: `string`

Defined in: [src/types/shared-components/ProfileAvatarDisplay/interface.ts:26](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/ProfileAvatarDisplay/interface.ts#L26)

Required name used for fallback avatar generation.

***

### imageUrl?

> `optional` **imageUrl**: `string`

Defined in: [src/types/shared-components/ProfileAvatarDisplay/interface.ts:18](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/ProfileAvatarDisplay/interface.ts#L18)

Optional URL of the avatar image to display.

***

### loading?

> `optional` **loading**: `"eager"` \| `"lazy"`

Defined in: [src/types/shared-components/ProfileAvatarDisplay/interface.ts:35](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/ProfileAvatarDisplay/interface.ts#L35)

***

### objectFit?

> `optional` **objectFit**: `"fill"` \| `"cover"` \| `"contain"` \| `"none"` \| `"scale-down"`

Defined in: [src/types/shared-components/ProfileAvatarDisplay/interface.ts:28](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/ProfileAvatarDisplay/interface.ts#L28)

Optional CSS object-fit value for the image.

***

### onClick()?

> `optional` **onClick**: () => `void`

Defined in: [src/types/shared-components/ProfileAvatarDisplay/interface.ts:29](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/ProfileAvatarDisplay/interface.ts#L29)

#### Returns

`void`

***

### onError()?

> `optional` **onError**: () => `void`

Defined in: [src/types/shared-components/ProfileAvatarDisplay/interface.ts:36](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/ProfileAvatarDisplay/interface.ts#L36)

#### Returns

`void`

***

### onLoad()?

> `optional` **onLoad**: () => `void`

Defined in: [src/types/shared-components/ProfileAvatarDisplay/interface.ts:37](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/ProfileAvatarDisplay/interface.ts#L37)

#### Returns

`void`

***

### shape?

> `optional` **shape**: `"circle"` \| `"square"` \| `"rounded"`

Defined in: [src/types/shared-components/ProfileAvatarDisplay/interface.ts:21](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/ProfileAvatarDisplay/interface.ts#L21)

Optional shape: 'circle', 'square', or 'rounded'.

***

### size?

> `optional` **size**: `"small"` \| `"medium"` \| `"large"` \| `"custom"`

Defined in: [src/types/shared-components/ProfileAvatarDisplay/interface.ts:20](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/ProfileAvatarDisplay/interface.ts#L20)

Optional size preset: 'small', 'medium', 'large', or 'custom'.

***

### style?

> `optional` **style**: `CSSProperties`

Defined in: [src/types/shared-components/ProfileAvatarDisplay/interface.ts:25](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/ProfileAvatarDisplay/interface.ts#L25)

Optional inline React CSS properties.
