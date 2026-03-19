[Admin Docs](/)

***

# Interface: InterfaceProfileDropdownProps

Defined in: [src/types/shared-components/ProfileDropdown/interface.ts:6](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/ProfileDropdown/interface.ts#L6)

ProfileDropdown component interface definition
This file defines the TypeScript interface for the ProfileDropdown component props.
It ensures type safety and provides clear documentation for the expected props.

## Properties

### portal?

> `optional` **portal**: `"user"` \| `"admin"`

Defined in: [src/types/shared-components/ProfileDropdown/interface.ts:13](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/ProfileDropdown/interface.ts#L13)

Optional prop to specify the portal type for navigation purposes.
Acceptable values are 'admin' or 'user'. This prop is used to determine
the navigation path when the user clicks on the profile or logout options.
`@defaultValue` 'admin'
