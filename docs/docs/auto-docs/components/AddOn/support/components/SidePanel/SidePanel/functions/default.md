[Admin Docs](/)

***

# Function: default()

> **default**(`props`): `JSX.Element`

Defined in: [src/components/AddOn/support/components/SidePanel/SidePanel.tsx:19](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/AddOn/support/components/SidePanel/SidePanel.tsx#L19)

A React component that renders a side panel with an optional collapse state.

## Parameters

### props

[`InterfaceSidePanelProps`](../../../../../../../types/AddOn/interface/interfaces/InterfaceSidePanelProps.md)

The properties for the component.

## Returns

`JSX.Element`

A JSX element containing the side panel with the provided child elements.

## Example

```ts
<SidePanel collapse="true">
  <p>Side panel content</p>
</SidePanel>
```
