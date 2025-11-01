[**talawa-admin**](../../../README.md)

***

# Function: default()

> **default**(): `UseSessionReturnType`

Defined in: [src/utils/useSession.tsx:30](https://github.com/iamanishx/talawa-admin/blob/7201593995ccfacf6f05849e614f59bf2c15323f/src/utils/useSession.tsx#L30)

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
