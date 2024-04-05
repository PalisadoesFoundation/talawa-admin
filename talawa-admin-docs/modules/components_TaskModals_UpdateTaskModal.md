[talawa-admin](../README.md) / [Modules](../modules.md) / components/TaskModals/UpdateTaskModal

# Module: components/TaskModals/UpdateTaskModal

## Table of contents

### Type Aliases

- [ModalPropType](components_TaskModals_UpdateTaskModal.md#modalproptype)

### Functions

- [UpdateTaskModal](components_TaskModals_UpdateTaskModal.md#updatetaskmodal)

## Type Aliases

### ModalPropType

Ƭ **ModalPropType**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `handleClose` | () => `void` |
| `organization` | { `_id`: `string` ; `members`: `InterfaceUser`[]  } |
| `organization._id` | `string` |
| `organization.members` | `InterfaceUser`[] |
| `refetchData` | () => `void` |
| `show` | `boolean` |
| `task` | `InterfaceTask` |

#### Defined in

[src/components/TaskModals/UpdateTaskModal.tsx:31](https://github.com/PalisadoesFoundation/talawa-admin/blob/b619a0d/src/components/TaskModals/UpdateTaskModal.tsx#L31)

## Functions

### UpdateTaskModal

▸ **UpdateTaskModal**(`props`): `Element`

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | [`ModalPropType`](components_TaskModals_UpdateTaskModal.md#modalproptype) |

#### Returns

`Element`

#### Defined in

[src/components/TaskModals/UpdateTaskModal.tsx:42](https://github.com/PalisadoesFoundation/talawa-admin/blob/b619a0d/src/components/TaskModals/UpdateTaskModal.tsx#L42)
