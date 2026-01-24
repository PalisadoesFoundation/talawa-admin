[Admin Docs](/)

***

# Interface: InterfaceFormFieldProps

Defined in: src/types/shared-components/Auth/FormField/interface.ts:9

Props for the FormField component.

## Remarks

Supports optional validator callbacks and aria-live behaviors for accessibility.

## Properties

### ariaLive?

> `optional` **ariaLive**: `boolean`

Defined in: src/types/shared-components/Auth/FormField/interface.ts:51

Whether to use aria-live for dynamic error announcements.
When true, error messages are announced to screen readers.
Defaults to true.

***

### disabled?

> `optional` **disabled**: `boolean`

Defined in: src/types/shared-components/Auth/FormField/interface.ts:35

Whether the input is disabled

***

### error?

> `optional` **error**: `string`

Defined in: src/types/shared-components/Auth/FormField/interface.ts:41

Error message to display - null or undefined means no error

***

### helperText?

> `optional` **helperText**: `string`

Defined in: src/types/shared-components/Auth/FormField/interface.ts:44

Helper text to display below the input when no error

***

### label?

> `optional` **label**: `string`

Defined in: src/types/shared-components/Auth/FormField/interface.ts:11

Optional label text displayed above the input

***

### name

> **name**: `string`

Defined in: src/types/shared-components/Auth/FormField/interface.ts:14

Name attribute for the input field (required for form handling)

***

### onBlur()?

> `optional` **onBlur**: (`e`) => `void`

Defined in: src/types/shared-components/Auth/FormField/interface.ts:26

Blur handler called when input loses focus

#### Parameters

##### e

`FocusEvent`\<`HTMLInputElement`\>

#### Returns

`void`

***

### onChange()

> **onChange**: (`e`) => `void`

Defined in: src/types/shared-components/Auth/FormField/interface.ts:23

Change handler called when input value changes

#### Parameters

##### e

`ChangeEvent`\<`HTMLInputElement`\>

#### Returns

`void`

***

### placeholder?

> `optional` **placeholder**: `string`

Defined in: src/types/shared-components/Auth/FormField/interface.ts:29

Placeholder text for the input

***

### required?

> `optional` **required**: `boolean`

Defined in: src/types/shared-components/Auth/FormField/interface.ts:32

Whether the field is required - shows asterisk if true

***

### testId?

> `optional` **testId**: `string`

Defined in: src/types/shared-components/Auth/FormField/interface.ts:38

Test ID for testing purposes

***

### type?

> `optional` **type**: `"text"` \| `"email"` \| `"password"` \| `"tel"`

Defined in: src/types/shared-components/Auth/FormField/interface.ts:17

Input type - defaults to 'text'

***

### value

> **value**: `string`

Defined in: src/types/shared-components/Auth/FormField/interface.ts:20

Current input value
