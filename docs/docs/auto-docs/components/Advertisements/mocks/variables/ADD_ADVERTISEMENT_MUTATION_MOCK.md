[Admin Docs](/)

***

# Variable: ADD\_ADVERTISEMENT\_MUTATION\_MOCK

> `const` **ADD\_ADVERTISEMENT\_MUTATION\_MOCK**: `object`

Defined in: [src/components/Advertisements/mocks.ts:156](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/Advertisements/mocks.ts#L156)

## Type declaration

### request

> **request**: `object`

#### request.query

> **query**: `DocumentNode` = `ADD_ADVERTISEMENT_MUTATION`

#### request.variables

> **variables**: `object`

#### request.variables.endDate

> **endDate**: `string` = `'2023-02-02'`

#### request.variables.file

> **file**: `string` = `'data:image/png;base64,bWVkaWEgY29udGVudA=='`

#### request.variables.name

> **name**: `string` = `'Cookie Shop'`

#### request.variables.organizationId

> **organizationId**: `string` = `'1'`

#### request.variables.startDate

> **startDate**: `string` = `'2023-01-01'`

#### request.variables.type

> **type**: `string` = `'POPUP'`

### result

> **result**: `object`

#### result.data

> **data**: `object`

#### result.data.createAdvertisement

> **createAdvertisement**: `object`

#### result.data.createAdvertisement.\_\_typename

> **\_\_typename**: `string` = `'Advertisement'`

#### result.data.createAdvertisement.\_id

> **\_id**: `string` = `'65844efc814dd4003db811c4'`

#### result.data.createAdvertisement.advertisement

> **advertisement**: `any` = `null`
