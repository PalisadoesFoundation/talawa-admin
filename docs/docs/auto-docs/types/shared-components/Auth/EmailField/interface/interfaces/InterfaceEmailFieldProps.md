[Admin Docs](/)

***

# Interface: InterfaceEmailFieldProps

Defined in: [src/types/shared-components/Auth/EmailField/interface.ts:10](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Auth/EmailField/interface.ts#L10)

Props for the EmailField component.

## Remarks

A specialized field for email input that composes FormField with email-specific defaults.
Supports optional validator callbacks via the error prop, which accepts string or null.

## Properties

### error?

> `optional` **error**: `string`

Defined in: [src/types/shared-components/Auth/EmailField/interface.ts:27](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Auth/EmailField/interface.ts#L27)

Error message to display - null or undefined means no error

***

### label?

> `optional` **label**: `string`

Defined in: [src/types/shared-components/Auth/EmailField/interface.ts:12](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Auth/EmailField/interface.ts#L12)

Optional label text displayed above the input - defaults to "Email"

***

### name?

> `optional` **name**: `string`

Defined in: [src/types/shared-components/Auth/EmailField/interface.ts:15](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Auth/EmailField/interface.ts#L15)

Name attribute for the input field - defaults to "email"

***

### onChange()

> **onChange**: (`e`) => `void`

Defined in: [src/types/shared-components/Auth/EmailField/interface.ts:21](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Auth/EmailField/interface.ts#L21)

Change handler called when input value changes

#### Parameters

##### e

`ChangeEvent`\<`HTMLInputElement`\>

#### Returns

`void`

***

### placeholder?

> `optional` **placeholder**: `string`

Defined in: [src/types/shared-components/Auth/EmailField/interface.ts:24](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Auth/EmailField/interface.ts#L24)

Placeholder text for the input - defaults to "name@example.com"

***

### testId?

> `optional` **testId**: `string`

Defined in: [src/types/shared-components/Auth/EmailField/interface.ts:30](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Auth/EmailField/interface.ts#L30)

Test ID for testing purposes

***

### value

> **value**: `string`

Defined in: [src/types/shared-components/Auth/EmailField/interface.ts:18](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Auth/EmailField/interface.ts#L18)

Current email input value
