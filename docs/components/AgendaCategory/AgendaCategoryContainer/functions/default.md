[**talawa-admin**](../../../../README.md)

***

# Function: default()

> **default**(`props`): `JSX.Element`

Defined in: [src/components/AgendaCategory/AgendaCategoryContainer.tsx:34](https://github.com/MayankJha014/talawa-admin/blob/0dd35cc200a4ed7562fa81ab87ec9b2a6facd18b/src/components/AgendaCategory/AgendaCategoryContainer.tsx#L34)

Component for displaying and managing agenda item categories.

## Parameters

### props

Contains agenda category data and functions for data management.

#### agendaCategoryConnection

`"Organization"`

#### agendaCategoryData

[`InterfaceAgendaItemCategoryInfo`](../../../../utils/interfaces/interfaces/InterfaceAgendaItemCategoryInfo.md)[]

#### agendaCategoryRefetch

() => `void`

## Returns

`JSX.Element`

A JSX element that renders agenda item categories with options to preview, edit, and delete.

## Example

```tsx
<AgendaCategoryContainer
  agendaCategoryConnection="Organization"
  agendaCategoryData={data}
  agendaCategoryRefetch={refetch}
/>
```
