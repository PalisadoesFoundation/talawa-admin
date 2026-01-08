[Admin Docs](/)

***

# Function: validateImageFile()

> **validateImageFile**(`file`, `tCommon`): `boolean`

Defined in: [src/utils/userUpdateUtils.ts:60](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/userUpdateUtils.ts#L60)

Validates an image file for type and size constraints.
Shows error notifications for invalid files using the provided translation function.

## Parameters

### file

`File`

The file to validate, or undefined if no file is selected

### tCommon

(`key`, `options?`) => `string`

Translation function for error messages, accepts a key and optional interpolation options

## Returns

`boolean`

`true` if the file is valid, `false` otherwise

## Remarks

- Accepted file types: JPEG, PNG, GIF
- Maximum file size: 5MB
- Returns `false` immediately if no file is provided
- Displays error notifications for invalid files

## Example

```typescript
const { t: tCommon } = useTranslation('common');
const isValid = validateImageFile(selectedFile, tCommon);
if (isValid) {
  // Process the valid image file
}
```
