[Admin Docs](/)

***

# Interface: InterfaceSearchBarProps

Defined in: [src/types/SearchBar/interface.ts:33](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/SearchBar/interface.ts#L33)

Strongly typed props for the shared SearchBar component.

## Extends

- `Omit`\<`React.InputHTMLAttributes`\<`HTMLInputElement`\>, `"onChange"` \| `"size"`\>

## Properties

### buttonAriaLabel

> **buttonAriaLabel**: `string`

Defined in: [src/types/SearchBar/interface.ts:61](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/SearchBar/interface.ts#L61)

Accessible label for the search button.

***

### buttonClassName?

> `optional` **buttonClassName**: `string`

Defined in: [src/types/SearchBar/interface.ts:55](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/SearchBar/interface.ts#L55)

Additional class applied to the search button.

***

### buttonTestId?

> `optional` **buttonTestId**: `string`

Defined in: [src/types/SearchBar/interface.ts:59](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/SearchBar/interface.ts#L59)

Button test id override.

***

### className?

> `optional` **className**: `string`

Defined in: [src/types/SearchBar/interface.ts:51](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/SearchBar/interface.ts#L51)

Additional class applied to the container.

#### Overrides

`Omit.className`

***

### clearButtonTestId?

> `optional` **clearButtonTestId**: `string`

Defined in: [src/types/SearchBar/interface.ts:63](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/SearchBar/interface.ts#L63)

Clear button test id override.

***

### defaultValue?

> `optional` **defaultValue**: `string`

Defined in: [src/types/SearchBar/interface.ts:43](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/SearchBar/interface.ts#L43)

Initial value when used in uncontrolled mode.

#### Overrides

`Omit.defaultValue`

***

### inputClassName?

> `optional` **inputClassName**: `string`

Defined in: [src/types/SearchBar/interface.ts:53](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/SearchBar/interface.ts#L53)

Additional class applied to the input element.

***

### inputTestId?

> `optional` **inputTestId**: `string`

Defined in: [src/types/SearchBar/interface.ts:57](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/SearchBar/interface.ts#L57)

Input test id override.

***

### onChange()?

> `optional` **onChange**: (`value`) => `void`

Defined in: [src/types/SearchBar/interface.ts:47](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/SearchBar/interface.ts#L47)

Callback fired whenever the input value changes.

#### Parameters

##### value

`string`

#### Returns

`void`

***

### onClear()?

> `optional` **onClear**: () => `void`

Defined in: [src/types/SearchBar/interface.ts:49](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/SearchBar/interface.ts#L49)

Callback fired after the clear button is pressed.

#### Returns

`void`

***

### onSearch()?

> `optional` **onSearch**: (`value`) => `void`

Defined in: [src/types/SearchBar/interface.ts:45](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/SearchBar/interface.ts#L45)

Callback invoked when the user submits a search via button, Enter, or clear.

#### Parameters

##### value

`string`

#### Returns

`void`

***

### placeholder?

> `optional` **placeholder**: `string`

Defined in: [src/types/SearchBar/interface.ts:39](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/SearchBar/interface.ts#L39)

Placeholder text for the search input.

#### Overrides

`Omit.placeholder`

***

### value?

> `optional` **value**: `string`

Defined in: [src/types/SearchBar/interface.ts:41](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/SearchBar/interface.ts#L41)

Controlled input value.

#### Overrides

`Omit.value`
