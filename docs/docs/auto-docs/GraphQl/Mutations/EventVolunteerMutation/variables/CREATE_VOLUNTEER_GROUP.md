[Admin Docs](/)

***

# Variable: CREATE\_VOLUNTEER\_GROUP

> `const` **CREATE\_VOLUNTEER\_GROUP**: `DocumentNode`

Defined in: [src/GraphQl/Mutations/EventVolunteerMutation.ts:48](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/GraphQl/Mutations/EventVolunteerMutation.ts#L48)

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
