[Admin Docs](/)

***

# Variable: default

> `const` **default**: `React.FC`\<[`InterfaceAgendaFolderCreateModalProps`](../../../../../../types/AdminPortal/Agenda/interface/interfaces/InterfaceAgendaFolderCreateModalProps.md)\>

Defined in: [src/components/AdminPortal/AgendaFolder/Create/AgendaFolderCreateModal.tsx:40](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/AdminPortal/AgendaFolder/Create/AgendaFolderCreateModal.tsx#L40)

AgendaFolderCreateModal

A modal component for creating a new agenda folder within an event.
It uses `CRUDModalTemplate` to provide a consistent CRUD-style UI and
handles folder creation via a GraphQL mutation.

Responsibilities:
- Renders a form to capture agenda folder name and description
- Computes the next folder sequence based on existing folders
- Executes the `CREATE_AGENDA_FOLDER_MUTATION`
- Displays success and error notifications
- Refetches agenda folder data after successful creation
- Prevents rendering when organization context is missing

## Param

Controls whether the modal is visible

## Param

Callback to close the modal

## Param

ID of the event for which the folder is being created

## Param

Existing agenda folder data used to calculate sequence

## Param

i18n translation function for agenda section

## Param

Callback to refetch agenda folder data after creation

## Returns

A JSX element rendering the agenda folder creation modal,
         or `null` if the organization ID is unavailable
