[Admin Docs](/)

***

# Type Alias: UserProfileMenuItem

> **UserProfileMenuItem** = `object`

Defined in: [src/types/UserPortalNavigationBar/types.ts:27](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortalNavigationBar/types.ts#L27)

User profile menu item configuration

## Properties

### icon?

> `optional` **icon**: `React.ComponentType`\<\{ `className?`: `string`; \}\>

Defined in: [src/types/UserPortalNavigationBar/types.ts:47](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortalNavigationBar/types.ts#L47)

Icon component (optional)

***

### id

> **id**: `string`

Defined in: [src/types/UserPortalNavigationBar/types.ts:31](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortalNavigationBar/types.ts#L31)

Unique identifier

***

### isDivider?

> `optional` **isDivider**: `boolean`

Defined in: [src/types/UserPortalNavigationBar/types.ts:57](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortalNavigationBar/types.ts#L57)

Whether this is a divider item (renders as Dropdown.Divider)

***

### label

> **label**: `string`

Defined in: [src/types/UserPortalNavigationBar/types.ts:36](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortalNavigationBar/types.ts#L36)

Display label or translation key

***

### onClick()

> **onClick**: () => `void` \| `Promise`\<`void`\>

Defined in: [src/types/UserPortalNavigationBar/types.ts:52](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortalNavigationBar/types.ts#L52)

Click handler

#### Returns

`void` \| `Promise`\<`void`\>

***

### testId?

> `optional` **testId**: `string`

Defined in: [src/types/UserPortalNavigationBar/types.ts:62](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortalNavigationBar/types.ts#L62)

Test ID for testing

***

### translationKey?

> `optional` **translationKey**: `string`

Defined in: [src/types/UserPortalNavigationBar/types.ts:42](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortalNavigationBar/types.ts#L42)

Translation key prefix (optional)

#### Default

```ts
'common'
```
