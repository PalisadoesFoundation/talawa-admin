[Admin Docs](/)

***

# Function: default()

> **default**(): `UseSessionReturnType`

Defined in: [src/utils/useSession.tsx:30](https://github.com/abhassen44/talawa-admin/blob/285f7384c3d26b5028a286d84f89b85120d130a2/src/utils/useSession.tsx#L30)

Custom hook for managing user session timeouts in a React application.

This hook handles:
- Starting and ending the user session.
- Displaying a warning toast at half of the session timeout duration.
- Logging the user out and displaying a session expiration toast when the session times out.
- Automatically resetting the timers when user activity is detected.
- Pausing session timers when the tab is inactive and resuming them when it becomes active again.

## Returns

`UseSessionReturnType`

UseSessionReturnType - An object with methods to start and end the session, and to handle logout.
