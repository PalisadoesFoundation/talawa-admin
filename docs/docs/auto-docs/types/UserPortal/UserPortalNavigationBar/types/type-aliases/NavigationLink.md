[Admin Docs](/)

***

# Type Alias: NavigationLink

> **NavigationLink** = `object`

Defined in: [src/types/UserPortal/UserPortalNavigationBar/types.ts:103](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/UserPortalNavigationBar/types.ts#L103)

Navigation link configuration

## Properties

### icon?

> `optional` **icon**: `React.ComponentType`\<\{ `className?`: `string`; \}\>

Defined in: [src/types/UserPortal/UserPortalNavigationBar/types.ts:128](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/UserPortalNavigationBar/types.ts#L128)

Icon component (optional)

***

### id

> **id**: `string`

Defined in: [src/types/UserPortal/UserPortalNavigationBar/types.ts:107](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/UserPortalNavigationBar/types.ts#L107)

Unique identifier for the link (used for active state)

***

### isActive?

> `optional` **isActive**: `boolean`

Defined in: [src/types/UserPortal/UserPortalNavigationBar/types.ts:134](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/UserPortalNavigationBar/types.ts#L134)

Whether this link is currently active

#### Default Value

```ts
false (will be determined by comparing id with currentPage)
```

***

### label

> **label**: `string`

Defined in: [src/types/UserPortal/UserPortalNavigationBar/types.ts:112](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/UserPortalNavigationBar/types.ts#L112)

Display text for the link

***

### onClick()?

> `optional` **onClick**: () => `void` \| `Promise`\<`void`\>

Defined in: [src/types/UserPortal/UserPortalNavigationBar/types.ts:139](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/UserPortalNavigationBar/types.ts#L139)

Click handler (optional, overrides

#### Returns

`void` \| `Promise`\<`void`\>

#### Default Value

```ts
navigation)
```

***

### path

> **path**: `string`

Defined in: [src/types/UserPortal/UserPortalNavigationBar/types.ts:117](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/UserPortalNavigationBar/types.ts#L117)

URL path or route

***

### testId?

> `optional` **testId**: `string`

Defined in: [src/types/UserPortal/UserPortalNavigationBar/types.ts:144](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/UserPortalNavigationBar/types.ts#L144)

Additional data attributes for testing

***

### translationKey?

> `optional` **translationKey**: `string`

Defined in: [src/types/UserPortal/UserPortalNavigationBar/types.ts:123](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/UserPortalNavigationBar/types.ts#L123)

Translation key (optional, overrides label if provided)
Should be in format 'namespace:key' or just 'key' (uses default namespace)
