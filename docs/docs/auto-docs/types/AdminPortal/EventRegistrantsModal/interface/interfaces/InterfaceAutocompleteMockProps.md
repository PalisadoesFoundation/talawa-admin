[Admin Docs](/)

***

# Interface: InterfaceAutocompleteMockProps

Defined in: [src/types/AdminPortal/EventRegistrantsModal/interface.ts:28](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/EventRegistrantsModal/interface.ts#L28)

Props for Autocomplete mock component used in tests.
Mirrors the shared Autocomplete component's prop contract.

## Properties

### dataTestId?

> `optional` **dataTestId**: `string`

Defined in: [src/types/AdminPortal/EventRegistrantsModal/interface.ts:47](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/EventRegistrantsModal/interface.ts#L47)

***

### getOptionLabel()?

> `optional` **getOptionLabel**: (`option`) => `string`

Defined in: [src/types/AdminPortal/EventRegistrantsModal/interface.ts:46](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/EventRegistrantsModal/interface.ts#L46)

#### Parameters

##### option

###### id

`string`

###### name?

`string`

#### Returns

`string`

***

### inputValue?

> `optional` **inputValue**: `string`

Defined in: [src/types/AdminPortal/EventRegistrantsModal/interface.ts:37](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/EventRegistrantsModal/interface.ts#L37)

***

### noOptionsText?

> `optional` **noOptionsText**: `ReactNode`

Defined in: [src/types/AdminPortal/EventRegistrantsModal/interface.ts:38](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/EventRegistrantsModal/interface.ts#L38)

***

### onChange()?

> `optional` **onChange**: (`value`) => `void`

Defined in: [src/types/AdminPortal/EventRegistrantsModal/interface.ts:31](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/EventRegistrantsModal/interface.ts#L31)

#### Parameters

##### value

###### id

`string`

###### name?

`string`

#### Returns

`void`

***

### onInputChange()?

> `optional` **onInputChange**: (`event`, `value`, `reason`) => `void`

Defined in: [src/types/AdminPortal/EventRegistrantsModal/interface.ts:32](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/EventRegistrantsModal/interface.ts#L32)

#### Parameters

##### event

`SyntheticEvent`

##### value

`string`

##### reason

`string`

#### Returns

`void`

***

### options?

> `optional` **options**: `object`[]

Defined in: [src/types/AdminPortal/EventRegistrantsModal/interface.ts:30](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/EventRegistrantsModal/interface.ts#L30)

#### id

> **id**: `string`

#### name?

> `optional` **name**: `string`

***

### renderInput()?

> `optional` **renderInput**: (`params`) => `Element`

Defined in: [src/types/AdminPortal/EventRegistrantsModal/interface.ts:29](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/EventRegistrantsModal/interface.ts#L29)

#### Parameters

##### params

`Record`\<`string`, `unknown`\>

#### Returns

`Element`

***

### renderOption()?

> `optional` **renderOption**: (`props`, `option`, `state`) => `Element`

Defined in: [src/types/AdminPortal/EventRegistrantsModal/interface.ts:39](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/EventRegistrantsModal/interface.ts#L39)

#### Parameters

##### props

`Record`\<`string`, `unknown`\>

##### option

###### id

`string`

###### name?

`string`

##### state

###### selected

`boolean`

#### Returns

`Element`
