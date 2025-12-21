[Admin Docs](/)

***

# Type Alias: BrandingConfig

> **BrandingConfig** = `object`

Defined in: [src/types/UserPortalNavigationBar/types.ts:75](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortalNavigationBar/types.ts#L75)

Branding configuration for the navbar

## Properties

### brandName?

> `optional` **brandName**: `string`

Defined in: [src/types/UserPortalNavigationBar/types.ts:86](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortalNavigationBar/types.ts#L86)

Brand name to display next to logo

#### Default

```ts
'Talawa' for user mode, organization name for organization mode
```

***

### logo?

> `optional` **logo**: `string`

Defined in: [src/types/UserPortalNavigationBar/types.ts:80](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortalNavigationBar/types.ts#L80)

Logo image source URL or path

#### Default

```ts
Talawa logo from assets/images/talawa-logo-600x600.png
```

***

### logoAltText?

> `optional` **logoAltText**: `string`

Defined in: [src/types/UserPortalNavigationBar/types.ts:92](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortalNavigationBar/types.ts#L92)

Alt text for logo image

#### Default

```ts
Translation key 'userNavbar.talawaBranding'
```

***

### onBrandClick()?

> `optional` **onBrandClick**: () => `void`

Defined in: [src/types/UserPortalNavigationBar/types.ts:98](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortalNavigationBar/types.ts#L98)

Click handler for brand/logo

#### Returns

`void`

#### Default

```ts
undefined (no action)
```
