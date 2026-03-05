[**talawa-admin**](../../../../../README.md)

***

# Function: brandForProvider()

> **brandForProvider**(`provider`): `InterfaceProviderBrand`

Defined in: [src/components/Auth/theme/oauthBrand.tsx:49](https://github.com/yb175/talawa-admin/blob/fce1167047be7ffe368e3ca73cbf38141b19703e/src/components/Auth/theme/oauthBrand.tsx#L49)

Retrieves the branding configuration for a specific OAuth provider.

## Parameters

### provider

[`OAuthProviderKey`](../../../../../types/Auth/auth/type-aliases/OAuthProviderKey.md)

The provider key (e.g., 'GOOGLE', 'GITHUB')

## Returns

`InterfaceProviderBrand`

The branding configuration for the provider, or Google branding as fallback

## Example

```tsx
const googleBrand = brandForProvider('GOOGLE');
console.log(googleBrand.displayName); // 'Google'
```
