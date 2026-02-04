[Admin Docs](/)

***

# ~~Function: default()~~

> **default**(`file`): `Promise`\<`string`\>

Defined in: [src/utils/convertToBase64.ts:6](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/convertToBase64.ts#L6)

## Parameters

### file

`File`

## Returns

`Promise`\<`string`\>

## Deprecated

Use useMinioUpload hook instead.
Files should be uploaded to MinIO using presigned URLs, not converted to base64.

## See

https://docs-admin.talawa.io/docs/developer-resources/file-management
