[Admin Docs](/)

***

# Type Alias: BrandingConfig

> **BrandingConfig** = `object`

Defined in: [src/types/UserPortal/UserPortalNavigationBar/types.ts:74](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/UserPortalNavigationBar/types.ts#L74)

Branding configuration for the navbar

## Properties

### brandName?

> `optional` **brandName**: `string`

Defined in: [src/types/UserPortal/UserPortalNavigationBar/types.ts:85](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/UserPortalNavigationBar/types.ts#L85)

Brand name to display next to logo

#### Default Value

```ts
'Talawa' for user mode, organization name for organization mode
```

***

### logo?

> `optional` **logo**: `string`

Defined in: [src/types/UserPortal/UserPortalNavigationBar/types.ts:79](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/UserPortalNavigationBar/types.ts#L79)

Logo image source URL or path

#### Default Value

```ts
Talawa logo from assets/images/talawa-logo-600x600.png
```

***

### logoAltText?

> `optional` **logoAltText**: `string`

Defined in: [src/types/UserPortal/UserPortalNavigationBar/types.ts:91](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/UserPortalNavigationBar/types.ts#L91)

Alt text for logo image

#### Default Value

```ts
Translation key 'userNavbar.talawaBranding'
```

***

### onBrandClick()?

> `optional` **onBrandClick**: () => `void`

Defined in: [src/types/UserPortal/UserPortalNavigationBar/types.ts:97](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/UserPortalNavigationBar/types.ts#L97)

Click handler for brand/logo

#### Returns

`void`

#### Default Value

```ts
undefined (no action)
```
