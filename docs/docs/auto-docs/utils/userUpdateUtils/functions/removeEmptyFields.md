[**talawa-admin**](../../../README.md)

***

# Function: removeEmptyFields()

> **removeEmptyFields**\<`T`\>(`obj`): `Partial`\<`T`\>

Defined in: [src/utils/userUpdateUtils.ts:23](https://github.com/MonishPuttu/talawa-admin/blob/4630ca9b3a05c039a7c82f0e137454f2802795b4/src/utils/userUpdateUtils.ts#L23)

Removes empty fields from an object, filtering out null, undefined, and empty/whitespace-only strings.
File objects are preserved regardless of their content.

This function accepts a generic type T that extends Record with string keys and values that can be
string, File, null

## Type Parameters

### T

`T` *extends* `Record`\<`string`, `string` \| `File`\>

## Parameters

### obj

`T`

The object to filter

## Returns

`Partial`\<`T`\>

A partial object with empty fields removed

## Example

```typescript
const input = { name: 'John', email: '', age: null };
const result = removeEmptyFields(input);
// Returns: { name: 'John' }
```
