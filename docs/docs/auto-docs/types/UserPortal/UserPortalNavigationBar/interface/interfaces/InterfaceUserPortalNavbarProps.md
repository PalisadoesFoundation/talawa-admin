[Admin Docs](/)

***

# Interface: InterfaceUserPortalNavbarProps

Defined in: [src/types/UserPortal/UserPortalNavigationBar/interface.ts:54](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/UserPortalNavigationBar/interface.ts#L54)

Main component props interface

## Properties

### branding?

> `optional` **branding**: [`BrandingConfig`](../../types/type-aliases/BrandingConfig.md)

Defined in: [src/types/UserPortal/UserPortalNavigationBar/interface.ts:64](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/UserPortalNavigationBar/interface.ts#L64)

Branding configuration for logo and brand name

***

### className?

> `optional` **className**: `string`

Defined in: [src/types/UserPortal/UserPortalNavigationBar/interface.ts:153](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/UserPortalNavigationBar/interface.ts#L153)

Additional CSS class names

***

### currentPage?

> `optional` **currentPage**: `string`

Defined in: [src/types/UserPortal/UserPortalNavigationBar/interface.ts:76](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/UserPortalNavigationBar/interface.ts#L76)

Current active page identifier (matches NavigationLink.id)
Used to highlight the active navigation link

***

### customStyles?

> `optional` **customStyles**: `CSSProperties`

Defined in: [src/types/UserPortal/UserPortalNavigationBar/interface.ts:158](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/UserPortalNavigationBar/interface.ts#L158)

Inline styles

***

### expandBreakpoint?

> `optional` **expandBreakpoint**: `"sm"` \| `"md"` \| `"lg"` \| `"xl"`

Defined in: [src/types/UserPortal/UserPortalNavigationBar/interface.ts:124](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/UserPortalNavigationBar/interface.ts#L124)

Breakpoint at which navbar expands
default 'md'

***

### fetchOrganizationData?

> `optional` **fetchOrganizationData**: `boolean`

Defined in: [src/types/UserPortal/UserPortalNavigationBar/interface.ts:94](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/UserPortalNavigationBar/interface.ts#L94)

Whether to fetch organization data via GraphQL
default true when mode === 'organization'

***

### mobileLayout?

> `optional` **mobileLayout**: `"collapse"` \| `"offcanvas"`

Defined in: [src/types/UserPortal/UserPortalNavigationBar/interface.ts:130](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/UserPortalNavigationBar/interface.ts#L130)

Mobile layout style
default 'collapse' for user mode, 'offcanvas' for organization mode

***

### mode?

> `optional` **mode**: `"organization"` \| `"user"`

Defined in: [src/types/UserPortal/UserPortalNavigationBar/interface.ts:59](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/UserPortalNavigationBar/interface.ts#L59)

Navigation mode - determines default behavior and styling
default 'user'

***

### navigationLinks?

> `optional` **navigationLinks**: [`NavigationLink`](../../types/type-aliases/NavigationLink.md)[]

Defined in: [src/types/UserPortal/UserPortalNavigationBar/interface.ts:70](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/UserPortalNavigationBar/interface.ts#L70)

Array of navigation links to display in the navbar
Only shown in organization mode or when explicitly provided

***

### onLanguageChange()?

> `optional` **onLanguageChange**: (`languageCode`) => `void` \| `Promise`\<`void`\>

Defined in: [src/types/UserPortal/UserPortalNavigationBar/interface.ts:142](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/UserPortalNavigationBar/interface.ts#L142)

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

Defined in: [src/types/UserPortal/UserPortalNavigationBar/interface.ts:136](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/UserPortalNavigationBar/interface.ts#L136)

Custom logout handler
If not provided, uses default logout behavior based on mode

#### Returns

`void` \| `Promise`\<`void`\>

***

### onNavigation()?

> `optional` **onNavigation**: (`link`) => `void` \| `Promise`\<`void`\>

Defined in: [src/types/UserPortal/UserPortalNavigationBar/interface.ts:148](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/UserPortalNavigationBar/interface.ts#L148)

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

Defined in: [src/types/UserPortal/UserPortalNavigationBar/interface.ts:82](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/UserPortalNavigationBar/interface.ts#L82)

Organization ID - required for organization mode
Used for GraphQL queries and navigation

***

### organizationName?

> `optional` **organizationName**: `string`

Defined in: [src/types/UserPortal/UserPortalNavigationBar/interface.ts:88](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/UserPortalNavigationBar/interface.ts#L88)

Organization name - can be provided directly or fetched via GraphQL
If not provided and fetchOrganizationData is true, will be fetched

***

### showLanguageSelector?

> `optional` **showLanguageSelector**: `boolean`

Defined in: [src/types/UserPortal/UserPortalNavigationBar/interface.ts:106](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/UserPortalNavigationBar/interface.ts#L106)

Show language selector dropdown
default true

***

### showNotifications?

> `optional` **showNotifications**: `boolean`

Defined in: [src/types/UserPortal/UserPortalNavigationBar/interface.ts:100](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/UserPortalNavigationBar/interface.ts#L100)

Show notification icon component
default true when mode === 'user', false when mode === 'organization'

***

### showUserProfile?

> `optional` **showUserProfile**: `boolean`

Defined in: [src/types/UserPortal/UserPortalNavigationBar/interface.ts:112](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/UserPortalNavigationBar/interface.ts#L112)

Show user profile dropdown
default true

***

### userName?

> `optional` **userName**: `string`

Defined in: [src/types/UserPortal/UserPortalNavigationBar/interface.ts:164](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/UserPortalNavigationBar/interface.ts#L164)

Override user name (for testing or external state management)
If not provided, reads from localStorage

***

### variant?

> `optional` **variant**: `"dark"` \| `"light"`

Defined in: [src/types/UserPortal/UserPortalNavigationBar/interface.ts:118](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/UserPortalNavigationBar/interface.ts#L118)

Navbar color variant
default 'dark'
