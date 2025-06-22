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

> **endAt**: `string` = `'2022-03-30T18:29:59.999Z'`

#### request.variables.input.isPublic

> **isPublic**: `boolean` = `false`

#### request.variables.input.isRegisterable

> **isRegisterable**: `boolean` = `true`

#### request.variables.input.location

> **location**: `string` = `'New Delhi'`

#### request.variables.input.name

> **name**: `string` = `'Dummy Org'`

#### request.variables.input.organizationId

> **organizationId**: `any` = `undefined`

#### request.variables.input.startAt

> **startAt**: `string` = `'2022-03-27T18:30:00.000Z'`

### result

> **result**: `object`

#### result.data

> **data**: `object`

#### result.data.createEvent

> **createEvent**: `object`

#### result.data.createEvent.allDay

> **allDay**: `boolean` = `true`

#### result.data.createEvent.creator

> **creator**: `object`

#### result.data.createEvent.creator.id

> **id**: `string` = `'1'`

#### result.data.createEvent.creator.name

> **name**: `string` = `'Admin User'`

#### result.data.createEvent.description

> **description**: `string` = `'This is a dummy organization'`

#### result.data.createEvent.endAt

> **endAt**: `string` = `'2022-03-30T18:29:59.999Z'`

#### result.data.createEvent.id

> **id**: `string` = `'1'`

#### result.data.createEvent.isPublic

> **isPublic**: `boolean` = `false`

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

#### result.data.createEvent.startAt

> **startAt**: `string` = `'2022-03-27T18:30:00.000Z'`
