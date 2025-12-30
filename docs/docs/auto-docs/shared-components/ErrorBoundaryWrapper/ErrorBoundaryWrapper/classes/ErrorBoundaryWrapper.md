[Admin Docs](/)

***

# Class: ErrorBoundaryWrapper

Defined in: [src/shared-components/ErrorBoundaryWrapper/ErrorBoundaryWrapper.tsx:51](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/ErrorBoundaryWrapper/ErrorBoundaryWrapper.tsx#L51)

## Extends

- `Component`\<[`InterfaceErrorBoundaryWrapperProps`](../../../../types/shared-components/ErrorBoundaryWrapper/interface/interfaces/InterfaceErrorBoundaryWrapperProps.md), [`InterfaceErrorBoundaryWrapperState`](../../../../types/shared-components/ErrorBoundaryWrapper/interface/interfaces/InterfaceErrorBoundaryWrapperState.md)\>

## Constructors

### Constructor

> **new ErrorBoundaryWrapper**(`props`): `ErrorBoundaryWrapper`

Defined in: [src/shared-components/ErrorBoundaryWrapper/ErrorBoundaryWrapper.tsx:56](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/ErrorBoundaryWrapper/ErrorBoundaryWrapper.tsx#L56)

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

Defined in: [src/shared-components/ErrorBoundaryWrapper/ErrorBoundaryWrapper.tsx:83](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/ErrorBoundaryWrapper/ErrorBoundaryWrapper.tsx#L83)

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

Defined in: [src/shared-components/ErrorBoundaryWrapper/ErrorBoundaryWrapper.tsx:110](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/ErrorBoundaryWrapper/ErrorBoundaryWrapper.tsx#L110)

Reset error boundary state to recover from error

#### Returns

`void`

***

### render()

> **render**(): `ReactNode`

Defined in: [src/shared-components/ErrorBoundaryWrapper/ErrorBoundaryWrapper.tsx:129](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/ErrorBoundaryWrapper/ErrorBoundaryWrapper.tsx#L129)

#### Returns

`ReactNode`

#### Overrides

`React.Component.render`

***

### getDerivedStateFromError()

> `static` **getDerivedStateFromError**(`error`): `Partial`\<[`InterfaceErrorBoundaryWrapperState`](../../../../types/shared-components/ErrorBoundaryWrapper/interface/interfaces/InterfaceErrorBoundaryWrapperState.md)\>

Defined in: [src/shared-components/ErrorBoundaryWrapper/ErrorBoundaryWrapper.tsx:69](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/ErrorBoundaryWrapper/ErrorBoundaryWrapper.tsx#L69)

Update state when an error is caught
This lifecycle method is called during the render phase (to change UI)

#### Parameters

##### error

`Error`

#### Returns

`Partial`\<[`InterfaceErrorBoundaryWrapperState`](../../../../types/shared-components/ErrorBoundaryWrapper/interface/interfaces/InterfaceErrorBoundaryWrapperState.md)\>
