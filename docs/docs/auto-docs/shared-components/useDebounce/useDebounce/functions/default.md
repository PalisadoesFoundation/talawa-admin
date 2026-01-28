[**talawa-admin**](../../../../README.md)

***

# Function: default()

> **default**\<`T`\>(`callback`, `delay`): `object`

Defined in: [src/shared-components/useDebounce/useDebounce.tsx:21](https://github.com/MonishPuttu/talawa-admin/blob/4630ca9b3a05c039a7c82f0e137454f2802795b4/src/shared-components/useDebounce/useDebounce.tsx#L21)

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
