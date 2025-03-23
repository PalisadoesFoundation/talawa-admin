[Admin Docs](/)

***

# Function: validateFile()

> **validateFile**(`file`, `maxSizeInMB`, `allowedTypes`): `IFileValidationResult`

Defined in: [src/utils/fileValidation.ts:18](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/fileValidation.ts#L18)

Validates a file for size and type

## Parameters

### file

`File`

The file to validate

### maxSizeInMB

`number` = `5`

Maximum file size in MB (default: 5MB)

### allowedTypes

`string`[] = `...`

Array of allowed MIME types (default: ['image/jpeg', 'image/png', 'image/gif'])

## Returns

`IFileValidationResult`

- Object containing validation status and error message if any
