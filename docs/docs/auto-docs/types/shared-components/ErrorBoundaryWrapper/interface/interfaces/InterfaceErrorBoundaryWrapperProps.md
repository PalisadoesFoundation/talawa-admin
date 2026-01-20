[Admin Docs](/)

***

# Interface: InterfaceErrorBoundaryWrapperProps

Defined in: [src/types/shared-components/ErrorBoundaryWrapper/interface.ts:27](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/ErrorBoundaryWrapper/interface.ts#L27)

Props for ErrorBoundaryWrapper component

ErrorBoundaryWrapper catches JavaScript errors anywhere in the child component tree,
logs those errors, and displays a fallback UI instead of crashing the entire app.

**Key Features:**
- Catches render errors that try-catch cannot handle
- Provides default and custom fallback UI options
- Integrates with toast notification system
- Supports error recovery via reset mechanism
- Allows error logging/tracking integration

## Example

```tsx
<ErrorBoundaryWrapper
  errorMessage={translatedErrorMessage}
  onError={(error, info) => logToService(error, info)}
  onReset={() => navigate('/dashboard')}
>
  <ComplexModal />
</ErrorBoundaryWrapper>
```

## Properties

### children

> **children**: `ReactNode`

Defined in: [src/types/shared-components/ErrorBoundaryWrapper/interface.ts:29](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/ErrorBoundaryWrapper/interface.ts#L29)

Child components to wrap with error boundary

***

### errorMessage?

> `optional` **errorMessage**: `string`

Defined in: [src/types/shared-components/ErrorBoundaryWrapper/interface.ts:48](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/ErrorBoundaryWrapper/interface.ts#L48)

Custom error message to display in toast notification.
Falls back to error.message or 'An unexpected error occurred' if not provided.

***

### fallback?

> `optional` **fallback**: `ReactNode`

Defined in: [src/types/shared-components/ErrorBoundaryWrapper/interface.ts:35](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/ErrorBoundaryWrapper/interface.ts#L35)

Custom fallback UI (JSX element) to display when an error occurs.
Takes precedence over default fallback but not over fallbackComponent.

***

### fallbackComponent?

> `optional` **fallbackComponent**: `ComponentType`\<[`InterfaceErrorFallbackProps`](InterfaceErrorFallbackProps.md)\>

Defined in: [src/types/shared-components/ErrorBoundaryWrapper/interface.ts:42](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/ErrorBoundaryWrapper/interface.ts#L42)

Custom fallback component that receives error details and reset function.
Takes precedence over both default fallback and custom JSX fallback.
Receives error and onReset as props.

***

### fallbackErrorMessage

> **fallbackErrorMessage**: `string`

Defined in: [src/types/shared-components/ErrorBoundaryWrapper/interface.ts:77](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/ErrorBoundaryWrapper/interface.ts#L77)

Translated fallback error message when error.message is unavailable.

***

### fallbackTitle

> **fallbackTitle**: `string`

Defined in: [src/types/shared-components/ErrorBoundaryWrapper/interface.ts:72](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/ErrorBoundaryWrapper/interface.ts#L72)

Translated title text for default fallback UI.

***

### onError()?

> `optional` **onError**: (`error`, `errorInfo`) => `void`

Defined in: [src/types/shared-components/ErrorBoundaryWrapper/interface.ts:61](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/ErrorBoundaryWrapper/interface.ts#L61)

Callback invoked when an error is caught.
Useful for logging errors to external services (e.g., Sentry, LogRocket).
Receives the Error object and ErrorInfo containing component stack trace.

#### Parameters

##### error

`Error`

##### errorInfo

`ErrorInfo`

#### Returns

`void`

***

### onReset()?

> `optional` **onReset**: () => `void`

Defined in: [src/types/shared-components/ErrorBoundaryWrapper/interface.ts:67](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/ErrorBoundaryWrapper/interface.ts#L67)

Callback invoked when user attempts to reset error state via the reset button.
Can be used to navigate away, refresh data, or perform cleanup operations.

#### Returns

`void`

***

### resetButtonAriaLabel

> **resetButtonAriaLabel**: `string`

Defined in: [src/types/shared-components/ErrorBoundaryWrapper/interface.ts:87](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/ErrorBoundaryWrapper/interface.ts#L87)

Translated aria-label for reset button (accessibility).

***

### resetButtonText

> **resetButtonText**: `string`

Defined in: [src/types/shared-components/ErrorBoundaryWrapper/interface.ts:82](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/ErrorBoundaryWrapper/interface.ts#L82)

Translated reset button text.

***

### showToast?

> `optional` **showToast**: `boolean`

Defined in: [src/types/shared-components/ErrorBoundaryWrapper/interface.ts:54](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/ErrorBoundaryWrapper/interface.ts#L54)

Whether to show toast notification on error.

#### Default

```ts
true
```
