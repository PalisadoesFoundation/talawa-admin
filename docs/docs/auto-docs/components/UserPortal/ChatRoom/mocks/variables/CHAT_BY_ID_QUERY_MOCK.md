[Admin Docs](/)

***

# Variable: CHAT\_BY\_ID\_QUERY\_MOCK

> `const` **CHAT\_BY\_ID\_QUERY\_MOCK**: `object`[]

Defined in: [src/components/UserPortal/ChatRoom/mocks.ts:1854](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/UserPortal/ChatRoom/mocks.ts#L1854)

## Type declaration

### request

> **request**: `object`

#### request.query

> **query**: `DocumentNode` = `CHAT_BY_ID`

#### request.variables

> **variables**: `object`

#### request.variables.id

> **id**: `string` = `'1'`

### result

> **result**: `object`

#### result.data

> **data**: `object`

#### result.data.chatById

> **chatById**: `object`

#### result.data.chatById.\_id

> **\_id**: `string` = `'1'`

#### result.data.chatById.admins

> **admins**: `any`[] = `[]`

#### result.data.chatById.createdAt

> **createdAt**: `string` = `'2345678903456'`

#### result.data.chatById.creator

> **creator**: `object`

#### result.data.chatById.creator.\_\_typename

> **\_\_typename**: `string` = `'User'`

#### result.data.chatById.creator.\_id

> **\_id**: `string` = `'64378abd85008f171cf2990d'`

#### result.data.chatById.creator.createdAt

> **createdAt**: `string` = `'2023-04-13T04:53:17.742Z'`

#### result.data.chatById.creator.email

> **email**: `string` = `'testsuperadmin@example.com'`

#### result.data.chatById.creator.firstName

> **firstName**: `string` = `'Wilt'`

#### result.data.chatById.creator.image

> **image**: `any` = `null`

#### result.data.chatById.creator.lastName

> **lastName**: `string` = `'Shepherd'`

#### result.data.chatById.isGroup

> **isGroup**: `boolean` = `false`

#### result.data.chatById.messages

> **messages**: `object`[]

#### result.data.chatById.name

> **name**: `string` = `''`

#### result.data.chatById.organization

> **organization**: `any` = `null`

#### result.data.chatById.unseenMessagesByUsers

> **unseenMessagesByUsers**: `object`

#### result.data.chatById.unseenMessagesByUsers.1

> **1**: `number` = `0`

#### result.data.chatById.unseenMessagesByUsers.2

> **2**: `number` = `0`

#### result.data.chatById.users

> **users**: `object`[]
