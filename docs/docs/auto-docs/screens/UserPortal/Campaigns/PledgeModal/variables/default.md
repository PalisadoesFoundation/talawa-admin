[**talawa-admin**](../../../../../README.md)

***

# Variable: default

> `const` **default**: `React.FC`\<[`InterfacePledgeModal`](../interfaces/InterfacePledgeModal.md)\>

Defined in: [src/screens/UserPortal/Campaigns/PledgeModal.tsx:102](https://github.com/BittuBarnwal7479/talawa-admin/blob/7329c220ecd98ce2ec3fc0b9fc39dd1a39bb1df4/src/screens/UserPortal/Campaigns/PledgeModal.tsx#L102)

Modal component for creating or editing pledges in a campaign.

## Remarks

Integrates internationalization and GraphQL operations for pledge creation and updates.

## Param

Props for the PledgeModal component.

## Returns

Rendered `PledgeModal` component.

## Example

```tsx
<PledgeModal
isOpen={true}
hide={() => {}}
campaignId="123"
userId="456"
pledge={null}
refetchPledge={() => {}}
mode="create"
/>
```
