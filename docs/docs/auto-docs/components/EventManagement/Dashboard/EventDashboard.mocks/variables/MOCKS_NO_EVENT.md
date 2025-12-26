[Admin Docs](/)

***

# Variable: MOCKS\_NO\_EVENT

> `const` **MOCKS\_NO\_EVENT**: `object`[]

Defined in: [src/components/EventManagement/Dashboard/EventDashboard.mocks.ts:70](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/EventManagement/Dashboard/EventDashboard.mocks.ts#L70)

## Type Declaration

### request

> **request**: `object`

#### request.query

> **query**: `DocumentNode` = `EVENT_DETAILS`

#### request.variables

> **variables**: `object` & `object`

##### Type Declaration

###### eventId

> **eventId**: `string` = `'event123'`

##### Type Declaration

###### includeInviteOnly

> **includeInviteOnly**: `boolean`

### result

> **result**: `object`

#### result.data

> **data**: `object`

#### result.data.event

> **event**: `any` = `null`
