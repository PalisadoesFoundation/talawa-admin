[**talawa-admin**](../../../../../README.md)

***

# Function: getMemberLabel()

> **getMemberLabel**(`member`): `string`

Defined in: [src/screens/UserPortal/Campaigns/PledgeModal.tsx:78](https://github.com/BittuBarnwal7479/talawa-admin/blob/7329c220ecd98ce2ec3fc0b9fc39dd1a39bb1df4/src/screens/UserPortal/Campaigns/PledgeModal.tsx#L78)

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
