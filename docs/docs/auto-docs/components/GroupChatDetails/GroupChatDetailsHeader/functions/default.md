[Admin Docs](/)

***

# Function: default()

> **default**(`__namedParameters`): `Element`

Defined in: [src/components/GroupChatDetails/GroupChatDetailsHeader.tsx:38](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/GroupChatDetails/GroupChatDetailsHeader.tsx#L38)

GroupChatDetailsHeader

Header for the Group Chat Details modal. Renders the chat image (or avatar),
the chat name with edit controls, member count and description. Shows admin
actions (delete) when `currentUserRole` is `administrator`.

Props mirror `InterfaceGroupChatDetailsHeaderProps` and include handler
callbacks for image and title editing. All user-facing strings are
internationalized via the `t` function.

## Parameters

### \_\_namedParameters

`InterfaceGroupChatDetailsHeaderProps`

## Returns

`Element`
