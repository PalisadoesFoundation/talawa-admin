[Admin Docs](/)

***

# Variable: DELETE\_MESSAGE\_MOCK

> `const` **DELETE\_MESSAGE\_MOCK**: `object`

Defined in: [src/components/UserPortal/ChatRoom/ChatRoom.fixtures.ts:277](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/UserPortal/ChatRoom/ChatRoom.fixtures.ts#L277)

## Type Declaration

### request

> **request**: `object`

#### request.query

> **query**: `DocumentNode` = `DELETE_CHAT_MESSAGE`

#### request.variables

> **variables**: `object`

#### request.variables.input

> **input**: `object`

#### request.variables.input.id

> **id**: `string` = `'msg1'`

### result

> **result**: `object`

#### result.data

> **data**: `object`

#### result.data.deleteChatMessage

> **deleteChatMessage**: `object`

#### result.data.deleteChatMessage.\_\_typename

> **\_\_typename**: `string` = `'ChatMessage'`

#### result.data.deleteChatMessage.body

> **body**: `string` = `'Hello World'`

#### result.data.deleteChatMessage.createdAt

> **createdAt**: `string` = `FIXED_UTC`

#### result.data.deleteChatMessage.id

> **id**: `string` = `'msg1'`
