[Admin Docs](/)

***

# Interface: InterfaceQueryOrganizationPostListItem

Defined in: [src/utils/interfaces.ts:1417](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1417)

InterfaceQueryOrganizationPostListItem

## Description

Defines the structure for an organization post list item returned from a query.

## Properties

### posts

> **posts**: `object`

Defined in: [src/utils/interfaces.ts:1418](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1418)

The posts connection object.

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
