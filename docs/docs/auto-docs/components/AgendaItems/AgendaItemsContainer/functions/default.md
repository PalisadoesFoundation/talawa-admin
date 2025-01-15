[Admin Docs](/)

***

# Function: default()

> **default**(`props`): `JSX.Element`

Defined in: [src/components/AgendaItems/AgendaItemsContainer.tsx:32](https://github.com/gautam-divyanshu/talawa-admin/blob/d5fea688542032271211cd43ee86c7db0866bcc0/src/components/AgendaItems/AgendaItemsContainer.tsx#L32)

Component for displaying and managing agenda items.
Supports drag-and-drop functionality, and includes modals for previewing,
updating, and deleting agenda items.

## Parameters

### props

The props for the component.

#### agendaItemCategories

[`InterfaceAgendaItemCategoryInfo`](../../../../utils/interfaces/interfaces/InterfaceAgendaItemCategoryInfo.md)[]

#### agendaItemConnection

`"Event"`

#### agendaItemData

[`InterfaceAgendaItemInfo`](../../../../utils/interfaces/interfaces/InterfaceAgendaItemInfo.md)[]

#### agendaItemRefetch

() => `void`

## Returns

`JSX.Element`

JSX.Element
