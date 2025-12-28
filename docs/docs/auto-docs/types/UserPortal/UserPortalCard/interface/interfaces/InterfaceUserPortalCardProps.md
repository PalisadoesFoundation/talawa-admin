[Admin Docs](/)

***

# Interface: InterfaceUserPortalCardProps

Defined in: [src/types/UserPortal/UserPortalCard/interface.ts:20](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/UserPortalCard/interface.ts#L20)

Props for UserPortalCard — a flexible layout wrapper for User Portal cards.

Layout:
[ imageSlot ] [ children / content ] [ actionsSlot ]

This component centralizes layout, spacing, and density while keeping
all content and text controlled by consuming components.

## Properties

### actionsSlot?

> `optional` **actionsSlot**: `ReactNode`

Defined in: [src/types/UserPortal/UserPortalCard/interface.ts:23](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/UserPortalCard/interface.ts#L23)

Optional right section (buttons, badges, counters)

***

### ariaLabel?

> `optional` **ariaLabel**: `string`

Defined in: [src/types/UserPortal/UserPortalCard/interface.ts:27](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/UserPortalCard/interface.ts#L27)

Accessible label for the card container (i18n required)

***

### children

> **children**: `ReactNode`

Defined in: [src/types/UserPortal/UserPortalCard/interface.ts:22](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/UserPortalCard/interface.ts#L22)

Main content area (required)

***

### className?

> `optional` **className**: `string`

Defined in: [src/types/UserPortal/UserPortalCard/interface.ts:25](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/UserPortalCard/interface.ts#L25)

Optional additional class for the outer container

***

### dataTestId?

> `optional` **dataTestId**: `string`

Defined in: [src/types/UserPortal/UserPortalCard/interface.ts:26](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/UserPortalCard/interface.ts#L26)

Optional test id prefix for unit/e2e testing

***

### imageSlot?

> `optional` **imageSlot**: `ReactNode`

Defined in: [src/types/UserPortal/UserPortalCard/interface.ts:21](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/UserPortalCard/interface.ts#L21)

Optional left section (avatar, logo, thumbnail, icon)

***

### variant?

> `optional` **variant**: `"compact"` \| `"standard"` \| `"expanded"`

Defined in: [src/types/UserPortal/UserPortalCard/interface.ts:24](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/UserPortalCard/interface.ts#L24)

Visual density preset controlling padding and spacing
