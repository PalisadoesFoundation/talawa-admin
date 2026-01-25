[**talawa-admin**](../../../../README.md)

***

# Type Alias: NavigationLink

> **NavigationLink** = `object`

Defined in: [src/types/UserPortalNavigationBar/types.ts:105](https://github.com/BittuBarnwal7479/talawa-admin/blob/7329c220ecd98ce2ec3fc0b9fc39dd1a39bb1df4/src/types/UserPortalNavigationBar/types.ts#L105)

Navigation link configuration

## Properties

### icon?

> `optional` **icon**: `React.ComponentType`\<\{ `className?`: `string`; \}\>

Defined in: [src/types/UserPortalNavigationBar/types.ts:130](https://github.com/BittuBarnwal7479/talawa-admin/blob/7329c220ecd98ce2ec3fc0b9fc39dd1a39bb1df4/src/types/UserPortalNavigationBar/types.ts#L130)

Icon component (optional)

***

### id

> **id**: `string`

Defined in: [src/types/UserPortalNavigationBar/types.ts:109](https://github.com/BittuBarnwal7479/talawa-admin/blob/7329c220ecd98ce2ec3fc0b9fc39dd1a39bb1df4/src/types/UserPortalNavigationBar/types.ts#L109)

Unique identifier for the link (used for active state)

***

### isActive?

> `optional` **isActive**: `boolean`

Defined in: [src/types/UserPortalNavigationBar/types.ts:136](https://github.com/BittuBarnwal7479/talawa-admin/blob/7329c220ecd98ce2ec3fc0b9fc39dd1a39bb1df4/src/types/UserPortalNavigationBar/types.ts#L136)

Whether this link is currently active

#### Default

```ts
false (will be determined by comparing id with currentPage)
```

***

### label

> **label**: `string`

Defined in: [src/types/UserPortalNavigationBar/types.ts:114](https://github.com/BittuBarnwal7479/talawa-admin/blob/7329c220ecd98ce2ec3fc0b9fc39dd1a39bb1df4/src/types/UserPortalNavigationBar/types.ts#L114)

Display text for the link

***

### onClick()?

> `optional` **onClick**: () => `void` \| `Promise`\<`void`\>

Defined in: [src/types/UserPortalNavigationBar/types.ts:141](https://github.com/BittuBarnwal7479/talawa-admin/blob/7329c220ecd98ce2ec3fc0b9fc39dd1a39bb1df4/src/types/UserPortalNavigationBar/types.ts#L141)

Click handler (optional, overrides default navigation)

#### Returns

`void` \| `Promise`\<`void`\>

***

### path

> **path**: `string`

Defined in: [src/types/UserPortalNavigationBar/types.ts:119](https://github.com/BittuBarnwal7479/talawa-admin/blob/7329c220ecd98ce2ec3fc0b9fc39dd1a39bb1df4/src/types/UserPortalNavigationBar/types.ts#L119)

URL path or route

***

### testId?

> `optional` **testId**: `string`

Defined in: [src/types/UserPortalNavigationBar/types.ts:146](https://github.com/BittuBarnwal7479/talawa-admin/blob/7329c220ecd98ce2ec3fc0b9fc39dd1a39bb1df4/src/types/UserPortalNavigationBar/types.ts#L146)

Additional data attributes for testing

***

### translationKey?

> `optional` **translationKey**: `string`

Defined in: [src/types/UserPortalNavigationBar/types.ts:125](https://github.com/BittuBarnwal7479/talawa-admin/blob/7329c220ecd98ce2ec3fc0b9fc39dd1a39bb1df4/src/types/UserPortalNavigationBar/types.ts#L125)

Translation key (optional, overrides label if provided)
Should be in format 'namespace:key' or just 'key' (uses default namespace)
