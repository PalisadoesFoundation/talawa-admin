[Admin Docs](/)

***

# Function: default()

> **default**(`props`): `Element`

Defined in: [src/screens/AdminPortal/ManageTag/ManageTagModal.tsx:26](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/AdminPortal/ManageTag/ManageTagModal.tsx#L26)

Modal component for viewing, editing, and deleting a tag.

## Parameters

### props

[`InterfaceManageTagModalProps`](../../../../../types/AdminPortal/Tags/interface/interfaces/InterfaceManageTagModalProps.md)

Component props typed by [InterfaceManageTagModalProps](../../../../../types/AdminPortal/Tags/interface/interfaces/InterfaceManageTagModalProps.md).

## Returns

`Element`

JSX element rendering edit/delete/view controls for a tag.

## Remarks

`props.open` controls visibility, `props.tag` is the selected tag,
`props.onClose` closes the modal, `props.onRefetch` refreshes tag data,
`props.onViewTag` opens the tag view, and the `*TestId` props provide stable selectors.
