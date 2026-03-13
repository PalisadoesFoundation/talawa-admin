[Admin Docs](/)

***

# Function: OAuthSection()

> **OAuthSection**(`props`): `Element`

Defined in: [src/components/Auth/OAuthSection/OAuthSection.tsx:29](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/Auth/OAuthSection/OAuthSection.tsx#L29)

Renders the OAuth authentication section for auth screens.

Displays a divider followed by the enabled third-party OAuth providers
for the current authentication mode.

## Parameters

### props

`Props`

The component props

## Returns

`Element`

A section containing the enabled OAuth buttons, or null when no providers are enabled

## Example

```tsx
<OAuthSection mode="login" />
```
