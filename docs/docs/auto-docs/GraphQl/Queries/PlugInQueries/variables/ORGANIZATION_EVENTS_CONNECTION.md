[Admin Docs](/)

***

# Variable: ORGANIZATION\_EVENTS\_CONNECTION

> `const` **ORGANIZATION\_EVENTS\_CONNECTION**: `DocumentNode`

<<<<<<< HEAD
Defined in: [src/GraphQl/Queries/PlugInQueries.ts:59](https://github.com/abhassen44/talawa-admin/blob/285f7384c3d26b5028a286d84f89b85120d130a2/src/GraphQl/Queries/PlugInQueries.ts#L59)
=======
Defined in: [src/GraphQl/Queries/PlugInQueries.ts:59](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/GraphQl/Queries/PlugInQueries.ts#L59)
>>>>>>> 0c0fc8e1d54e2ef61a81dd93e93d1afca438df84

GraphQL query to retrieve a list of events based on organization connection.

## Param

The ID of the organization for which events are being retrieved.

## Param

Optional. Filter events by title containing a specified string.

## Param

Optional. Filter events by description containing a specified string.

## Param

Optional. Filter events by location containing a specified string.

## Param

Optional. Number of events to retrieve in the first batch.

## Param

Optional. Number of events to skip before starting to collect the result set.

## Returns

The list of events associated with the organization based on the applied filters.
