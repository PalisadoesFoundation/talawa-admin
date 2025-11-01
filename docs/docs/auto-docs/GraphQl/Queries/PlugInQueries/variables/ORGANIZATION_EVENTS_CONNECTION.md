[**talawa-admin**](../../../../README.md)

***

# Variable: ORGANIZATION\_EVENTS\_CONNECTION

> `const` **ORGANIZATION\_EVENTS\_CONNECTION**: `DocumentNode`

Defined in: [src/GraphQl/Queries/PlugInQueries.ts:47](https://github.com/iamanishx/talawa-admin/blob/298365ee22a86aaef2b666c60099ffc41d2bbce7/src/GraphQl/Queries/PlugInQueries.ts#L47)

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
