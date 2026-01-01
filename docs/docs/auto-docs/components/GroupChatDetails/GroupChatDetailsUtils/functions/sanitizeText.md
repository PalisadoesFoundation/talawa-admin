[Admin Docs](/)

***

# Function: sanitizeText()

> **sanitizeText**(`text?`): `string`

Defined in: [src/components/GroupChatDetails/GroupChatDetailsUtils.ts:31](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/GroupChatDetails/GroupChatDetailsUtils.ts#L31)

Sanitizes text content to prevent XSS attacks by escaping HTML
special characters. This ensures user input is treated as plain text.

## Parameters

### text?

`string`

The text to sanitize

## Returns

`string`

Sanitized text safe for display
