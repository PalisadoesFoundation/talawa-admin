[**talawa-admin**](../../../README.md)

***

[talawa-admin](../../../README.md) / [utils/errorHandler](../README.md) / errorHandler

# Function: errorHandler()

> **errorHandler**(`a`, `error`): `void`

Defined in: [src/utils/errorHandler.tsx:10](https://github.com/bint-Eve/talawa-admin/blob/bb9ac170c0ec806cc5423650a66bbe110c3af5d9/src/utils/errorHandler.tsx#L10)

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
