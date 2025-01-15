[**talawa-admin**](../../../../../../README.md)

***

[talawa-admin](../../../../../../README.md) / [components/Advertisements/core/AdvertisementRegister/AdvertisementRegister](../README.md) / default

# Function: default()

> **default**(`props`): `JSX.Element`

Defined in: [src/components/Advertisements/core/AdvertisementRegister/AdvertisementRegister.tsx:60](https://github.com/gautam-divyanshu/talawa-admin/blob/2490b2ea9583ec972ca984b1d93932def1c9f92b/src/components/Advertisements/core/AdvertisementRegister/AdvertisementRegister.tsx#L60)

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
