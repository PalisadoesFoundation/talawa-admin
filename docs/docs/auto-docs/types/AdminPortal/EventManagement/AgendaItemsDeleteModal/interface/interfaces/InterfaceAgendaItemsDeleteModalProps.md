[Admin Docs](/)

---

# Interface: InterfaceAgendaItemsDeleteModalProps

Defined in: [src/types/AdminPortal/EventManagement/AgendaItemsDeleteModal/interface.ts:20](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/EventManagement/AgendaItemsDeleteModal/interface.ts#L20)

Interface for the AgendaItemsDeleteModal component props.
Defines the visibility state, event handlers, and translation functions required by the modal.

## Properties

### agendaItemDeleteModalIsOpen

> **agendaItemDeleteModalIsOpen**: `boolean`

Defined in: [src/types/AdminPortal/EventManagement/AgendaItemsDeleteModal/interface.ts:22](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/EventManagement/AgendaItemsDeleteModal/interface.ts#L22)

Controls whether the delete confirmation modal is visible

---

### deleteAgendaItemHandler()

> **deleteAgendaItemHandler**: () => `void`

Defined in: [src/types/AdminPortal/EventManagement/AgendaItemsDeleteModal/interface.ts:28](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/EventManagement/AgendaItemsDeleteModal/interface.ts#L28)

Event handler to execute the logic for deleting an agenda item

#### Returns

`void`

---

### toggleDeleteModal()

> **toggleDeleteModal**: () => `void`

Defined in: [src/types/AdminPortal/EventManagement/AgendaItemsDeleteModal/interface.ts:25](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/EventManagement/AgendaItemsDeleteModal/interface.ts#L25)

Function to toggle or close the modal visibility

#### Returns

`void`
