[Admin Docs](/)

***

# Function: default()

> **default**(`props`): `Element`

Defined in: [src/components/Advertisements/core/AdvertisementRegister/AdvertisementRegister.tsx:57](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/Advertisements/core/AdvertisementRegister/AdvertisementRegister.tsx#L57)

Component for registering or editing an advertisement.

## Parameters

### props

[`InterfaceAddOnRegisterProps`](../../../../../../types/Advertisement/interface/interfaces/InterfaceAddOnRegisterProps.md)

Contains form status, advertisement details, and a function to update parent state.

## Returns

`Element`

A JSX element that renders a form inside a modal for creating or editing an advertisement.

## Example

```tsx
<AdvertisementRegister
  formStatus="register"
  setAfter={(value) => console.log(value)}
/>
```
