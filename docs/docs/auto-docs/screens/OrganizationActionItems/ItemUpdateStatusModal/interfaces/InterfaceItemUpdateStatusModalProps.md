[Admin Docs](/)

***

# Interface: InterfaceItemUpdateStatusModalProps

Defined in: [src/screens/OrganizationActionItems/ItemUpdateStatusModal.tsx:27](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/OrganizationActionItems/ItemUpdateStatusModal.tsx#L27)

The ItemUpdateStatusModal component displays a modal window that allows users to update
the status of an action item. It supports updating the post-completion notes and toggling
the completion status using a GraphQL mutation.

It uses Apollo Client for data fetching and mutations, react-i18next for localization,
and React-Bootstrap along with MUI components for the UI.

## Properties

### actionItem

> **actionItem**: [`InterfaceActionItem`](../../../../utils/interfaces/interfaces/InterfaceActionItem.md)

Defined in: [src/screens/OrganizationActionItems/ItemUpdateStatusModal.tsx:31](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/OrganizationActionItems/ItemUpdateStatusModal.tsx#L31)

***

### actionItemsRefetch()

> **actionItemsRefetch**: () => `void`

Defined in: [src/screens/OrganizationActionItems/ItemUpdateStatusModal.tsx:30](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/OrganizationActionItems/ItemUpdateStatusModal.tsx#L30)

#### Returns

`void`

***

### hide()

> **hide**: () => `void`

Defined in: [src/screens/OrganizationActionItems/ItemUpdateStatusModal.tsx:29](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/OrganizationActionItems/ItemUpdateStatusModal.tsx#L29)

#### Returns

`void`

***

### isOpen

> **isOpen**: `boolean`

Defined in: [src/screens/OrganizationActionItems/ItemUpdateStatusModal.tsx:28](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/OrganizationActionItems/ItemUpdateStatusModal.tsx#L28)
