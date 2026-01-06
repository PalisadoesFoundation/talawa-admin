[Admin Docs](/)

***

# Interface: InterfaceQueryOrganizationAdvertisementListItem

Defined in: [src/utils/interfaces.ts:1636](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1636)

InterfaceQueryOrganizationAdvertisementListItem
Defines the structure for an organization advertisement list item returned from a query.

## Properties

### advertisements

> **advertisements**: `object`

Defined in: [src/utils/interfaces.ts:1637](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1637)

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
