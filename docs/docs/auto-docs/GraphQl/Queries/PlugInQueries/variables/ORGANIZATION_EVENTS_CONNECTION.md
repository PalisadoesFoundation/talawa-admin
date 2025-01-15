[**talawa-admin**](../../../../README.md)

***

[talawa-admin](../../../../README.md) / [GraphQl/Queries/PlugInQueries](../README.md) / ORGANIZATION\_EVENTS\_CONNECTION

# Variable: ORGANIZATION\_EVENTS\_CONNECTION

> `const` **ORGANIZATION\_EVENTS\_CONNECTION**: `DocumentNode`

Defined in: [src/GraphQl/Queries/PlugInQueries.ts:59](https://github.com/gautam-divyanshu/talawa-admin/blob/9fec1eef6a4674b14f6abe30e3be3844537d8dc2/src/GraphQl/Queries/PlugInQueries.ts#L59)

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
