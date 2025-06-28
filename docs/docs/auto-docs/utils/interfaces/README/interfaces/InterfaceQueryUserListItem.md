[Admin Docs](/)

***

# Interface: InterfaceQueryUserListItem

Defined in: [src/utils/interfaces.ts:2074](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2074)

InterfaceQueryUserListItem

## Description

Defines the structure for a user list item returned from a query.

## Properties

### appUserProfile

> **appUserProfile**: `object`

Defined in: [src/utils/interfaces.ts:2113](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2113)

The application user profile.

#### /_id

> **/_id**: `string`

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

Defined in: [src/utils/interfaces.ts:2075](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2075)

The user object.

#### /_id

> **/_id**: `string`

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
