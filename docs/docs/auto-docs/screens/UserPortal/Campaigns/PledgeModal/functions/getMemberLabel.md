[**talawa-admin**](../../../../../README.md)

***

# Function: getMemberLabel()

> **getMemberLabel**(`member`): `string`

Defined in: [src/screens/UserPortal/Campaigns/PledgeModal.tsx:81](https://github.com/yb175/talawa-admin/blob/fce1167047be7ffe368e3ca73cbf38141b19703e/src/screens/UserPortal/Campaigns/PledgeModal.tsx#L81)

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
