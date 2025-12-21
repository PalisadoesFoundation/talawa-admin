[Admin Docs](/)

***

# Type Alias: NavigationLink

> **NavigationLink** = `object`

Defined in: [src/types/UserPortalNavigationBar/types.ts:104](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortalNavigationBar/types.ts#L104)

Navigation link configuration

## Properties

### icon?

> `optional` **icon**: `React.ComponentType`\<\{ `className?`: `string`; \}\>

Defined in: [src/types/UserPortalNavigationBar/types.ts:129](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortalNavigationBar/types.ts#L129)

Icon component (optional)

***

### id

> **id**: `string`

Defined in: [src/types/UserPortalNavigationBar/types.ts:108](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortalNavigationBar/types.ts#L108)

Unique identifier for the link (used for active state)

***

### isActive?

> `optional` **isActive**: `boolean`

Defined in: [src/types/UserPortalNavigationBar/types.ts:135](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortalNavigationBar/types.ts#L135)

Whether this link is currently active

#### Default

```ts
false (will be determined by comparing id with currentPage)
```

***

### label

> **label**: `string`

Defined in: [src/types/UserPortalNavigationBar/types.ts:113](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortalNavigationBar/types.ts#L113)

Display text for the link

***

### onClick()?

> `optional` **onClick**: () => `void` \| `Promise`\<`void`\>

Defined in: [src/types/UserPortalNavigationBar/types.ts:140](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortalNavigationBar/types.ts#L140)

Click handler (optional, overrides default navigation)

#### Returns

`void` \| `Promise`\<`void`\>

***

### path

> **path**: `string`

Defined in: [src/types/UserPortalNavigationBar/types.ts:118](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortalNavigationBar/types.ts#L118)

URL path or route

***

### testId?

> `optional` **testId**: `string`

Defined in: [src/types/UserPortalNavigationBar/types.ts:145](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortalNavigationBar/types.ts#L145)

Additional data attributes for testing

***

### translationKey?

> `optional` **translationKey**: `string`

Defined in: [src/types/UserPortalNavigationBar/types.ts:124](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortalNavigationBar/types.ts#L124)

Translation key (optional, overrides label if provided)
Should be in format 'namespace:key' or just 'key' (uses default namespace)
