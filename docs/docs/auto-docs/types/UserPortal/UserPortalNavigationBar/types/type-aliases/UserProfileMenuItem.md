[Admin Docs](/)

***

# Type Alias: UserProfileMenuItem

> **UserProfileMenuItem** = `object`

Defined in: [src/types/UserPortal/UserPortalNavigationBar/types.ts:26](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/UserPortalNavigationBar/types.ts#L26)

User profile menu item configuration

## Properties

### icon?

> `optional` **icon**: `React.ComponentType`\<\{ `className?`: `string`; \}\>

Defined in: [src/types/UserPortal/UserPortalNavigationBar/types.ts:46](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/UserPortalNavigationBar/types.ts#L46)

Icon component (optional)

***

### id

> **id**: `string`

Defined in: [src/types/UserPortal/UserPortalNavigationBar/types.ts:30](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/UserPortalNavigationBar/types.ts#L30)

Unique identifier

***

### isDivider?

> `optional` **isDivider**: `boolean`

Defined in: [src/types/UserPortal/UserPortalNavigationBar/types.ts:56](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/UserPortalNavigationBar/types.ts#L56)

Whether this is a divider item (renders as Dropdown.Divider)

***

### label

> **label**: `string`

Defined in: [src/types/UserPortal/UserPortalNavigationBar/types.ts:35](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/UserPortalNavigationBar/types.ts#L35)

Display label or translation key

***

### onClick()

> **onClick**: () => `void` \| `Promise`\<`void`\>

Defined in: [src/types/UserPortal/UserPortalNavigationBar/types.ts:51](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/UserPortalNavigationBar/types.ts#L51)

Click handler

#### Returns

`void` \| `Promise`\<`void`\>

***

### testId?

> `optional` **testId**: `string`

Defined in: [src/types/UserPortal/UserPortalNavigationBar/types.ts:61](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/UserPortalNavigationBar/types.ts#L61)

Test ID for testing

***

### translationKey?

> `optional` **translationKey**: `string`

Defined in: [src/types/UserPortal/UserPortalNavigationBar/types.ts:41](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/UserPortalNavigationBar/types.ts#L41)

Translation key prefix (optional)

#### Default Value

```ts
'common'
```
