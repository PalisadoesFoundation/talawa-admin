[Admin Docs](/)

***

# Function: errorHandler()

> **errorHandler**(`a`, `error`): `void`

Defined in: [src/utils/errorHandler.tsx:9](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/errorHandler.tsx#L9)

This function is used to handle api errors in the application.
It takes in the error object and displays the error message to the user.
If the error is due to the Talawa API being unavailable, it displays a custom message. And for other error cases, it is using regular expression (case-insensitive) to match and show valid messages

## Parameters

### a

`unknown`

### error

`unknown`

## Returns

`void`
