[Admin Docs](/)

***

# Interface: InterfaceUserPortalCardProps

Defined in: [src/types/UserPortal/UserPortalCard/interface.ts:20](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/UserPortalCard/interface.ts#L20)

Props for UserPortalCard — a flexible layout wrapper for User Portal cards.

Layout:
[ imageSlot ] [ children / content ] [ actionsSlot ]

This component centralizes layout, spacing, and density while keeping
all content and text controlled by consuming components.

## Param

(Optional) Left section (avatar, logo, thumbnail, icon)

## Param

Main content area (required)

## Param

(Optional) Right section (buttons, badges, counters)

## Param

Visual density preset controlling padding and spacing

## Param

(Optional) Additional class for the outer container

## Param

(Optional) Test id prefix for unit/e2e testing

## Param

Accessible label for the card container (i18n required)

## Properties

### actionsSlot?

> `optional` **actionsSlot**: `ReactNode`

Defined in: [src/types/UserPortal/UserPortalCard/interface.ts:23](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/UserPortalCard/interface.ts#L23)

***

### ariaLabel?

> `optional` **ariaLabel**: `string`

Defined in: [src/types/UserPortal/UserPortalCard/interface.ts:27](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/UserPortalCard/interface.ts#L27)

***

### children

> **children**: `ReactNode`

Defined in: [src/types/UserPortal/UserPortalCard/interface.ts:22](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/UserPortalCard/interface.ts#L22)

***

### className?

> `optional` **className**: `string`

Defined in: [src/types/UserPortal/UserPortalCard/interface.ts:25](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/UserPortalCard/interface.ts#L25)

***

### dataTestId?

> `optional` **dataTestId**: `string`

Defined in: [src/types/UserPortal/UserPortalCard/interface.ts:26](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/UserPortalCard/interface.ts#L26)

***

### imageSlot?

> `optional` **imageSlot**: `ReactNode`

Defined in: [src/types/UserPortal/UserPortalCard/interface.ts:21](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/UserPortalCard/interface.ts#L21)

***

### variant?

> `optional` **variant**: `"compact"` \| `"standard"` \| `"expanded"`

Defined in: [src/types/UserPortal/UserPortalCard/interface.ts:24](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/UserPortalCard/interface.ts#L24)
