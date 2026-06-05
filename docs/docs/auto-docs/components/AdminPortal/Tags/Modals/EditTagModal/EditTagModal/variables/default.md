[Admin Docs](/)

***

# Variable: default

> `const` **default**: `React.FC`\<[`InterfaceManageTagModalProps`](../../../../../../../types/AdminPortal/Tags/interface/interfaces/InterfaceManageTagModalProps.md)\>

Defined in: [src/components/AdminPortal/Tags/Modals/EditTagModal/EditTagModal.tsx:25](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/AdminPortal/Tags/Modals/EditTagModal/EditTagModal.tsx#L25)

Modal component for editing and deleting a tag.

## Param

Component props typed by [InterfaceManageTagModalProps](../../../../../../../types/AdminPortal/Tags/interface/interfaces/InterfaceManageTagModalProps.md).

## Remarks

`props.open` controls visibility, `props.tag` is the selected tag,
`props.onClose` closes the modal, `props.onRefetch` refreshes tag data,
and the `*TestId` props provide stable selectors.

## Returns

JSX element rendering save/delete controls for a tag.
