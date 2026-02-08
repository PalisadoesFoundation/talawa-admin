[Admin Docs](/)

***

# Class: ErrorBoundaryWrapper

Defined in: [src/shared-components/ErrorBoundaryWrapper/ErrorBoundaryWrapper.tsx:55](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/ErrorBoundaryWrapper/ErrorBoundaryWrapper.tsx#L55)

## Extends

- `Component`\<[`InterfaceErrorBoundaryWrapperProps`](../../../../types/shared-components/ErrorBoundaryWrapper/interface/interfaces/InterfaceErrorBoundaryWrapperProps.md), [`InterfaceErrorBoundaryWrapperState`](../../../../types/shared-components/ErrorBoundaryWrapper/interface/interfaces/InterfaceErrorBoundaryWrapperState.md)\>

## Constructors

### Constructor

> **new ErrorBoundaryWrapper**(`props`): `ErrorBoundaryWrapper`

Defined in: [src/shared-components/ErrorBoundaryWrapper/ErrorBoundaryWrapper.tsx:60](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/ErrorBoundaryWrapper/ErrorBoundaryWrapper.tsx#L60)

#### Parameters

##### props

[`InterfaceErrorBoundaryWrapperProps`](../../../../types/shared-components/ErrorBoundaryWrapper/interface/interfaces/InterfaceErrorBoundaryWrapperProps.md)

#### Returns

`ErrorBoundaryWrapper`

#### Overrides

`React.Component< InterfaceErrorBoundaryWrapperProps, InterfaceErrorBoundaryWrapperState >.constructor`

## Methods

### componentDidCatch()

> **componentDidCatch**(`error`, `errorInfo`): `void`

Defined in: [src/shared-components/ErrorBoundaryWrapper/ErrorBoundaryWrapper.tsx:87](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/ErrorBoundaryWrapper/ErrorBoundaryWrapper.tsx#L87)

Log error details after an error has been caught
This lifecycle method is called during the commit phase (to log/ report)

#### Parameters

##### error

`Error`

##### errorInfo

`ErrorInfo`

#### Returns

`void`

#### Overrides

`React.Component.componentDidCatch`

***

### handleReset()

> **handleReset**(): `void`

Defined in: [src/shared-components/ErrorBoundaryWrapper/ErrorBoundaryWrapper.tsx:114](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/ErrorBoundaryWrapper/ErrorBoundaryWrapper.tsx#L114)

Reset error boundary state to recover from error

#### Returns

`void`

***

### render()

> **render**(): `ReactNode`

Defined in: [src/shared-components/ErrorBoundaryWrapper/ErrorBoundaryWrapper.tsx:133](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/ErrorBoundaryWrapper/ErrorBoundaryWrapper.tsx#L133)

#### Returns

`ReactNode`

#### Overrides

`React.Component.render`

***

### getDerivedStateFromError()

> `static` **getDerivedStateFromError**(`error`): `Partial`\<[`InterfaceErrorBoundaryWrapperState`](../../../../types/shared-components/ErrorBoundaryWrapper/interface/interfaces/InterfaceErrorBoundaryWrapperState.md)\>

Defined in: [src/shared-components/ErrorBoundaryWrapper/ErrorBoundaryWrapper.tsx:73](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/ErrorBoundaryWrapper/ErrorBoundaryWrapper.tsx#L73)

Update state when an error is caught
This lifecycle method is called during the render phase (to change UI)

#### Parameters

##### error

`Error`

#### Returns

`Partial`\<[`InterfaceErrorBoundaryWrapperState`](../../../../types/shared-components/ErrorBoundaryWrapper/interface/interfaces/InterfaceErrorBoundaryWrapperState.md)\>
