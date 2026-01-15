[**talawa-admin**](../../../README.md)

***

# Function: validateFile()

> **validateFile**(`file`, `maxSizeInMB`, `allowedTypes`): `IFileValidationResult`

Defined in: [src/utils/fileValidation.ts:23](https://github.com/Anshikaaa06/talawa-admin/blob/9e54ad8a0be6c052a435c30f5a6bbbad9b905bb5/src/utils/fileValidation.ts#L23)

Validates a file for size and type

## Parameters

### file

`File`

The file to validate

### maxSizeInMB

`number` = `FILE_UPLOAD_MAX_SIZE_MB`

Maximum file size in MB (default: 5MB)

### allowedTypes

readonly `string`[] = `FILE_UPLOAD_ALLOWED_TYPES`

Array of allowed MIME types (default: ['image/jpeg', 'image/png', 'image/gif'])

## Returns

`IFileValidationResult`

IFileValidationResult - Object containing validation status and error message if any
