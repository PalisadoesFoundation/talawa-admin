[Admin Docs](/)

***

# Function: default()

> **default**(`props`): `JSX.Element`

Defined in: [src/components/Advertisements/core/AdvertisementRegister/AdvertisementRegister.tsx:79](https://github.com/syedali237/talawa-admin/blob/dd4a08e622d0fa38bcf9758a530e8cdf917dbac8/src/components/Advertisements/core/AdvertisementRegister/AdvertisementRegister.tsx#L79)

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
