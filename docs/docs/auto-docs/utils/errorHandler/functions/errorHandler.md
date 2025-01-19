[Admin Docs](/)

***

# Function: errorHandler()

> **errorHandler**(`a`, `error`): `void`

Defined in: [src/utils/errorHandler.tsx:10](https://github.com/abhassen44/talawa-admin/blob/bb7b6d5252385a81ad100b897eb0cba4f7ba10d2/src/utils/errorHandler.tsx#L10)

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
