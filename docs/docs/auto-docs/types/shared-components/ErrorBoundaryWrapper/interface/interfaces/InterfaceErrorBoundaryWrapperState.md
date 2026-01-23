[**talawa-admin**](../../../../../README.md)

***

# Interface: InterfaceErrorBoundaryWrapperState

Defined in: [src/types/shared-components/ErrorBoundaryWrapper/interface.ts:96](https://github.com/VanshikaSabharwal/talawa-admin/blob/b013ea08c548e04dfa8e27b7d9e9418af9419ded/src/types/shared-components/ErrorBoundaryWrapper/interface.ts#L96)

Internal state for ErrorBoundaryWrapper component.

Tracks whether an error has occurred and stores error details for rendering
in the fallback UI.

## Properties

### error

> `readonly` **error**: `Error`

Defined in: [src/types/shared-components/ErrorBoundaryWrapper/interface.ts:100](https://github.com/VanshikaSabharwal/talawa-admin/blob/b013ea08c548e04dfa8e27b7d9e9418af9419ded/src/types/shared-components/ErrorBoundaryWrapper/interface.ts#L100)

The error that was caught

***

### errorInfo

> `readonly` **errorInfo**: `ErrorInfo`

Defined in: [src/types/shared-components/ErrorBoundaryWrapper/interface.ts:102](https://github.com/VanshikaSabharwal/talawa-admin/blob/b013ea08c548e04dfa8e27b7d9e9418af9419ded/src/types/shared-components/ErrorBoundaryWrapper/interface.ts#L102)

Additional error information including component stack.

***

### hasError

> `readonly` **hasError**: `boolean`

Defined in: [src/types/shared-components/ErrorBoundaryWrapper/interface.ts:98](https://github.com/VanshikaSabharwal/talawa-admin/blob/b013ea08c548e04dfa8e27b7d9e9418af9419ded/src/types/shared-components/ErrorBoundaryWrapper/interface.ts#L98)

Whether an error has been caught
