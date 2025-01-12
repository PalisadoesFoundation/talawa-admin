[**talawa-admin**](../../../README.md)

***

[talawa-admin](../../../README.md) / [utils/useSession](../README.md) / default

# Function: default()

> **default**(): `UseSessionReturnType`

Defined in: [src/utils/useSession.tsx:30](https://github.com/bint-Eve/talawa-admin/blob/3ea1bc8148fd1f2efa92a17958ea5a5df0d9cc86/src/utils/useSession.tsx#L30)

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
