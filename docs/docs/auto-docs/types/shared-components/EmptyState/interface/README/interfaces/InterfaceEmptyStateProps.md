[Admin Docs](/)

***

# Interface: InterfaceEmptyStateProps

Defined in: [src/types/shared-components/EmptyState/interface.ts:4](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/EmptyState/interface.ts#L4)

Props interface for the EmptyState component.

## Properties

### action?

> `optional` **action**: `object`

Defined in: [src/types/shared-components/EmptyState/interface.ts:23](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/EmptyState/interface.ts#L23)

Action button configuration.

#### label

> **label**: `string`

#### onClick()

> **onClick**: () => `void`

##### Returns

`void`

#### variant?

> `optional` **variant**: `"primary"` \| `"secondary"` \| `"outlined"`

***

### className?

> `optional` **className**: `string`

Defined in: [src/types/shared-components/EmptyState/interface.ts:32](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/EmptyState/interface.ts#L32)

Custom CSS class name.

***

### dataTestId?

> `optional` **dataTestId**: `string`

Defined in: [src/types/shared-components/EmptyState/interface.ts:37](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/EmptyState/interface.ts#L37)

Test identifier.

***

### description?

> `optional` **description**: `string`

Defined in: [src/types/shared-components/EmptyState/interface.ts:13](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/EmptyState/interface.ts#L13)

(Optional) Secondary description text.

***

### icon?

> `optional` **icon**: `ReactNode`

Defined in: [src/types/shared-components/EmptyState/interface.ts:18](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/EmptyState/interface.ts#L18)

Icon to display above the message.

***

### message

> **message**: `string`

Defined in: [src/types/shared-components/EmptyState/interface.ts:8](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/EmptyState/interface.ts#L8)

Primary message to display (i18n key or plain string) (Required).
