[Admin Docs](/)

***

# Interface: InterfaceQueryUserListItem

Defined in: [src/utils/interfaces.ts:1971](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1971)

InterfaceQueryUserListItem

## Description

Defines the structure for a user list item returned from a query.

## Properties

### appUserProfile

> **appUserProfile**: `object`

Defined in: [src/utils/interfaces.ts:2010](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2010)

The application user profile.

#### \_id

> **\_id**: `string`

#### adminFor

> **adminFor**: `object`[]

#### createdEvents

> **createdEvents**: `object`[]

#### createdOrganizations

> **createdOrganizations**: `object`[]

#### eventAdmin

> **eventAdmin**: `object`[]

#### isSuperAdmin

> **isSuperAdmin**: `boolean`

***

### user

> **user**: `object`

Defined in: [src/utils/interfaces.ts:1972](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1972)

The user object.

#### \_id

> **\_id**: `string`

#### createdAt

> **createdAt**: `string`

#### email

> **email**: `string`

#### firstName

> **firstName**: `string`

#### image

> **image**: `string`

#### joinedOrganizations

> **joinedOrganizations**: `object`[]

#### lastName

> **lastName**: `string`

#### membershipRequests

> **membershipRequests**: `object`[]

#### organizationsBlockedBy

> **organizationsBlockedBy**: `object`[]

#### registeredEvents

> **registeredEvents**: `object`[]
