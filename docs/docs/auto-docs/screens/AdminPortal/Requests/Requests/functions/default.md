[Admin Docs](/)

***

# Function: default()

> **default**(): `Element`

Defined in: [src/screens/AdminPortal/Requests/Requests.tsx:80](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/AdminPortal/Requests/Requests.tsx#L80)

Renders the Membership Requests screen.

Responsibilities:
- Displays membership requests with infinite scroll support
- Supports search submission via SearchFilterBar
- Shows user avatars and request details
- Handles accept and reject request actions
- Shows empty state via DataGrid overlay when no requests exist

Localization:
- Uses `common` and `requests` namespaces

## Returns

`Element`

JSX.Element
