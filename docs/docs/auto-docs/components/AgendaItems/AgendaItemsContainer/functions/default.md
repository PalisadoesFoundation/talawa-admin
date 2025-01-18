[Admin Docs](/)

***

# Function: default()

> **default**(`props`): `JSX.Element`

Defined in: [src/components/AgendaItems/AgendaItemsContainer.tsx:32](https://github.com/gautam-divyanshu/talawa-admin/blob/10f2081e01fc4f6c0767e35f8c4ed3f09fb1baac/src/components/AgendaItems/AgendaItemsContainer.tsx#L32)

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
