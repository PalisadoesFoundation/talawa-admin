[Admin Docs](/)

***

# Function: isValidFilteringOption()

> **isValidFilteringOption**(`option`): `option is FilteringOption`

Defined in: [src/screens/AdminPortal/Users/Users.tsx:55](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/AdminPortal/Users/Users.tsx#L55)

Type guard that validates if a value is a valid FilteringOption.

## Parameters

### option

`unknown`

The value to validate against the FilteringOption union type.

## Returns

`option is FilteringOption`

True if option is a valid FilteringOption ('admin', 'user', or 'cancel').
