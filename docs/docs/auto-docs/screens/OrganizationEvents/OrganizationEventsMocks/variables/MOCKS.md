[Admin Docs](/)

***

# Variable: MOCKS

> `const` **MOCKS**: `object`[]

Defined in: [src/screens/OrganizationEvents/OrganizationEventsMocks.ts:3](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/OrganizationEvents/OrganizationEventsMocks.ts#L3)

## Type declaration

### request

> **request**: `object`

#### request.query

> **query**: `DocumentNode` = `CREATE_EVENT_MUTATION`

#### request.variables

> **variables**: `object`

#### request.variables.input

> **input**: `object`

#### request.variables.input.allDay

> **allDay**: `boolean` = `true`

#### request.variables.input.description

> **description**: `string` = `'This is a dummy organization'`

#### request.variables.input.endAt

> **endAt**: `string` = `'2022-03-30T23:59:59.999Z'`

#### request.variables.input.isPublic

> **isPublic**: `boolean` = `false`

#### request.variables.input.isRegisterable

> **isRegisterable**: `boolean` = `true`

#### request.variables.input.location

> **location**: `string` = `'New Delhi'`

#### request.variables.input.name

> **name**: `string` = `'Dummy Org'`

#### request.variables.input.organizationId

> **organizationId**: `string` = `''`

#### request.variables.input.startAt

> **startAt**: `string` = `'2022-03-28T00:00:00.000Z'`

### result

> **result**: `object`

#### result.data

> **data**: `object`

#### result.data.createEvent

> **createEvent**: `object`

#### result.data.createEvent.allDay

> **allDay**: `boolean` = `true`

#### result.data.createEvent.baseEventId

> **baseEventId**: `any` = `null`

#### result.data.createEvent.createdAt

> **createdAt**: `string` = `'2022-03-28T00:00:00.000Z'`

#### result.data.createEvent.creator

> **creator**: `object`

#### result.data.createEvent.creator.id

> **id**: `string` = `'1'`

#### result.data.createEvent.creator.name

> **name**: `string` = `'Admin User'`

#### result.data.createEvent.description

> **description**: `string` = `'This is a dummy organization'`

#### result.data.createEvent.endAt

> **endAt**: `string` = `'2022-03-30T23:59:59.999Z'`

#### result.data.createEvent.hasExceptions

> **hasExceptions**: `boolean` = `false`

#### result.data.createEvent.id

> **id**: `string` = `'1'`

#### result.data.createEvent.instanceStartTime

> **instanceStartTime**: `any` = `null`

#### result.data.createEvent.isMaterialized

> **isMaterialized**: `boolean` = `false`

#### result.data.createEvent.isPublic

> **isPublic**: `boolean` = `false`

#### result.data.createEvent.isRecurringTemplate

> **isRecurringTemplate**: `boolean` = `false`

#### result.data.createEvent.isRegisterable

> **isRegisterable**: `boolean` = `true`

#### result.data.createEvent.location

> **location**: `string` = `'New Delhi'`

#### result.data.createEvent.name

> **name**: `string` = `'Dummy Org'`

#### result.data.createEvent.organization

> **organization**: `object`

#### result.data.createEvent.organization.id

> **id**: `string` = `'1'`

#### result.data.createEvent.organization.name

> **name**: `string` = `'Test Organization'`

#### result.data.createEvent.progressLabel

> **progressLabel**: `string` = `'Event 1 of 1'`

#### result.data.createEvent.recurringEventId

> **recurringEventId**: `any` = `null`

#### result.data.createEvent.sequenceNumber

> **sequenceNumber**: `number` = `1`

#### result.data.createEvent.startAt

> **startAt**: `string` = `'2022-03-28T00:00:00.000Z'`

#### result.data.createEvent.totalCount

> **totalCount**: `number` = `1`

#### result.data.createEvent.updatedAt

> **updatedAt**: `string` = `'2022-03-28T00:00:00.000Z'`

#### result.data.createEvent.updater

> **updater**: `object`

#### result.data.createEvent.updater.id

> **id**: `string` = `'1'`

#### result.data.createEvent.updater.name

> **name**: `string` = `'Admin User'`
