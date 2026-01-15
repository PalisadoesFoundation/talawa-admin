[**talawa-admin**](../../README.md)

***

# Function: areOptionsEqual()

> **areOptionsEqual**(`option`, `value`): `boolean`

Defined in: [src/screens/UserPortal/Campaigns/PledgeModal.tsx:88](https://github.com/Anshikaaa06/talawa-admin/blob/9e54ad8a0be6c052a435c30f5a6bbbad9b905bb5/src/screens/UserPortal/Campaigns/PledgeModal.tsx#L88)

Compares two user options by ID.
Used by MUI Autocomplete to determine equality.

## Parameters

### option

[`InterfaceUserInfoPG`](../../utils/interfaces/interfaces/InterfaceUserInfoPG.md)

Option from the Autocomplete list

### value

[`InterfaceUserInfoPG`](../../utils/interfaces/interfaces/InterfaceUserInfoPG.md)

Currently selected value

## Returns

`boolean`

True if both options refer to the same user

## Example

```ts
areOptionsEqual({ id: '1' } as InterfaceUserInfoPG, { id: '1' } as InterfaceUserInfoPG);
// returns true
```
