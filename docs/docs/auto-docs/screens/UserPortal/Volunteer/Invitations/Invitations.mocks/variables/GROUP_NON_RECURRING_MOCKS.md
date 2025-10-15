[Admin Docs](/)

***

# Variable: GROUP\_NON\_RECURRING\_MOCKS

> `const` **GROUP\_NON\_RECURRING\_MOCKS**: `object`[]

Defined in: [src/screens/UserPortal/Volunteer/Invitations/Invitations.mocks.ts:357](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/UserPortal/Volunteer/Invitations/Invitations.mocks.ts#L357)

## Type declaration

### request

> **request**: `object`

#### request.query

> **query**: `DocumentNode` = `USER_VOLUNTEER_MEMBERSHIP`

#### request.variables

> **variables**: `object`

#### request.variables.where

> **where**: `object`

#### request.variables.where.status

> **status**: `string` = `'invited'`

#### request.variables.where.userId

> **userId**: `string` = `'userId'`

### result

> **result**: `object`

#### result.data

> **data**: `object`

#### result.data.getVolunteerMembership

> **getVolunteerMembership**: `object`[]
