[**talawa-admin**](../../../../README.md)

***

[talawa-admin](../../../../README.md) / [components/AgendaCategory/AgendaCategoryContainer](../README.md) / default

# Function: default()

> **default**(`props`): `JSX.Element`

Defined in: [src/components/AgendaCategory/AgendaCategoryContainer.tsx:34](https://github.com/gautam-divyanshu/talawa-admin/blob/334f0f7773e45df65600a1da08d00c41806347e4/src/components/AgendaCategory/AgendaCategoryContainer.tsx#L34)

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
