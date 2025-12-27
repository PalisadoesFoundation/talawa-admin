[**talawa-admin**](README.md)

***

# Variable: default

> `const` **default**: `React.FC`\<[`InterfaceUserPortalCardProps`](types\UserPortal\UserPortalCard\interface\README\interfaces\InterfaceUserPortalCardProps.md)\>

Defined in: [src/components/UserPortal/UserPortalCard/UserPortalCard.tsx:32](https://github.com/SujalTripathi/talawa-admin/blob/201c311285eee8900b55c8a032a23046ba8c861b/src/components/UserPortal/UserPortalCard/UserPortalCard.tsx#L32)

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
  ariaLabel={t('donation.card')}
  imageSlot={<Avatar />}
  actionsSlot={<Button />}
>
  <CardContent />
</UserPortalCard>
```
