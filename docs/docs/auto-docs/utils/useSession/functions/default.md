[Admin Docs](/)

***

# Function: default()

> **default**(): `UseSessionReturnType`

Defined in: [src/utils/useSession.tsx:30](https://github.com/gautam-divyanshu/talawa-admin/blob/7e5a95aa37ca1c5b95489b6b18ea8cf85fb3559b/src/utils/useSession.tsx#L30)

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
