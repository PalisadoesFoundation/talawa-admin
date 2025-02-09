[Admin Docs](/)

***

# Type Alias: DirectMessage

> **DirectMessage**: `object`

Defined in: [src/components/GroupChatDetails/GroupChatDetails.tsx:29](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/GroupChatDetails/GroupChatDetails.tsx#L29)

## Type declaration

### \_id

> **\_id**: `string`

### createdAt

> **createdAt**: `Date`

### media

> **media**: `string`

### messageContent

> **messageContent**: `string`

### replyTo

> **replyTo**: \{ `_id`: `string`; `createdAt`: `Date`; `messageContent`: `string`; `receiver`: \{ `_id`: `string`; `firstName`: `string`; `lastName`: `string`; \}; `sender`: \{ `_id`: `string`; `firstName`: `string`; `image`: `string`; `lastName`: `string`; \}; \} \| `undefined`

### sender

> **sender**: `object`

#### sender.\_id

> **\_id**: `string`

#### sender.firstName

> **firstName**: `string`

#### sender.image

> **image**: `string`

#### sender.lastName

> **lastName**: `string`
