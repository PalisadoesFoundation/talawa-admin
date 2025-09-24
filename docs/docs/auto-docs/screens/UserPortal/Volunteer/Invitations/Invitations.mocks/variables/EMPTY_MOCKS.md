[Admin Docs](/)

***

# Variable: EMPTY\_MOCKS

> `const` **EMPTY\_MOCKS**: `object`[]

Defined in: [src/screens/UserPortal/Volunteer/Invitations/Invitations.mocks.ts:189](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/UserPortal/Volunteer/Invitations/Invitations.mocks.ts#L189)

## Type Declaration

### request

> **request**: `object`

#### request.query

> **query**: `DocumentNode` = `USER_VOLUNTEER_MEMBERSHIP`

#### request.variables

> **variables**: `object`

#### request.variables.where

> **where**: `object`

#### request.variables.where.filter

> **filter**: `any` = `null`

#### request.variables.where.status

> **status**: `string` = `'invited'`

#### request.variables.where.userId

> **userId**: `string` = `'userId'`

### result

> **result**: `object`

#### result.data

> **data**: `object`

#### result.data.getVolunteerMembership

> **getVolunteerMembership**: `any`[] = `[]`
