[Admin Docs](/)

***

# Function: default()

> **default**(`props`): `JSX.Element`

<<<<<<< HEAD
Defined in: [src/components/Advertisements/core/AdvertisementRegister/AdvertisementRegister.tsx:79](https://github.com/abhassen44/talawa-admin/blob/285f7384c3d26b5028a286d84f89b85120d130a2/src/components/Advertisements/core/AdvertisementRegister/AdvertisementRegister.tsx#L79)
=======
Defined in: [src/components/Advertisements/core/AdvertisementRegister/AdvertisementRegister.tsx:79](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/Advertisements/core/AdvertisementRegister/AdvertisementRegister.tsx#L79)
>>>>>>> 0c0fc8e1d54e2ef61a81dd93e93d1afca438df84

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
