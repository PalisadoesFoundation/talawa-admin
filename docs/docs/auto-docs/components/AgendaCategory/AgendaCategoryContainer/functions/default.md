[Admin Docs](/)

***

# Function: default()

> **default**(`props`): `JSX.Element`

Defined in: [src/components/AgendaCategory/AgendaCategoryContainer.tsx:34](https://github.com/syedali237/talawa-admin/blob/dd4a08e622d0fa38bcf9758a530e8cdf917dbac8/src/components/AgendaCategory/AgendaCategoryContainer.tsx#L34)

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
