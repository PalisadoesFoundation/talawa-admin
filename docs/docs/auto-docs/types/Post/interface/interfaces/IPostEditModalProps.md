[Admin Docs](/)

***

# Interface: IPostEditModalProps

Defined in: [src/types/Post/interface.ts:142](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Post/interface.ts#L142)

PostEditModal component props interface

## Properties

### onHide()

> **onHide**: () => `void`

Defined in: [src/types/Post/interface.ts:144](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Post/interface.ts#L144)

#### Returns

`void`

***

### onSuccess()?

> `optional` **onSuccess**: () => `void`

Defined in: [src/types/Post/interface.ts:150](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Post/interface.ts#L150)

Callback function after post update success
Used to notify parent component to refresh data, replacing window.location.reload()

#### Returns

`void`

***

### post

> **post**: [`InterfacePostWithAttachments`](InterfacePostWithAttachments.md)

Defined in: [src/types/Post/interface.ts:145](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Post/interface.ts#L145)

***

### show

> **show**: `boolean`

Defined in: [src/types/Post/interface.ts:143](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Post/interface.ts#L143)
