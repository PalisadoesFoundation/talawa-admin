[Admin Docs](/)

***

# Function: default()

> **default**(`props`): `Element`

Defined in: [src/screens/AdminPortal/ManageTag/ManageFolderModal.tsx:26](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/AdminPortal/ManageTag/ManageFolderModal.tsx#L26)

Modal component for viewing, editing, and deleting a tag folder.

## Parameters

### props

[`InterfaceManageFolderModalProps`](../../../../../types/AdminPortal/Tags/interface/interfaces/InterfaceManageFolderModalProps.md)

Component props typed by [InterfaceManageFolderModalProps](../../../../../types/AdminPortal/Tags/interface/interfaces/InterfaceManageFolderModalProps.md).

## Returns

`Element`

JSX element rendering edit/delete/view controls for a folder.

## Remarks

`props.open` controls visibility, `props.folder` is the selected folder,
`props.onClose` closes the modal, `props.onRefetch` refreshes folder/tag data,
`props.onViewFolder` opens folder view, and the `*TestId` props provide stable selectors.
