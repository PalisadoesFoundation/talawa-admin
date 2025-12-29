[Admin Docs](/)

***

# Interface: InterfaceErrorBoundaryWrapperState

Defined in: [src/types/shared-components/ErrorBoundaryWrapper/interface.ts:100](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/ErrorBoundaryWrapper/interface.ts#L100)

Internal state for ErrorBoundaryWrapper component.

Tracks whether an error has occurred and stores error details for rendering
in the fallback UI.

## Properties

### error

> **error**: `Error`

Defined in: [src/types/shared-components/ErrorBoundaryWrapper/interface.ts:104](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/ErrorBoundaryWrapper/interface.ts#L104)

The error that was caught

***

### errorInfo

> **errorInfo**: `ErrorInfo`

Defined in: [src/types/shared-components/ErrorBoundaryWrapper/interface.ts:106](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/ErrorBoundaryWrapper/interface.ts#L106)

Additional error information including component stack

***

### hasError

> **hasError**: `boolean`

Defined in: [src/types/shared-components/ErrorBoundaryWrapper/interface.ts:102](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/ErrorBoundaryWrapper/interface.ts#L102)

Whether an error has been caught
