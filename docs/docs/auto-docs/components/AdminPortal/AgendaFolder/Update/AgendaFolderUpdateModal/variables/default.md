[Admin Docs](/)

***

# Variable: default

> `const` **default**: `React.FC`\<[`InterfaceAgendaFolderUpdateModalProps`](../../../../../../types/AdminPortal/Agenda/interface/interfaces/InterfaceAgendaFolderUpdateModalProps.md)\>

Defined in: [src/components/AdminPortal/AgendaFolder/Update/AgendaFolderUpdateModal.tsx:30](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/AdminPortal/AgendaFolder/Update/AgendaFolderUpdateModal.tsx#L30)

AgendaFolderUpdateModal Component

This component renders a modal for updating an existing agenda folder.
It provides form fields for editing the folder name and description
and submits the updated data using an internal GraphQL mutation.

## Remarks

The component:
- Displays a modal using `BaseModal`
- Manages controlled form inputs for folder name and description
- Submits updated folder data via a callback function
- Supports internationalization using `react-i18next`

## Returns

A JSX element that renders the agenda folder update modal.
