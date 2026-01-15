[**talawa-admin**](../../README.md)

***

# Function: getMemberLabel()

> **getMemberLabel**(`member`): `string`

Defined in: [src/screens/UserPortal/Campaigns/PledgeModal.tsx:104](https://github.com/Anshikaaa06/talawa-admin/blob/9e54ad8a0be6c052a435c30f5a6bbbad9b905bb5/src/screens/UserPortal/Campaigns/PledgeModal.tsx#L104)

Builds a display label for a member.
Empty name parts are safely ignored.

## Parameters

### member

[`InterfaceUserInfoPG`](../../utils/interfaces/interfaces/InterfaceUserInfoPG.md)

User object containing name fields

## Returns

`string`

Full name string constructed from available name parts

## Example

```ts
getMemberLabel({ firstName: 'John', lastName: 'Doe' } as InterfaceUserInfoPG);
// returns "John Doe"
```
