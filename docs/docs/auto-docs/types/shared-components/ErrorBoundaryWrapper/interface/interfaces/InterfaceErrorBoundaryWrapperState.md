[Admin Docs](/)

***

# Interface: InterfaceErrorBoundaryWrapperState

Defined in: [src/types/shared-components/ErrorBoundaryWrapper/interface.ts:76](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/ErrorBoundaryWrapper/interface.ts#L76)

Internal state for ErrorBoundaryWrapper component.

Tracks whether an error has occurred and stores error details for rendering
in the fallback UI.

## Properties

### error

> **error**: `Error`

Defined in: [src/types/shared-components/ErrorBoundaryWrapper/interface.ts:80](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/ErrorBoundaryWrapper/interface.ts#L80)

The error that was caught

***

### errorInfo

> **errorInfo**: `ErrorInfo`

Defined in: [src/types/shared-components/ErrorBoundaryWrapper/interface.ts:82](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/ErrorBoundaryWrapper/interface.ts#L82)

Additional error information including component stack

***

### hasError

> **hasError**: `boolean`

Defined in: [src/types/shared-components/ErrorBoundaryWrapper/interface.ts:78](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/ErrorBoundaryWrapper/interface.ts#L78)

Whether an error has been caught
