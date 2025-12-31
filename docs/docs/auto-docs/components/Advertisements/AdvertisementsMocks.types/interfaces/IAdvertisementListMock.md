[Admin Docs](/)

***

# Interface: IAdvertisementListMock

Defined in: [src/components/Advertisements/AdvertisementsMocks.types.ts:45](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/Advertisements/AdvertisementsMocks.types.ts#L45)

## Properties

### request

> **request**: `object`

Defined in: [src/components/Advertisements/AdvertisementsMocks.types.ts:46](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/Advertisements/AdvertisementsMocks.types.ts#L46)

#### query

> **query**: `DocumentNode`

#### variables

> **variables**: `object`

##### variables.after

> **after**: `string`

##### variables.first

> **first**: `number`

##### variables.id

> **id**: `string`

##### variables.where

> **where**: `object`

##### variables.where.isCompleted

> **isCompleted**: `boolean`

***

### result

> **result**: `object`

Defined in: [src/components/Advertisements/AdvertisementsMocks.types.ts:57](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/Advertisements/AdvertisementsMocks.types.ts#L57)

#### data

> **data**: `object`

##### data.organization

> **organization**: `object`

##### data.organization.\_\_typename?

> `optional` **\_\_typename**: `string`

##### data.organization.advertisements

> **advertisements**: `object`

##### data.organization.advertisements.\_\_typename?

> `optional` **\_\_typename**: `string`

##### data.organization.advertisements.edges

> **edges**: [`IEdge`](IEdge.md)[]

##### data.organization.advertisements.pageInfo

> **pageInfo**: [`IPageInfo`](IPageInfo.md)
