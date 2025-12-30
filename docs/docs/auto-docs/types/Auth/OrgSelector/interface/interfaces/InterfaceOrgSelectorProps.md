[Admin Docs](/)

***

# Interface: InterfaceOrgSelectorProps

Defined in: [src/types/Auth/OrgSelector/interface.ts:19](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Auth/OrgSelector/interface.ts#L19)

Props for the OrgSelector component.

## Remarks

This component is designed for Phase 2 UI implementation.
Integration with validators will be handled in Phase 2b.

## Properties

### disabled?

> `optional` **disabled**: `boolean`

Defined in: [src/types/Auth/OrgSelector/interface.ts:36](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Auth/OrgSelector/interface.ts#L36)

Whether the selector is disabled

***

### error?

> `optional` **error**: `string`

Defined in: [src/types/Auth/OrgSelector/interface.ts:30](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Auth/OrgSelector/interface.ts#L30)

Error message to display - null or undefined means no error

***

### label?

> `optional` **label**: `string`

Defined in: [src/types/Auth/OrgSelector/interface.ts:42](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Auth/OrgSelector/interface.ts#L42)

Optional custom label text - defaults to "Organization"

***

### onChange()

> **onChange**: (`orgId`) => `void`

Defined in: [src/types/Auth/OrgSelector/interface.ts:27](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Auth/OrgSelector/interface.ts#L27)

Callback invoked when the selected organization changes

#### Parameters

##### orgId

`string`

#### Returns

`void`

***

### options

> **options**: [`InterfaceOrgOption`](InterfaceOrgOption.md)[]

Defined in: [src/types/Auth/OrgSelector/interface.ts:21](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Auth/OrgSelector/interface.ts#L21)

Array of available organizations to select from

***

### required?

> `optional` **required**: `boolean`

Defined in: [src/types/Auth/OrgSelector/interface.ts:39](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Auth/OrgSelector/interface.ts#L39)

Whether the field is required - shows asterisk if true

***

### testId?

> `optional` **testId**: `string`

Defined in: [src/types/Auth/OrgSelector/interface.ts:33](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Auth/OrgSelector/interface.ts#L33)

Test ID for testing purposes

***

### value?

> `optional` **value**: `string`

Defined in: [src/types/Auth/OrgSelector/interface.ts:24](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Auth/OrgSelector/interface.ts#L24)

Currently selected organization ID
