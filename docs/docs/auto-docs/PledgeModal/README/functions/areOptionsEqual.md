[**talawa-admin**](README.md)

***

# Function: areOptionsEqual()

> **areOptionsEqual**(`option`, `value`): `boolean`

Defined in: [src/screens/UserPortal/Campaigns/PledgeModal.tsx:88](https://github.com/SujalTripathi/talawa-admin/blob/201c311285eee8900b55c8a032a23046ba8c861b/src/screens/UserPortal/Campaigns/PledgeModal.tsx#L88)

Compares two user options by ID.
Used by MUI Autocomplete to determine equality.

## Parameters

### option

[`InterfaceUserInfoPG`](utils\interfaces\README\interfaces\InterfaceUserInfoPG.md)

Option from the Autocomplete list

### value

[`InterfaceUserInfoPG`](utils\interfaces\README\interfaces\InterfaceUserInfoPG.md)

Currently selected value

## Returns

`boolean`

True if both options refer to the same user

## Example

```ts
areOptionsEqual({ id: '1' } as InterfaceUserInfoPG, { id: '1' } as InterfaceUserInfoPG);
// returns true
```
