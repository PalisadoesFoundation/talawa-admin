[Admin Docs](/)

***

# Interface: InterfaceProfileAvatarDisplayProps

Defined in: [src/types/shared-components/ProfileAvatarDisplay/interface.ts:16](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/ProfileAvatarDisplay/interface.ts#L16)

Props for the ProfileAvatarDisplay component.

## Param

(Optional) URL of the avatar image to display.

## Param

(Optional) Size preset: 'small', 'medium', 'large', or 'custom'.

## Param

(Optional) Shape: 'circle', 'square', or 'rounded'.

## Param

(Optional) Custom size in pixels (used when size='custom').

## Param

(Optional) Flag to add a border around the avatar.

## Param

(Optional) Additional CSS class names.

## Param

(Optional) Inline React CSS properties.

## Param

Required name used for fallback avatar generation.

## Param

(Optional) Test ID for testing purposes.

## Param

(Optional) CSS object-fit value for the image.

## Properties

### border?

> `optional` **border**: `boolean`

Defined in: [src/types/shared-components/ProfileAvatarDisplay/interface.ts:21](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/ProfileAvatarDisplay/interface.ts#L21)

***

### className?

> `optional` **className**: `string`

Defined in: [src/types/shared-components/ProfileAvatarDisplay/interface.ts:22](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/ProfileAvatarDisplay/interface.ts#L22)

***

### crossOrigin?

> `optional` **crossOrigin**: `"anonymous"` \| `"use-credentials"`

Defined in: [src/types/shared-components/ProfileAvatarDisplay/interface.ts:31](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/ProfileAvatarDisplay/interface.ts#L31)

***

### customSize?

> `optional` **customSize**: `number`

Defined in: [src/types/shared-components/ProfileAvatarDisplay/interface.ts:20](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/ProfileAvatarDisplay/interface.ts#L20)

***

### dataTestId?

> `optional` **dataTestId**: `string`

Defined in: [src/types/shared-components/ProfileAvatarDisplay/interface.ts:25](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/ProfileAvatarDisplay/interface.ts#L25)

***

### decoding?

> `optional` **decoding**: `"sync"` \| `"async"` \| `"auto"`

Defined in: [src/types/shared-components/ProfileAvatarDisplay/interface.ts:32](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/ProfileAvatarDisplay/interface.ts#L32)

***

### enableEnlarge?

> `optional` **enableEnlarge**: `boolean`

Defined in: [src/types/shared-components/ProfileAvatarDisplay/interface.ts:29](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/ProfileAvatarDisplay/interface.ts#L29)

If true, clicking the avatar opens an enlarged modal view

***

### fallbackName

> **fallbackName**: `string`

Defined in: [src/types/shared-components/ProfileAvatarDisplay/interface.ts:24](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/ProfileAvatarDisplay/interface.ts#L24)

***

### imageUrl?

> `optional` **imageUrl**: `string`

Defined in: [src/types/shared-components/ProfileAvatarDisplay/interface.ts:17](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/ProfileAvatarDisplay/interface.ts#L17)

***

### loading?

> `optional` **loading**: `"eager"` \| `"lazy"`

Defined in: [src/types/shared-components/ProfileAvatarDisplay/interface.ts:33](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/ProfileAvatarDisplay/interface.ts#L33)

***

### objectFit?

> `optional` **objectFit**: `"fill"` \| `"none"` \| `"cover"` \| `"contain"` \| `"scale-down"`

Defined in: [src/types/shared-components/ProfileAvatarDisplay/interface.ts:26](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/ProfileAvatarDisplay/interface.ts#L26)

***

### onClick()?

> `optional` **onClick**: () => `void`

Defined in: [src/types/shared-components/ProfileAvatarDisplay/interface.ts:27](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/ProfileAvatarDisplay/interface.ts#L27)

#### Returns

`void`

***

### onError()?

> `optional` **onError**: () => `void`

Defined in: [src/types/shared-components/ProfileAvatarDisplay/interface.ts:34](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/ProfileAvatarDisplay/interface.ts#L34)

#### Returns

`void`

***

### onLoad()?

> `optional` **onLoad**: () => `void`

Defined in: [src/types/shared-components/ProfileAvatarDisplay/interface.ts:35](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/ProfileAvatarDisplay/interface.ts#L35)

#### Returns

`void`

***

### shape?

> `optional` **shape**: `"circle"` \| `"square"` \| `"rounded"`

Defined in: [src/types/shared-components/ProfileAvatarDisplay/interface.ts:19](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/ProfileAvatarDisplay/interface.ts#L19)

***

### size?

> `optional` **size**: `"small"` \| `"custom"` \| `"medium"` \| `"large"`

Defined in: [src/types/shared-components/ProfileAvatarDisplay/interface.ts:18](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/ProfileAvatarDisplay/interface.ts#L18)

***

### style?

> `optional` **style**: `CSSProperties`

Defined in: [src/types/shared-components/ProfileAvatarDisplay/interface.ts:23](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/ProfileAvatarDisplay/interface.ts#L23)
