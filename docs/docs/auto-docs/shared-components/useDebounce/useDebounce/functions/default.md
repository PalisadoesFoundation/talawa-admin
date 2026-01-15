[**talawa-admin**](../../../../README.md)

***

# Function: default()

> **default**\<`T`\>(`callback`, `delay`): `object`

Defined in: [src/shared-components/useDebounce/useDebounce.tsx:21](https://github.com/Anshikaaa06/talawa-admin/blob/9e54ad8a0be6c052a435c30f5a6bbbad9b905bb5/src/shared-components/useDebounce/useDebounce.tsx#L21)

## Type Parameters

### T

`T` *extends* (...`args`) => `void`

## Parameters

### callback

`T`

### delay

`number`

## Returns

`object`

### cancel()

> **cancel**: () => `void`

#### Returns

`void`

### debouncedCallback()

> **debouncedCallback**: (...`args`) => `void`

#### Parameters

##### args

...`Parameters`\<`T`\>

#### Returns

`void`
