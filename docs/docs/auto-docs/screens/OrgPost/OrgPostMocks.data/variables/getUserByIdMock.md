[Admin Docs](/)

***

# Variable: getUserByIdMock

> `const` **getUserByIdMock**: `object`

Defined in: [src/screens/OrgPost/OrgPostMocks.data.ts:10](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/OrgPost/OrgPostMocks.data.ts#L10)

## Type Declaration

### request

> **request**: `object`

#### request.query

> **query**: `DocumentNode` = `GET_USER_BY_ID`

#### request.variables

> **variables**: `object`

#### request.variables.input

> **input**: `object`

#### request.variables.input.id

> **id**: `string` = `'123'`

### result

> **result**: `object`

#### result.data

> **data**: `object`

#### result.data.user

> **user**: `object`

#### result.data.user.\_\_typename

> **\_\_typename**: `string` = `'User'`

#### result.data.user.id

> **id**: `string` = `'123'`

#### result.data.user.name

> **name**: `string` = `'Test User'`
