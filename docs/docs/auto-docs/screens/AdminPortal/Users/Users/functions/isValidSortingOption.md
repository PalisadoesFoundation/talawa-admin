[Admin Docs](/)

***

# Function: isValidSortingOption()

> **isValidSortingOption**(`option`): `option is SortingOption`

Defined in: [src/screens/AdminPortal/Users/Users.tsx:42](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/AdminPortal/Users/Users.tsx#L42)

Type guard that validates if a value is a valid SortingOption.

## Parameters

### option

`unknown`

The value to validate against the SortingOption union type.

## Returns

`option is SortingOption`

True if option is a valid SortingOption ('newest' or 'oldest').
