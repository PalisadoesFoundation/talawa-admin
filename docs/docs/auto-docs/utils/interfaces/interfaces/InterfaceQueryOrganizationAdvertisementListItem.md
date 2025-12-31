[Admin Docs](/)

***

# Interface: InterfaceQueryOrganizationAdvertisementListItem

Defined in: [src/utils/interfaces.ts:1672](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1672)

InterfaceQueryOrganizationAdvertisementListItem

## Description

Defines the structure for an organization advertisement list item returned from a query.

## Properties

### advertisements

> **advertisements**: `object`

Defined in: [src/utils/interfaces.ts:1673](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1673)

The advertisements connection object.

#### edges

> **edges**: `object`[]

#### pageInfo

> **pageInfo**: `object`

##### pageInfo.endCursor

> **endCursor**: `string`

##### pageInfo.hasNextPage

> **hasNextPage**: `boolean`

##### pageInfo.hasPreviousPage

> **hasPreviousPage**: `boolean`

##### pageInfo.startCursor

> **startCursor**: `string`

#### totalCount

> **totalCount**: `number`
