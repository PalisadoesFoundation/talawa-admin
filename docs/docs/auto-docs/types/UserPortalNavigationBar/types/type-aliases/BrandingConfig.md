[**talawa-admin**](../../../../README.md)

***

# Type Alias: BrandingConfig

> **BrandingConfig** = `object`

Defined in: [src/types/UserPortalNavigationBar/types.ts:76](https://github.com/VanshikaSabharwal/talawa-admin/blob/b013ea08c548e04dfa8e27b7d9e9418af9419ded/src/types/UserPortalNavigationBar/types.ts#L76)

Branding configuration for the navbar

## Properties

### brandName?

> `optional` **brandName**: `string`

Defined in: [src/types/UserPortalNavigationBar/types.ts:87](https://github.com/VanshikaSabharwal/talawa-admin/blob/b013ea08c548e04dfa8e27b7d9e9418af9419ded/src/types/UserPortalNavigationBar/types.ts#L87)

Brand name to display next to logo

#### Default

```ts
'Talawa' for user mode, organization name for organization mode
```

***

### logo?

> `optional` **logo**: `string`

Defined in: [src/types/UserPortalNavigationBar/types.ts:81](https://github.com/VanshikaSabharwal/talawa-admin/blob/b013ea08c548e04dfa8e27b7d9e9418af9419ded/src/types/UserPortalNavigationBar/types.ts#L81)

Logo image source URL or path

#### Default

```ts
Talawa logo from assets/images/talawa-logo-600x600.png
```

***

### logoAltText?

> `optional` **logoAltText**: `string`

Defined in: [src/types/UserPortalNavigationBar/types.ts:93](https://github.com/VanshikaSabharwal/talawa-admin/blob/b013ea08c548e04dfa8e27b7d9e9418af9419ded/src/types/UserPortalNavigationBar/types.ts#L93)

Alt text for logo image

#### Default

```ts
Translation key 'userNavbar.talawaBranding'
```

***

### onBrandClick()?

> `optional` **onBrandClick**: () => `void`

Defined in: [src/types/UserPortalNavigationBar/types.ts:99](https://github.com/VanshikaSabharwal/talawa-admin/blob/b013ea08c548e04dfa8e27b7d9e9418af9419ded/src/types/UserPortalNavigationBar/types.ts#L99)

Click handler for brand/logo

#### Returns

`void`

#### Default

```ts
undefined (no action)
```
