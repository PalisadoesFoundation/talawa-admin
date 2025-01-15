[Admin Docs](/)

***

# Function: default()

> **default**(`props`): `JSX.Element`

Defined in: [src/components/Advertisements/core/AdvertisementRegister/AdvertisementRegister.tsx:60](https://github.com/gautam-divyanshu/talawa-admin/blob/d5fea688542032271211cd43ee86c7db0866bcc0/src/components/Advertisements/core/AdvertisementRegister/AdvertisementRegister.tsx#L60)

Component for registering or editing an advertisement.

## Parameters

### props

`InterfaceAddOnRegisterProps`

Contains form status, advertisement details, and a function to update parent state.

## Returns

`JSX.Element`

A JSX element that renders a form inside a modal for creating or editing an advertisement.

## Example

```tsx
<AdvertisementRegister
  formStatus="register"
  setAfter={(value) => console.log(value)}
/>
```
