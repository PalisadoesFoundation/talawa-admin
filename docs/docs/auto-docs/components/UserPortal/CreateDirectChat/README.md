[**talawa-admin**](../../../README.md)

***

# components/UserPortal/CreateDirectChat

This component renders a modal for creating a direct chat with a user.
It allows users to search for other users and initiate a direct chat.

## File

CreateDirectChat.tsx

## Param

The props for the component.

## Param

Determines if the modal is open.

## Param

Function to toggle the modal visibility.

## Param

Function to refetch the chat list.

## Param

List of existing group chats.

## Remarks

- Uses Apollo Client for GraphQL queries and mutations.
- Integrates with Material-UI and React-Bootstrap for UI components.
- Includes a search functionality to filter users by name.

## Example

```tsx
<CreateDirectChatModal
  toggleCreateDirectChatModal={toggleModal}
  createDirectChatModalisOpen={isModalOpen}
  chatsListRefetch={refetchChats}
  chats={existingChats}
/>
```

## Functions

- [default](functions/default.md)
- [handleCreateDirectChat](functions/handleCreateDirectChat.md)
