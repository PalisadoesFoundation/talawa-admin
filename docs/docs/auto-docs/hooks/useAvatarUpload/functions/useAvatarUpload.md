[**talawa-admin**](../../../README.md)

***

# Function: useAvatarUpload()

> **useAvatarUpload**(`initialUrl?`): `object`

Defined in: [src/hooks/useAvatarUpload.ts:23](https://github.com/Anshikaaa06/talawa-admin/blob/9e54ad8a0be6c052a435c30f5a6bbbad9b905bb5/src/hooks/useAvatarUpload.ts#L23)

Custom hook for handling avatar file uploads with validation.

Provides file validation (type and size), preview URL management,
and error handling for avatar upload functionality.

## Parameters

### initialUrl?

`string`

Optional initial preview URL for existing avatar

## Returns

`object`

Object containing file, previewUrl, error state, and handlers

### clearError()

> **clearError**: () => `void`

#### Returns

`void`

### error

> **error**: `string`

### file

> **file**: `File`

### onFileSelect()

> **onFileSelect**: (`f`) => `void`

#### Parameters

##### f

`File`

#### Returns

`void`

### previewUrl

> **previewUrl**: `string`

## Example

```tsx
const { file, previewUrl, error, onFileSelect, clearError } = useAvatarUpload(currentAvatarUrl);

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const selectedFile = e.target.files?.[0];
  if (selectedFile) onFileSelect(selectedFile);
};
```
