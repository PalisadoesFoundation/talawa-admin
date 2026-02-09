[Admin Docs](/)

***

# Interface: InterfaceErrorPanelProps

Defined in: [src/shared-components/ErrorPanel/ErrorPanel.tsx:53](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/ErrorPanel/ErrorPanel.tsx#L53)

## Properties

### ariaLive?

> `optional` **ariaLive**: `"off"` \| `"polite"` \| `"assertive"`

Defined in: [src/shared-components/ErrorPanel/ErrorPanel.tsx:87](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/ErrorPanel/ErrorPanel.tsx#L87)

ARIA live region setting (only used when role is not 'alert', defaults to 'assertive')

***

### className?

> `optional` **className**: `string`

Defined in: [src/shared-components/ErrorPanel/ErrorPanel.tsx:77](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/ErrorPanel/ErrorPanel.tsx#L77)

Additional CSS class name for the container

***

### error

> **error**: `Error`

Defined in: [src/shared-components/ErrorPanel/ErrorPanel.tsx:62](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/ErrorPanel/ErrorPanel.tsx#L62)

The error object containing additional error details

***

### message

> **message**: `ReactNode`

Defined in: [src/shared-components/ErrorPanel/ErrorPanel.tsx:57](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/ErrorPanel/ErrorPanel.tsx#L57)

The main error message to display (can be a string or React node)

***

### onRetry()

> **onRetry**: () => `void`

Defined in: [src/shared-components/ErrorPanel/ErrorPanel.tsx:67](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/ErrorPanel/ErrorPanel.tsx#L67)

Callback function to retry the failed operation

#### Returns

`void`

***

### retryAriaLabel?

> `optional` **retryAriaLabel**: `string`

Defined in: [src/shared-components/ErrorPanel/ErrorPanel.tsx:92](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/ErrorPanel/ErrorPanel.tsx#L92)

ARIA label for the retry button (only set if different from button text)

***

### role?

> `optional` **role**: `"status"` \| `"alert"` \| `"log"` \| `"marquee"` \| `"timer"`

Defined in: [src/shared-components/ErrorPanel/ErrorPanel.tsx:82](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/ErrorPanel/ErrorPanel.tsx#L82)

ARIA role for accessibility (role="alert" implies aria-live="assertive", defaults to 'alert')

***

### showErrorDetails?

> `optional` **showErrorDetails**: `boolean`

Defined in: [src/shared-components/ErrorPanel/ErrorPanel.tsx:98](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/ErrorPanel/ErrorPanel.tsx#L98)

Whether to show raw error details (for development/debugging)
When false, displays a sanitized/truncated message instead (defaults to false)

***

### testId?

> `optional` **testId**: `string`

Defined in: [src/shared-components/ErrorPanel/ErrorPanel.tsx:72](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/ErrorPanel/ErrorPanel.tsx#L72)

Test ID for the error message container (defaults to 'errorMsg')
