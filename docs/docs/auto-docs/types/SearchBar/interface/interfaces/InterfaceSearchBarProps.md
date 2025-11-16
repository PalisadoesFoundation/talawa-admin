[Admin Docs](/)

***

# Interface: InterfaceSearchBarProps

Defined in: [src/types/SearchBar/interface.ts:25](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/SearchBar/interface.ts#L25)

Strongly typed props for the shared SearchBar component.

## Extends

- `Omit`\<`React.InputHTMLAttributes`\<`HTMLInputElement`\>, `"onChange"` \| `"size"`\>

## Properties

### buttonAriaLabel?

> `optional` **buttonAriaLabel**: `string`

Defined in: [src/types/SearchBar/interface.ts:67](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/SearchBar/interface.ts#L67)

Accessible label for the search button.

***

### buttonClassName?

> `optional` **buttonClassName**: `string`

Defined in: [src/types/SearchBar/interface.ts:47](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/SearchBar/interface.ts#L47)

Additional class applied to the search button.

***

### buttonLabel?

> `optional` **buttonLabel**: `string`

Defined in: [src/types/SearchBar/interface.ts:65](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/SearchBar/interface.ts#L65)

Optional label shown inside the search button.

***

### buttonTestId?

> `optional` **buttonTestId**: `string`

Defined in: [src/types/SearchBar/interface.ts:51](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/SearchBar/interface.ts#L51)

Button test id override.

***

### className?

> `optional` **className**: `string`

Defined in: [src/types/SearchBar/interface.ts:43](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/SearchBar/interface.ts#L43)

Additional class applied to the container.

#### Overrides

`Omit.className`

***

### clearButtonTestId?

> `optional` **clearButtonTestId**: `string`

Defined in: [src/types/SearchBar/interface.ts:53](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/SearchBar/interface.ts#L53)

Clear button test id override.

***

### defaultValue?

> `optional` **defaultValue**: `string`

Defined in: [src/types/SearchBar/interface.ts:35](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/SearchBar/interface.ts#L35)

Initial value when used in uncontrolled mode.

#### Overrides

`Omit.defaultValue`

***

### icon?

> `optional` **icon**: `ReactNode`

Defined in: [src/types/SearchBar/interface.ts:71](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/SearchBar/interface.ts#L71)

Optional custom icon rendered inside the input field.

***

### inputClassName?

> `optional` **inputClassName**: `string`

Defined in: [src/types/SearchBar/interface.ts:45](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/SearchBar/interface.ts#L45)

Additional class applied to the input element.

***

### inputTestId?

> `optional` **inputTestId**: `string`

Defined in: [src/types/SearchBar/interface.ts:49](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/SearchBar/interface.ts#L49)

Input test id override.

***

### isLoading?

> `optional` **isLoading**: `boolean`

Defined in: [src/types/SearchBar/interface.ts:69](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/SearchBar/interface.ts#L69)

Renders a loading spinner inside the button when true.

***

### onChange()?

> `optional` **onChange**: (`value`, `event`) => `void`

Defined in: [src/types/SearchBar/interface.ts:39](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/SearchBar/interface.ts#L39)

Callback fired whenever the input value changes.

#### Parameters

##### value

`string`

##### event

`ChangeEvent`\<`HTMLInputElement`\>

#### Returns

`void`

***

### onClear()?

> `optional` **onClear**: () => `void`

Defined in: [src/types/SearchBar/interface.ts:41](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/SearchBar/interface.ts#L41)

Callback fired after the clear button is pressed.

#### Returns

`void`

***

### onSearch()?

> `optional` **onSearch**: (`value`, `metadata?`) => `void`

Defined in: [src/types/SearchBar/interface.ts:37](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/SearchBar/interface.ts#L37)

Callback invoked when the user submits a search via button, Enter, or clear.

#### Parameters

##### value

`string`

##### metadata?

[`InterfaceSearchMeta`](InterfaceSearchMeta.md)

#### Returns

`void`

***

### placeholder?

> `optional` **placeholder**: `string`

Defined in: [src/types/SearchBar/interface.ts:31](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/SearchBar/interface.ts#L31)

Placeholder text for the search input.

#### Overrides

`Omit.placeholder`

***

### showClearButton?

> `optional` **showClearButton**: `boolean`

Defined in: [src/types/SearchBar/interface.ts:61](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/SearchBar/interface.ts#L61)

Toggle visibility of the inline clear button. Defaults to true.

***

### showLeadingIcon?

> `optional` **showLeadingIcon**: `boolean`

Defined in: [src/types/SearchBar/interface.ts:63](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/SearchBar/interface.ts#L63)

Toggle the leading search icon visibility. Defaults to true.

***

### showSearchButton?

> `optional` **showSearchButton**: `boolean`

Defined in: [src/types/SearchBar/interface.ts:59](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/SearchBar/interface.ts#L59)

Toggle visibility of the trailing search button. Defaults to true.

***

### size?

> `optional` **size**: [`SearchBarSize`](../../type/type-aliases/SearchBarSize.md)

Defined in: [src/types/SearchBar/interface.ts:55](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/SearchBar/interface.ts#L55)

Visual size of the component.

***

### value?

> `optional` **value**: `string`

Defined in: [src/types/SearchBar/interface.ts:33](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/SearchBar/interface.ts#L33)

Controlled input value.

#### Overrides

`Omit.value`

***

### variant?

> `optional` **variant**: [`SearchBarVariant`](../../type/type-aliases/SearchBarVariant.md)

Defined in: [src/types/SearchBar/interface.ts:57](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/SearchBar/interface.ts#L57)

Visual variant of the component.
