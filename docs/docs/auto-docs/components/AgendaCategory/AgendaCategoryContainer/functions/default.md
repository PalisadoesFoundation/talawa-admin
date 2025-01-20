[Admin Docs](/)

***

# Function: default()

> **default**(`props`): `JSX.Element`

<<<<<<< HEAD
Defined in: [src/components/AgendaCategory/AgendaCategoryContainer.tsx:34](https://github.com/abhassen44/talawa-admin/blob/285f7384c3d26b5028a286d84f89b85120d130a2/src/components/AgendaCategory/AgendaCategoryContainer.tsx#L34)
=======
Defined in: [src/components/AgendaCategory/AgendaCategoryContainer.tsx:34](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/AgendaCategory/AgendaCategoryContainer.tsx#L34)
>>>>>>> 0c0fc8e1d54e2ef61a81dd93e93d1afca438df84

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
