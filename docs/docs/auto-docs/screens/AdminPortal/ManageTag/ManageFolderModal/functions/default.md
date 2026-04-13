[Admin Docs](/)

***

# Function: default()

> **default**(`props`): `Element`

Defined in: [src/screens/AdminPortal/ManageTag/ManageFolderModal.tsx:26](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/AdminPortal/ManageTag/ManageFolderModal.tsx#L26)

Modal component for editing and deleting a tag folder.

## Parameters

### props

[`InterfaceManageFolderModalProps`](../../../../../types/AdminPortal/Tags/interface/interfaces/InterfaceManageFolderModalProps.md)

Component props typed by [InterfaceManageFolderModalProps](../../../../../types/AdminPortal/Tags/interface/interfaces/InterfaceManageFolderModalProps.md).

## Returns

`Element`

JSX element rendering save/delete controls for a folder.

## Remarks

`props.open` controls visibility, `props.folder` is the selected folder,
`props.onClose` closes the modal, `props.onRefetch` refreshes folder/tag data,
and the `*TestId` props provide stable selectors.
