[**talawa-admin**](../../../../README.md)

***

[talawa-admin](../../../../README.md) / [GraphQl/Mutations/EventVolunteerMutation](../README.md) / CREATE\_VOLUNTEER\_GROUP

# Variable: CREATE\_VOLUNTEER\_GROUP

> `const` **CREATE\_VOLUNTEER\_GROUP**: `DocumentNode`

Defined in: [src/GraphQl/Mutations/EventVolunteerMutation.ts:48](https://github.com/gautam-divyanshu/talawa-admin/blob/619e831a8e34de2906df3277eb6df8b5309fb2fc/src/GraphQl/Mutations/EventVolunteerMutation.ts#L48)

GraphQL mutation to create an event volunteer group.

## Param

The data required to create an event volunteer group.
 - data contains following fileds:
     - eventId: string
     - leaderId: string
     - name: string
     - description?: string
     - volunteers: [string]
     - volunteersRequired?: number

## Returns

The ID of the created event volunteer group.
