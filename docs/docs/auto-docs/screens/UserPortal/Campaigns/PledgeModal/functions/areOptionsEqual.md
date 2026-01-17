[Admin Docs](/)

***

# Function: areOptionsEqual()

> **areOptionsEqual**(`option`, `value`): `boolean`

Defined in: [src/screens/UserPortal/Campaigns/PledgeModal.tsx:57](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/UserPortal/Campaigns/PledgeModal.tsx#L57)

Compares two user options by ID.
Used by MUI Autocomplete to determine equality.

## Parameters

### option

[`InterfaceUserInfoPG`](../../../../../utils/interfaces/interfaces/InterfaceUserInfoPG.md)

Option from the Autocomplete list

### value

[`InterfaceUserInfoPG`](../../../../../utils/interfaces/interfaces/InterfaceUserInfoPG.md)

Currently selected value

## Returns

`boolean`

True if both options refer to the same user

## Example

```ts
areOptionsEqual(
{ id: '1' } as InterfaceUserInfoPG,
{ id: '1' } as InterfaceUserInfoPG,
);
// returns true
```
