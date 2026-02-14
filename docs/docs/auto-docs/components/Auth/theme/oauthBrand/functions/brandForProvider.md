[Admin Docs](/)

***

# Function: brandForProvider()

> **brandForProvider**(`provider`): `InterfaceProviderBrand`

Defined in: [src/components/Auth/theme/oauthBrand.tsx:48](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/Auth/theme/oauthBrand.tsx#L48)

Retrieves the branding configuration for a specific OAuth provider.

## Parameters

### provider

`string`

The provider key (e.g., 'GOOGLE', 'GITHUB')

## Returns

`InterfaceProviderBrand`

The branding configuration for the provider, or Google branding as fallback

## Example

```tsx
const googleBrand = brandForProvider('GOOGLE');
console.log(googleBrand.displayName); // 'Google'
```
