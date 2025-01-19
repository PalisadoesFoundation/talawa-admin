[Admin Docs](/)

***

# Function: default()

> **default**(`props`, `deprecatedLegacyContext`?): `ReactNode`

Defined in: [src/screens/MemberDetail/MemberDetail.tsx:51](https://github.com/abhassen44/talawa-admin/blob/285f7384c3d26b5028a286d84f89b85120d130a2/src/screens/MemberDetail/MemberDetail.tsx#L51)

MemberDetail component is used to display the details of a user.
It also allows the user to update the details. It uses the UPDATE_USER_MUTATION to update the user details.
It uses the USER_DETAILS query to get the user details. It uses the useLocalStorage hook to store the user
 details in the local storage.

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
