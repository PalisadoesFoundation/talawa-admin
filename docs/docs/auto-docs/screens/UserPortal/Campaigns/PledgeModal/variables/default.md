[Admin Docs](/)

---

# Variable: default

> `const` **default**: `React.FC`\<[`InterfacePledgeModal`](../../../../../types/UserPortal/PledgeModal/interface/interfaces/InterfacePledgeModal.md)\>

Defined in: [src/screens/UserPortal/Campaigns/PledgeModal.tsx:81](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/UserPortal/Campaigns/PledgeModal.tsx#L81)

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
