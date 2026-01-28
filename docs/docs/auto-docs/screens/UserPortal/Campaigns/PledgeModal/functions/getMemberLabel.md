[**talawa-admin**](../../../../../README.md)

***

# Function: getMemberLabel()

> **getMemberLabel**(`member`): `string`

Defined in: [src/screens/UserPortal/Campaigns/PledgeModal.tsx:78](https://github.com/MonishPuttu/talawa-admin/blob/4630ca9b3a05c039a7c82f0e137454f2802795b4/src/screens/UserPortal/Campaigns/PledgeModal.tsx#L78)

Builds a display label for a member.
Empty name parts are safely ignored.

## Parameters

### member

[`InterfaceUserInfoPG`](../../../../../utils/interfaces/interfaces/InterfaceUserInfoPG.md)

User object containing name fields

## Returns

`string`

Full name string constructed from available name parts

## Example

```ts
getMemberLabel({
firstName: 'John',
lastName: 'Doe',
} as InterfaceUserInfoPG);
// returns "John Doe"
```
