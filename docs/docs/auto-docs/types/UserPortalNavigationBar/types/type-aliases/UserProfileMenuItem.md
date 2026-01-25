[**talawa-admin**](../../../../README.md)

***

# Type Alias: UserProfileMenuItem

> **UserProfileMenuItem** = `object`

Defined in: [src/types/UserPortalNavigationBar/types.ts:28](https://github.com/BittuBarnwal7479/talawa-admin/blob/7329c220ecd98ce2ec3fc0b9fc39dd1a39bb1df4/src/types/UserPortalNavigationBar/types.ts#L28)

User profile menu item configuration

## Properties

### icon?

> `optional` **icon**: `React.ComponentType`\<\{ `className?`: `string`; \}\>

Defined in: [src/types/UserPortalNavigationBar/types.ts:48](https://github.com/BittuBarnwal7479/talawa-admin/blob/7329c220ecd98ce2ec3fc0b9fc39dd1a39bb1df4/src/types/UserPortalNavigationBar/types.ts#L48)

Icon component (optional)

***

### id

> **id**: `string`

Defined in: [src/types/UserPortalNavigationBar/types.ts:32](https://github.com/BittuBarnwal7479/talawa-admin/blob/7329c220ecd98ce2ec3fc0b9fc39dd1a39bb1df4/src/types/UserPortalNavigationBar/types.ts#L32)

Unique identifier

***

### isDivider?

> `optional` **isDivider**: `boolean`

Defined in: [src/types/UserPortalNavigationBar/types.ts:58](https://github.com/BittuBarnwal7479/talawa-admin/blob/7329c220ecd98ce2ec3fc0b9fc39dd1a39bb1df4/src/types/UserPortalNavigationBar/types.ts#L58)

Whether this is a divider item (renders as Dropdown.Divider)

***

### label

> **label**: `string`

Defined in: [src/types/UserPortalNavigationBar/types.ts:37](https://github.com/BittuBarnwal7479/talawa-admin/blob/7329c220ecd98ce2ec3fc0b9fc39dd1a39bb1df4/src/types/UserPortalNavigationBar/types.ts#L37)

Display label or translation key

***

### onClick()

> **onClick**: () => `void` \| `Promise`\<`void`\>

Defined in: [src/types/UserPortalNavigationBar/types.ts:53](https://github.com/BittuBarnwal7479/talawa-admin/blob/7329c220ecd98ce2ec3fc0b9fc39dd1a39bb1df4/src/types/UserPortalNavigationBar/types.ts#L53)

Click handler

#### Returns

`void` \| `Promise`\<`void`\>

***

### testId?

> `optional` **testId**: `string`

Defined in: [src/types/UserPortalNavigationBar/types.ts:63](https://github.com/BittuBarnwal7479/talawa-admin/blob/7329c220ecd98ce2ec3fc0b9fc39dd1a39bb1df4/src/types/UserPortalNavigationBar/types.ts#L63)

Test ID for testing

***

### translationKey?

> `optional` **translationKey**: `string`

Defined in: [src/types/UserPortalNavigationBar/types.ts:43](https://github.com/BittuBarnwal7479/talawa-admin/blob/7329c220ecd98ce2ec3fc0b9fc39dd1a39bb1df4/src/types/UserPortalNavigationBar/types.ts#L43)

Translation key prefix (optional)

#### Default

```ts
'common'
```
