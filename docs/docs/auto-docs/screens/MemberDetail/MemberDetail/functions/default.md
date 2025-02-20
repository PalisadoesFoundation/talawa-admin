[Admin Docs](/)

***

# Function: default()

> **default**(`props`, `deprecatedLegacyContext`?): `ReactNode`

Defined in: [src/screens/MemberDetail/MemberDetail.tsx:44](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/MemberDetail/MemberDetail.tsx#L44)

MemberDetail component is used to display the details of a user.
It also allows the user to update the details. It uses the UPDATE_CURRENT_USER_MUTATION to update the user details.
It uses the CURRENT_USER query to get the user details. It uses the useLocalStorage hook to store the user details in the local storage.

## Parameters

### props

`MemberDetailProps`

### deprecatedLegacyContext?

`any`

**Deprecated**

**See**

[React Docs](https://legacy.reactjs.org/docs/legacy-context.html#referencing-context-in-lifecycle-methods)

## Returns

`ReactNode`

React component
