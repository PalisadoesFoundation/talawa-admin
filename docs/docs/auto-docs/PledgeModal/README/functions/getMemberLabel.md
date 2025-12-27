[**talawa-admin**](README.md)

***

# Function: getMemberLabel()

> **getMemberLabel**(`member`): `string`

Defined in: [src/screens/UserPortal/Campaigns/PledgeModal.tsx:104](https://github.com/SujalTripathi/talawa-admin/blob/ed913970521689f5a1e8aec0179ffa2d67f07028/src/screens/UserPortal/Campaigns/PledgeModal.tsx#L104)

Builds a display label for a member.
Empty name parts are safely ignored.

## Parameters

### member

[`InterfaceUserInfoPG`](utils\interfaces\README\interfaces\InterfaceUserInfoPG.md)

User object containing name fields

## Returns

`string`

Full name string constructed from available name parts

## Example

```ts
getMemberLabel({ firstName: 'John', lastName: 'Doe' } as InterfaceUserInfoPG);
// returns "John Doe"
```
