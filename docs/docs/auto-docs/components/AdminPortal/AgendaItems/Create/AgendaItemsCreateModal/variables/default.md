[Admin Docs](/)

***

# Variable: default

> `const` **default**: `React.FC`\<[`InterfaceAgendaItemsCreateModalProps`](../../../../../../types/AdminPortal/Agenda/interface/interfaces/InterfaceAgendaItemsCreateModalProps.md)\>

Defined in: [src/components/AdminPortal/AgendaItems/Create/AgendaItemsCreateModal.tsx:62](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/AdminPortal/AgendaItems/Create/AgendaItemsCreateModal.tsx#L62)

AgendaItemsCreateModal

A modal component for creating a new agenda item within an event.
It uses `CRUDModalTemplate` to provide a consistent CRUD-style UI
and handles form state, validation, file uploads, and submission.

Responsibilities:
- Renders form fields for agenda item details (title, duration, description)
- Allows selecting a folder and category via autocomplete
- Manages URL input with validation and add/remove actions
- Handles attachment uploads using MinIO with size and MIME type validation
- Computes the next agenda item sequence based on existing folder items
- Executes the `CREATE_AGENDA_ITEM_MUTATION`
- Displays success and error notifications
- Refetches agenda folder data after successful creation

## Param

Controls whether the modal is visible

## Param

Callback to close the modal

## Param

ID of the event for which the agenda item is being created

## Param

i18n translation function for the agenda section

## Param

Available agenda item categories

## Param

Available agenda folders and their items

## Param

Callback to refetch agenda folder data after creation

## Returns

A JSX element rendering the agenda item creation modal
