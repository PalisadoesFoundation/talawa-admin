[Admin Docs](/)

***

# Interface: InterfaceQueryOrganizationsListObject

Defined in: [src/utils/interfaces.ts:618](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L618)

InterfaceQueryOrganizationsListObject

## Description

Defines the structure for an organization object returned from a query.

## Properties

### address

> **address**: [`InterfaceAddress`](InterfaceAddress.md)

Defined in: [src/utils/interfaces.ts:628](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L628)

The address of the organization.

***

### admins

> **admins**: `object`[]

Defined in: [src/utils/interfaces.ts:637](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L637)

An array of administrators in the organization.

#### \_id

> **\_id**: `string`

#### createdAt

> **createdAt**: `string`

#### email

> **email**: `string`

#### firstName

> **firstName**: `string`

#### lastName

> **lastName**: `string`

***

### blockedUsers

> **blockedUsers**: `object`[]

Defined in: [src/utils/interfaces.ts:652](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L652)

An array of users blocked by the organization.

#### \_id

> **\_id**: `string`

#### email

> **email**: `string`

#### firstName

> **firstName**: `string`

#### lastName

> **lastName**: `string`

***

### creator

> **creator**: `object`

Defined in: [src/utils/interfaces.ts:621](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L621)

The creator of the organization.

#### email

> **email**: `string`

#### firstName

> **firstName**: `string`

#### lastName

> **lastName**: `string`

***

### description

> **description**: `string`

Defined in: [src/utils/interfaces.ts:627](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L627)

The description of the organization.

***

### id

> **id**: `string`

Defined in: [src/utils/interfaces.ts:619](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L619)

The unique identifier of the organization.

***

### image

> **image**: `string`

Defined in: [src/utils/interfaces.ts:620](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L620)

The URL of the organization's image, or null.

***

### members

> **members**: `object`[]

Defined in: [src/utils/interfaces.ts:631](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L631)

An array of members in the organization.

#### \_id

> **\_id**: `string`

#### email

> **email**: `string`

#### firstName

> **firstName**: `string`

#### lastName

> **lastName**: `string`

***

### membershipRequests

> **membershipRequests**: `object`[]

Defined in: [src/utils/interfaces.ts:644](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L644)

An array of membership requests for the organization.

#### \_id

> **\_id**: `string`

#### user

> **user**: `object`

##### user.email

> **email**: `string`

##### user.firstName

> **firstName**: `string`

##### user.lastName

> **lastName**: `string`

***

### name

> **name**: `string`

Defined in: [src/utils/interfaces.ts:626](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L626)

The name of the organization.

***

### userRegistrationRequired

> **userRegistrationRequired**: `boolean`

Defined in: [src/utils/interfaces.ts:629](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L629)

Indicates if user registration is required for this organization.

***

### visibleInSearch

> **visibleInSearch**: `boolean`

Defined in: [src/utils/interfaces.ts:630](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L630)

Indicates if the organization is visible in search results.
