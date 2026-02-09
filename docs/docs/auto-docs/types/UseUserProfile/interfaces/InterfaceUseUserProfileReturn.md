[Admin Docs](/)

***

# Interface: InterfaceUseUserProfileReturn

Defined in: [src/types/UseUserProfile.ts:13](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UseUserProfile.ts#L13)

Return type for the useUserProfile hook.

`@remarks`
Provides user profile data and actions for rendering profile dropdowns
and managing user authentication state across the application.

`@example`
```tsx
const { displayedName, userImage, handleLogout } = useUserProfile('user');
```

## Properties

### displayedName

> **displayedName**: `string`

Defined in: [src/types/UseUserProfile.ts:24](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UseUserProfile.ts#L24)

Truncated display name (max 20 characters) with ellipsis if needed.
Used for UI rendering to prevent layout overflow.

***

### handleLogout()

> **handleLogout**: () => `Promise`\<`void`\>

Defined in: [src/types/UseUserProfile.ts:56](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UseUserProfile.ts#L56)

Async function to handle user logout.

`@remarks`
- Invokes logout mutation
- Clears localStorage and session data
- Navigates to root path
- Includes race condition protection

`@returns` Promise that resolves when logout completes
`@throws` Logs errors but does not reject (fail-safe)

#### Returns

`Promise`\<`void`\>

***

### name

> **name**: `string`

Defined in: [src/types/UseUserProfile.ts:18](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UseUserProfile.ts#L18)

Full user name retrieved from localStorage.
`@defaultValue` Empty string if not found

***

### profileDestination

> **profileDestination**: `string`

Defined in: [src/types/UseUserProfile.ts:42](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UseUserProfile.ts#L42)

Destination path for "View Profile" navigation.
Resolved based on user role and portal context.

***

### tCommon()

> **tCommon**: (`key`) => `string`

Defined in: [src/types/UseUserProfile.ts:64](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UseUserProfile.ts#L64)

Translation function for common strings.

`@param` key - Translation key from common namespace
`@returns` Translated string in the current locale

#### Parameters

##### key

`string`

#### Returns

`string`

***

### userImage

> **userImage**: `string`

Defined in: [src/types/UseUserProfile.ts:36](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UseUserProfile.ts#L36)

Sanitized avatar URL or empty string if unavailable.
Handles null, undefined, and string "null" values.

***

### userRole

> **userRole**: `string`

Defined in: [src/types/UseUserProfile.ts:30](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UseUserProfile.ts#L30)

User's role in the system (e.g., 'ADMIN', 'USER', 'SUPERADMIN').
`@defaultValue` Empty string if not found
