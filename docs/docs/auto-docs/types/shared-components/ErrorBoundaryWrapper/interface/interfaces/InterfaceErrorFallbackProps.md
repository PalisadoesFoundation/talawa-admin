[Admin Docs](/)

***

# Interface: InterfaceErrorFallbackProps

Defined in: [src/types/shared-components/ErrorBoundaryWrapper/interface.ts:102](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/ErrorBoundaryWrapper/interface.ts#L102)

Props passed to custom fallback components.

When using `fallbackComponent`, the component will receive these props
to render a custom error UI with access to error details and reset functionality.

## Example

```tsx
const CustomErrorFallback = ({ error, onReset }: InterfaceErrorFallbackProps) => (
  <div>
    <h2>Custom Error UI</h2>
    <p>{error?.message}</p>
    <button onClick={onReset}>Retry</button>
  </div>
);
```

## Properties

### error

> **error**: `Error`

Defined in: [src/types/shared-components/ErrorBoundaryWrapper/interface.ts:104](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/ErrorBoundaryWrapper/interface.ts#L104)

The error that was caught by the error boundary

***

### onReset()

> **onReset**: () => `void`

Defined in: [src/types/shared-components/ErrorBoundaryWrapper/interface.ts:106](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/ErrorBoundaryWrapper/interface.ts#L106)

Function to reset the error boundary state and attempt to re-render children

#### Returns

`void`
