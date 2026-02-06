[Admin Docs](/)

***

# Interface: InterfaceUploadOptions

Defined in: [src/types/apollo-upload-client.d.ts:4](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/apollo-upload-client.d.ts#L4)

## Properties

### credentials?

> `optional` **credentials**: `string`

Defined in: [src/types/apollo-upload-client.d.ts:9](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/apollo-upload-client.d.ts#L9)

***

### fetch()?

> `optional` **fetch**: \{(`input`, `init?`): `Promise`\<`Response`\>; (`input`, `init?`): `Promise`\<`Response`\>; \}

Defined in: [src/types/apollo-upload-client.d.ts:6](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/apollo-upload-client.d.ts#L6)

#### Call Signature

> (`input`, `init?`): `Promise`\<`Response`\>

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/fetch)

##### Parameters

###### input

`RequestInfo` | `URL`

###### init?

`RequestInit`

##### Returns

`Promise`\<`Response`\>

#### Call Signature

> (`input`, `init?`): `Promise`\<`Response`\>

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/fetch)

##### Parameters

###### input

`string` | `Request` | `URL`

###### init?

`RequestInit`

##### Returns

`Promise`\<`Response`\>

***

### fetchOptions?

> `optional` **fetchOptions**: `RequestInit`

Defined in: [src/types/apollo-upload-client.d.ts:7](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/apollo-upload-client.d.ts#L7)

***

### formData?

> `optional` **formData**: `FormData`

Defined in: [src/types/apollo-upload-client.d.ts:13](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/apollo-upload-client.d.ts#L13)

***

### formDataAppendFile()?

> `optional` **formDataAppendFile**: (`formData`, `fieldName`, `file`) => `void`

Defined in: [src/types/apollo-upload-client.d.ts:14](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/apollo-upload-client.d.ts#L14)

#### Parameters

##### formData

`FormData`

##### fieldName

`string`

##### file

`Blob` | `File`

#### Returns

`void`

***

### headers?

> `optional` **headers**: `Record`\<`string`, `string`\>

Defined in: [src/types/apollo-upload-client.d.ts:8](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/apollo-upload-client.d.ts#L8)

***

### includeExtensions?

> `optional` **includeExtensions**: `boolean`

Defined in: [src/types/apollo-upload-client.d.ts:10](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/apollo-upload-client.d.ts#L10)

***

### isExtractableFile()?

> `optional` **isExtractableFile**: (`value`) => `boolean`

Defined in: [src/types/apollo-upload-client.d.ts:12](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/apollo-upload-client.d.ts#L12)

#### Parameters

##### value

`unknown`

#### Returns

`boolean`

***

### uri?

> `optional` **uri**: `string` \| (`operation`) => `string`

Defined in: [src/types/apollo-upload-client.d.ts:5](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/apollo-upload-client.d.ts#L5)

***

### useGETForQueries?

> `optional` **useGETForQueries**: `boolean`

Defined in: [src/types/apollo-upload-client.d.ts:11](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/apollo-upload-client.d.ts#L11)
