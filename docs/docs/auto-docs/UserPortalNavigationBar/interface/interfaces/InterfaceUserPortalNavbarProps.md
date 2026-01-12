[Admin Docs](/)

***

# Interface: InterfaceUserPortalNavbarProps

Defined in: [src/types/UserPortalNavigationBar/interface.ts:56](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortalNavigationBar/interface.ts#L56)

Main component props interface

## Properties

### branding?

> `optional` **branding**: [`BrandingConfig`](../../../types/UserPortalNavigationBar/types/type-aliases/BrandingConfig.md)

Defined in: [src/types/UserPortalNavigationBar/interface.ts:66](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortalNavigationBar/interface.ts#L66)

Branding configuration for logo and brand name

***

### className?

> `optional` **className**: `string`

Defined in: [src/types/UserPortalNavigationBar/interface.ts:155](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortalNavigationBar/interface.ts#L155)

Additional CSS class names

***

### currentPage?

> `optional` **currentPage**: `string`

Defined in: [src/types/UserPortalNavigationBar/interface.ts:78](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortalNavigationBar/interface.ts#L78)

Current active page identifier (matches NavigationLink.id)
Used to highlight the active navigation link

***

### customStyles?

> `optional` **customStyles**: `CSSProperties`

Defined in: [src/types/UserPortalNavigationBar/interface.ts:160](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortalNavigationBar/interface.ts#L160)

Inline styles

***

### expandBreakpoint?

> `optional` **expandBreakpoint**: `"sm"` \| `"lg"` \| `"xl"` \| `"md"`

Defined in: [src/types/UserPortalNavigationBar/interface.ts:126](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortalNavigationBar/interface.ts#L126)

Breakpoint at which navbar expands

#### Default

```ts
'md'
```

***

### fetchOrganizationData?

> `optional` **fetchOrganizationData**: `boolean`

Defined in: [src/types/UserPortalNavigationBar/interface.ts:96](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortalNavigationBar/interface.ts#L96)

Whether to fetch organization data via GraphQL

#### Default

```ts
true when mode === 'organization'
```

***

### mobileLayout?

> `optional` **mobileLayout**: `"collapse"` \| `"offcanvas"`

Defined in: [src/types/UserPortalNavigationBar/interface.ts:132](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortalNavigationBar/interface.ts#L132)

Mobile layout style

#### Default

```ts
'collapse' for user mode, 'offcanvas' for organization mode
```

***

### mode?

> `optional` **mode**: `"organization"` \| `"user"`

Defined in: [src/types/UserPortalNavigationBar/interface.ts:61](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortalNavigationBar/interface.ts#L61)

Navigation mode - determines default behavior and styling

#### Default

```ts
'user'
```

***

### navigationLinks?

> `optional` **navigationLinks**: [`NavigationLink`](../../../types/UserPortalNavigationBar/types/type-aliases/NavigationLink.md)[]

Defined in: [src/types/UserPortalNavigationBar/interface.ts:72](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortalNavigationBar/interface.ts#L72)

Array of navigation links to display in the navbar
Only shown in organization mode or when explicitly provided

***

### onLanguageChange()?

> `optional` **onLanguageChange**: (`languageCode`) => `void` \| `Promise`\<`void`\>

Defined in: [src/types/UserPortalNavigationBar/interface.ts:144](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortalNavigationBar/interface.ts#L144)

Custom language change handler
If not provided, uses default i18next language change

#### Parameters

##### languageCode

`string`

#### Returns

`void` \| `Promise`\<`void`\>

***

### onLogout()?

> `optional` **onLogout**: () => `void` \| `Promise`\<`void`\>

Defined in: [src/types/UserPortalNavigationBar/interface.ts:138](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortalNavigationBar/interface.ts#L138)

Custom logout handler
If not provided, uses default logout behavior based on mode

#### Returns

`void` \| `Promise`\<`void`\>

***

### onNavigation()?

> `optional` **onNavigation**: (`link`) => `void` \| `Promise`\<`void`\>

Defined in: [src/types/UserPortalNavigationBar/interface.ts:150](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortalNavigationBar/interface.ts#L150)

Custom navigation handler
If not provided, uses react-router navigation

#### Parameters

##### link

[`NavigationLink`](../../../types/UserPortalNavigationBar/types/type-aliases/NavigationLink.md)

#### Returns

`void` \| `Promise`\<`void`\>

***

### organizationId?

> `optional` **organizationId**: `string`

Defined in: [src/types/UserPortalNavigationBar/interface.ts:84](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortalNavigationBar/interface.ts#L84)

Organization ID - required for organization mode
Used for GraphQL queries and navigation

***

### organizationName?

> `optional` **organizationName**: `string`

Defined in: [src/types/UserPortalNavigationBar/interface.ts:90](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortalNavigationBar/interface.ts#L90)

Organization name - can be provided directly or fetched via GraphQL
If not provided and fetchOrganizationData is true, will be fetched

***

### showLanguageSelector?

> `optional` **showLanguageSelector**: `boolean`

Defined in: [src/types/UserPortalNavigationBar/interface.ts:108](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortalNavigationBar/interface.ts#L108)

Show language selector dropdown

#### Default

```ts
true
```

***

### showNotifications?

> `optional` **showNotifications**: `boolean`

Defined in: [src/types/UserPortalNavigationBar/interface.ts:102](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortalNavigationBar/interface.ts#L102)

Show notification icon component

#### Default

```ts
true when mode === 'user', false when mode === 'organization'
```

***

### showUserProfile?

> `optional` **showUserProfile**: `boolean`

Defined in: [src/types/UserPortalNavigationBar/interface.ts:114](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortalNavigationBar/interface.ts#L114)

Show user profile dropdown

#### Default

```ts
true
```

***

### userName?

> `optional` **userName**: `string`

Defined in: [src/types/UserPortalNavigationBar/interface.ts:166](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortalNavigationBar/interface.ts#L166)

Override user name (for testing or external state management)
If not provided, reads from localStorage

***

### variant?

> `optional` **variant**: `"dark"` \| `"light"`

Defined in: [src/types/UserPortalNavigationBar/interface.ts:120](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortalNavigationBar/interface.ts#L120)

Navbar color variant

#### Default

```ts
'dark'
```
