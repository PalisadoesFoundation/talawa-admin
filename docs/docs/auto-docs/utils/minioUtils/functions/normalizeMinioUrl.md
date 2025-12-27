[Admin Docs](/)

***

# Function: normalizeMinioUrl()

> **normalizeMinioUrl**(`url`): `string`

Defined in: [src/utils/minioUtils.ts:8](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/minioUtils.ts#L8)

Normalizes presigned URLs by replacing Docker internal hostnames with browser-accessible ones.
Specifically, it replaces "minio" with "localhost".

## Parameters

### url

`string`

The presigned URL to normalize

## Returns

`string`

The normalized URL
