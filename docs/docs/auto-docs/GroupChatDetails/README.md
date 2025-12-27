[**talawa-admin**](README.md)

***

# GroupChatDetails

Component for displaying and managing group chat details.

## Description

This component provides a modal interface for viewing and editing group chat details,
including the chat name, image, description, and members. It also allows adding new users
to the group chat and updating chat information.

## Param

The props for the component.

## Param

Determines if the group chat details modal is open.

## Param

Function to toggle the visibility of the modal.

## Param

The chat object containing details like name, image, description, and users.

## Param

Function to refetch chat data after updates.

## Remarks

- Uses `@mui/material` for table and modal styling.
- Integrates `react-bootstrap` for modal and form elements.
- Utilizes GraphQL queries and mutations for fetching and updating chat data.
- Includes localization support via `react-i18next`.
- Displays a loader while fetching user data.

## Example

```tsx
<GroupChatDetails
  groupChatDetailsModalisOpen={true}
  toggleGroupChatDetailsModal={handleToggle}
  chat={chatData}
  chatRefetch={refetchChatData}
/>
```

## Dependencies

- `@mui/material`
- `react-bootstrap`
- `@apollo/client`
- `react-i18next`
- `react-toastify`
- `react-icons`

## Functions

- [default](GroupChatDetails\README\functions\default.md)
