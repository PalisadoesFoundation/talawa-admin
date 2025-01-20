[**talawa-admin**](../../../../README.md)

***

# Variable: ORGANIZATION\_EVENTS\_CONNECTION

> `const` **ORGANIZATION\_EVENTS\_CONNECTION**: `DocumentNode`

Defined in: [src/GraphQl/Queries/PlugInQueries.ts:59](https://github.com/MayankJha014/talawa-admin/blob/0dd35cc200a4ed7562fa81ab87ec9b2a6facd18b/src/GraphQl/Queries/PlugInQueries.ts#L59)

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
