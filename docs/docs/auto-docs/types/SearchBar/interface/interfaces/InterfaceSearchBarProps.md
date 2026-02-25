[Admin Docs](/)

***

# Interface: InterfaceSearchBarProps

Defined in: [src/types/SearchBar/interface.ts:33](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/SearchBar/interface.ts#L33)

Strongly typed props for the shared SearchBar component.

## Extends

- `Omit`\<`React.InputHTMLAttributes`\<`HTMLInputElement`\>, `"onChange"` \| `"size"`\>

## Properties

### buttonAriaLabel?

> `optional` **buttonAriaLabel**: `string`

Defined in: [src/types/SearchBar/interface.ts:76](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/SearchBar/interface.ts#L76)

Accessible label for the search button.

***

### buttonClassName?

> `optional` **buttonClassName**: `string`

Defined in: [src/types/SearchBar/interface.ts:54](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/SearchBar/interface.ts#L54)

Additional class applied to the search button.

***

### buttonLabel?

> `optional` **buttonLabel**: `string`

Defined in: [src/types/SearchBar/interface.ts:74](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/SearchBar/interface.ts#L74)

Optional label shown inside the search button.

***

### buttonTestId?

> `optional` **buttonTestId**: `string`

Defined in: [src/types/SearchBar/interface.ts:58](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/SearchBar/interface.ts#L58)

Button test id override.

***

### className?

> `optional` **className**: `string`

Defined in: [src/types/SearchBar/interface.ts:50](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/SearchBar/interface.ts#L50)

Additional class applied to the container.

#### Overrides

`Omit.className`

***

### clearButtonAriaLabel?

> `optional` **clearButtonAriaLabel**: `string`

Defined in: [src/types/SearchBar/interface.ts:78](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/SearchBar/interface.ts#L78)

Accessible label for the clear button.

***

### clearButtonTestId?

> `optional` **clearButtonTestId**: `string`

Defined in: [src/types/SearchBar/interface.ts:60](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/SearchBar/interface.ts#L60)

Clear button test id override.

***

### defaultValue?

> `optional` **defaultValue**: `string`

Defined in: [src/types/SearchBar/interface.ts:42](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/SearchBar/interface.ts#L42)

Initial value when used in uncontrolled mode.

#### Overrides

`Omit.defaultValue`

***

### icon?

> `optional` **icon**: `ReactNode`

Defined in: [src/types/SearchBar/interface.ts:82](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/SearchBar/interface.ts#L82)

Optional custom icon rendered inside the input field.

***

### inputClassName?

> `optional` **inputClassName**: `string`

Defined in: [src/types/SearchBar/interface.ts:52](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/SearchBar/interface.ts#L52)

Additional class applied to the input element.

***

### inputTestId?

> `optional` **inputTestId**: `string`

Defined in: [src/types/SearchBar/interface.ts:56](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/SearchBar/interface.ts#L56)

Input test id override.

***

### isLoading?

> `optional` **isLoading**: `boolean`

Defined in: [src/types/SearchBar/interface.ts:80](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/SearchBar/interface.ts#L80)

Renders a loading spinner inside the button when true.

***

### onChange()?

> `optional` **onChange**: (`value`, `event?`) => `void`

Defined in: [src/types/SearchBar/interface.ts:46](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/SearchBar/interface.ts#L46)

Callback fired whenever the input value changes.

#### Parameters

##### value

`string`

##### event?

`ChangeEvent`\<`HTMLInputElement`\>

#### Returns

`void`

***

### onClear()?

> `optional` **onClear**: () => `void`

Defined in: [src/types/SearchBar/interface.ts:48](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/SearchBar/interface.ts#L48)

Callback fired after the clear button is pressed.

#### Returns

`void`

***

### onSearch()?

> `optional` **onSearch**: (`value`, `metadata?`) => `void`

Defined in: [src/types/SearchBar/interface.ts:44](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/SearchBar/interface.ts#L44)

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

Defined in: [src/types/SearchBar/interface.ts:38](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/SearchBar/interface.ts#L38)

Placeholder text for the search input.

#### Overrides

`Omit.placeholder`

***

### showClearButton?

> `optional` **showClearButton**: `boolean`

Defined in: [src/types/SearchBar/interface.ts:68](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/SearchBar/interface.ts#L68)

Toggle visibility of the inline clear button. Defaults to true.

***

### showLeadingIcon?

> `optional` **showLeadingIcon**: `boolean`

Defined in: [src/types/SearchBar/interface.ts:70](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/SearchBar/interface.ts#L70)

Toggle the leading search icon visibility. Defaults to false.

***

### showSearchButton?

> `optional` **showSearchButton**: `boolean`

Defined in: [src/types/SearchBar/interface.ts:66](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/SearchBar/interface.ts#L66)

Toggle visibility of the trailing search button. Defaults to true.

***

### showTrailingIcon?

> `optional` **showTrailingIcon**: `boolean`

Defined in: [src/types/SearchBar/interface.ts:72](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/SearchBar/interface.ts#L72)

Toggle the trailing search icon visibility. Defaults to false.

***

### size?

> `optional` **size**: [`SearchBarSize`](../../type/type-aliases/SearchBarSize.md)

Defined in: [src/types/SearchBar/interface.ts:62](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/SearchBar/interface.ts#L62)

Visual size of the component.

***

### value?

> `optional` **value**: `string`

Defined in: [src/types/SearchBar/interface.ts:40](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/SearchBar/interface.ts#L40)

Controlled input value.

#### Overrides

`Omit.value`

***

### variant?

> `optional` **variant**: [`SearchBarVariant`](../../type/type-aliases/SearchBarVariant.md)

Defined in: [src/types/SearchBar/interface.ts:64](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/SearchBar/interface.ts#L64)

Visual variant of the component.
