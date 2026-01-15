[**talawa-admin**](../../../../README.md)

***

# Variable: CREATE\_VOLUNTEER\_GROUP

> `const` **CREATE\_VOLUNTEER\_GROUP**: `DocumentNode`

Defined in: [src/GraphQl/Mutations/EventVolunteerMutation.ts:69](https://github.com/Anshikaaa06/talawa-admin/blob/9e54ad8a0be6c052a435c30f5a6bbbad9b905bb5/src/GraphQl/Mutations/EventVolunteerMutation.ts#L69)

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
