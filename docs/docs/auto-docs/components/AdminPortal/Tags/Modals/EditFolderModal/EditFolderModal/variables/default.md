[Admin Docs](/)

***

# Variable: default

> `const` **default**: `React.FC`\<[`InterfaceManageFolderModalProps`](../../../../../../../types/AdminPortal/Tags/interface/interfaces/InterfaceManageFolderModalProps.md)\>

Defined in: [src/components/AdminPortal/Tags/Modals/EditFolderModal/EditFolderModal.tsx:25](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/AdminPortal/Tags/Modals/EditFolderModal/EditFolderModal.tsx#L25)

Modal component for editing and deleting a tag folder.

## Param

Component props typed by [InterfaceManageFolderModalProps](../../../../../../../types/AdminPortal/Tags/interface/interfaces/InterfaceManageFolderModalProps.md).

## Remarks

`props.open` controls visibility, `props.folder` is the selected folder,
`props.onClose` closes the modal, `props.onRefetch` refreshes folder/tag data,
and the `*TestId` props provide stable selectors.

## Returns

JSX element rendering save/delete controls for a folder.
