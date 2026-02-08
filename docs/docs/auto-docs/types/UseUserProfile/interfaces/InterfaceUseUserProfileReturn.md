[Admin Docs](/)

***

# Interface: InterfaceUseUserProfileReturn

Defined in: [src/types/UseUserProfile.ts:8](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UseUserProfile.ts#L8)

Return type for the useUserProfile hook.

## Remarks

Provides user profile data and actions (logout, translation) for rendering
profile dropdowns in portal screens.

## Properties

### displayedName

> **displayedName**: `string`

Defined in: [src/types/UseUserProfile.ts:10](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UseUserProfile.ts#L10)

***

### handleLogout()

> **handleLogout**: () => `Promise`\<`void`\>

Defined in: [src/types/UseUserProfile.ts:14](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UseUserProfile.ts#L14)

#### Returns

`Promise`\<`void`\>

***

### name

> **name**: `string`

Defined in: [src/types/UseUserProfile.ts:9](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UseUserProfile.ts#L9)

***

### profileDestination

> **profileDestination**: `string`

Defined in: [src/types/UseUserProfile.ts:13](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UseUserProfile.ts#L13)

***

### tCommon()

> **tCommon**: (`key`) => `string`

Defined in: [src/types/UseUserProfile.ts:15](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UseUserProfile.ts#L15)

#### Parameters

##### key

`string`

#### Returns

`string`

***

### userImage

> **userImage**: `string`

Defined in: [src/types/UseUserProfile.ts:12](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UseUserProfile.ts#L12)

***

### userRole

> **userRole**: `string`

Defined in: [src/types/UseUserProfile.ts:11](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UseUserProfile.ts#L11)
