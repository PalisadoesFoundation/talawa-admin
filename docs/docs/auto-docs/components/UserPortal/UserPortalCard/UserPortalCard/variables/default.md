[Admin Docs](/)

***

# Variable: default

> `const` **default**: `React.FC`\<[`InterfaceUserPortalCardProps`](../../../../../types/UserPortal/UserPortalCard/interface/interfaces/InterfaceUserPortalCardProps.md)\>

Defined in: [src/components/UserPortal/UserPortalCard/UserPortalCard.tsx:32](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/UserPortal/UserPortalCard/UserPortalCard.tsx#L32)

UserPortalCard

Reusable 3-section layout wrapper for User Portal cards.

Structure:
[ imageSlot ] [ content (children) ] [ actionsSlot ]

Responsibilities:
- Centralizes spacing and alignment logic
- Supports density variants (compact / standard / expanded)
- Remains content-agnostic and styling-agnostic

Accessibility:
- role="group"
- aria-label provided by consumer (i18n required)

## Example

```ts
<UserPortalCard
  variant="compact"
  ariaLabel={t('donation.card_aria')}
  imageSlot={<ProfileAvatarDisplay fallbackName="User Name" />}
  actionsSlot={<Button />}
>
  <CardContent />
</UserPortalCard>
```
