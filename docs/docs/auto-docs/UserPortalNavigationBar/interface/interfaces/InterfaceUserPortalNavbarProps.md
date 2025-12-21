[Admin Docs](/)

***

# Interface: InterfaceUserPortalNavbarProps

Defined in: [src/types/UserPortalNavigationBar/interface.ts:52](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortalNavigationBar/interface.ts#L52)

Main component props interface

## Properties

### branding?

> `optional` **branding**: [`BrandingConfig`](../../types/type-aliases/BrandingConfig.md)

Defined in: [src/types/UserPortalNavigationBar/interface.ts:62](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortalNavigationBar/interface.ts#L62)

Branding configuration for logo and brand name

***

### className?

> `optional` **className**: `string`

Defined in: [src/types/UserPortalNavigationBar/interface.ts:151](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortalNavigationBar/interface.ts#L151)

Additional CSS class names

***

### currentPage?

> `optional` **currentPage**: `string`

Defined in: [src/types/UserPortalNavigationBar/interface.ts:74](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortalNavigationBar/interface.ts#L74)

Current active page identifier (matches NavigationLink.id)
Used to highlight the active navigation link

***

### customStyles?

> `optional` **customStyles**: `CSSProperties`

Defined in: [src/types/UserPortalNavigationBar/interface.ts:156](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortalNavigationBar/interface.ts#L156)

Inline styles

***

### expandBreakpoint?

> `optional` **expandBreakpoint**: `"sm"` \| `"md"` \| `"lg"` \| `"xl"`

Defined in: [src/types/UserPortalNavigationBar/interface.ts:122](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortalNavigationBar/interface.ts#L122)

Breakpoint at which navbar expands

#### Default

```ts
'md'
```

***

### fetchOrganizationData?

> `optional` **fetchOrganizationData**: `boolean`

Defined in: [src/types/UserPortalNavigationBar/interface.ts:92](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortalNavigationBar/interface.ts#L92)

Whether to fetch organization data via GraphQL

#### Default

```ts
true when mode === 'organization'
```

***

### mobileLayout?

> `optional` **mobileLayout**: `"collapse"` \| `"offcanvas"`

Defined in: [src/types/UserPortalNavigationBar/interface.ts:128](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortalNavigationBar/interface.ts#L128)

Mobile layout style

#### Default

```ts
'collapse' for user mode, 'offcanvas' for organization mode
```

***

### mode

> **mode**: `"organization"` \| `"user"`

Defined in: [src/types/UserPortalNavigationBar/interface.ts:57](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortalNavigationBar/interface.ts#L57)

Navigation mode - determines default behavior and styling

#### Default

```ts
'user'
```

***

### navigationLinks?

> `optional` **navigationLinks**: [`NavigationLink`](../../types/type-aliases/NavigationLink.md)[]

Defined in: [src/types/UserPortalNavigationBar/interface.ts:68](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortalNavigationBar/interface.ts#L68)

Array of navigation links to display in the navbar
Only shown in organization mode or when explicitly provided

***

### onLanguageChange()?

> `optional` **onLanguageChange**: (`languageCode`) => `void` \| `Promise`\<`void`\>

Defined in: [src/types/UserPortalNavigationBar/interface.ts:140](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortalNavigationBar/interface.ts#L140)

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

Defined in: [src/types/UserPortalNavigationBar/interface.ts:134](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortalNavigationBar/interface.ts#L134)

Custom logout handler
If not provided, uses default logout behavior based on mode

#### Returns

`void` \| `Promise`\<`void`\>

***

### onNavigation()?

> `optional` **onNavigation**: (`link`) => `void` \| `Promise`\<`void`\>

Defined in: [src/types/UserPortalNavigationBar/interface.ts:146](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortalNavigationBar/interface.ts#L146)

Custom navigation handler
If not provided, uses react-router navigation

#### Parameters

##### link

[`NavigationLink`](../../types/type-aliases/NavigationLink.md)

#### Returns

`void` \| `Promise`\<`void`\>

***

### organizationId?

> `optional` **organizationId**: `string`

Defined in: [src/types/UserPortalNavigationBar/interface.ts:80](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortalNavigationBar/interface.ts#L80)

Organization ID - required for organization mode
Used for GraphQL queries and navigation

***

### organizationName?

> `optional` **organizationName**: `string`

Defined in: [src/types/UserPortalNavigationBar/interface.ts:86](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortalNavigationBar/interface.ts#L86)

Organization name - can be provided directly or fetched via GraphQL
If not provided and fetchOrganizationData is true, will be fetched

***

### showLanguageSelector?

> `optional` **showLanguageSelector**: `boolean`

Defined in: [src/types/UserPortalNavigationBar/interface.ts:104](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortalNavigationBar/interface.ts#L104)

Show language selector dropdown

#### Default

```ts
true
```

***

### showNotifications?

> `optional` **showNotifications**: `boolean`

Defined in: [src/types/UserPortalNavigationBar/interface.ts:98](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortalNavigationBar/interface.ts#L98)

Show notification icon component

#### Default

```ts
true when mode === 'user', false when mode === 'organization'
```

***

### showUserProfile?

> `optional` **showUserProfile**: `boolean`

Defined in: [src/types/UserPortalNavigationBar/interface.ts:110](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortalNavigationBar/interface.ts#L110)

Show user profile dropdown

#### Default

```ts
true
```

***

### userName?

> `optional` **userName**: `string`

Defined in: [src/types/UserPortalNavigationBar/interface.ts:162](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortalNavigationBar/interface.ts#L162)

Override user name (for testing or external state management)
If not provided, reads from localStorage

***

### variant?

> `optional` **variant**: `"dark"` \| `"light"`

Defined in: [src/types/UserPortalNavigationBar/interface.ts:116](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortalNavigationBar/interface.ts#L116)

Navbar color variant

#### Default

```ts
'dark'
```
