[Admin Docs](/)

***

# Variable: createAdSuccessMock

> `const` **createAdSuccessMock**: `object`[]

Defined in: [src/components/Advertisements/AdvertisementsMocks.ts:263](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/Advertisements/AdvertisementsMocks.ts#L263)

## Type declaration

### request

> **request**: `object`

#### request.query

> **query**: `DocumentNode` = `ADD_ADVERTISEMENT_MUTATION`

#### request.variables

> **variables**: `object`

#### request.variables.attachments

> **attachments**: `File`[]

#### request.variables.description

> **description**: `string` = `'this advertisement is created by admin'`

#### request.variables.endAt

> **endAt**: `string` = `'2023-01-31T18:30:00.000Z'`

#### request.variables.name

> **name**: `string` = `'Ad1'`

#### request.variables.organizationId

> **organizationId**: `string` = `'1'`

#### request.variables.startAt

> **startAt**: `string` = `'2022-12-31T18:30:00.000Z'`

#### request.variables.type

> **type**: `string` = `'banner'`

### result

> **result**: `object`

#### result.data

> **data**: `object`

#### result.data.createAdvertisement

> **createAdvertisement**: `object`

#### result.data.createAdvertisement.id

> **id**: `string` = `'1'`
