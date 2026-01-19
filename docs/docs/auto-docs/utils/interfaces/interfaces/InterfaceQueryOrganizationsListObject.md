[Admin Docs](/)

***

# Interface: InterfaceQueryOrganizationsListObject

Defined in: [src/utils/interfaces.ts:594](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L594)

InterfaceQueryOrganizationsListObject

## Description

Defines the structure for an organization object returned from a query.

## Properties

### address

> **address**: [`InterfaceAddress`](InterfaceAddress.md)

Defined in: [src/utils/interfaces.ts:604](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L604)

The address of the organization.

***

### admins

> **admins**: `object`[]

Defined in: [src/utils/interfaces.ts:613](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L613)

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

Defined in: [src/utils/interfaces.ts:628](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L628)

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

Defined in: [src/utils/interfaces.ts:597](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L597)

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

Defined in: [src/utils/interfaces.ts:603](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L603)

The description of the organization.

***

### id

> **id**: `string`

Defined in: [src/utils/interfaces.ts:595](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L595)

The unique identifier of the organization.

***

### image

> **image**: `string`

Defined in: [src/utils/interfaces.ts:596](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L596)

The URL of the organization's image, or null.

***

### members

> **members**: `object`[]

Defined in: [src/utils/interfaces.ts:607](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L607)

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

Defined in: [src/utils/interfaces.ts:620](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L620)

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

Defined in: [src/utils/interfaces.ts:602](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L602)

The name of the organization.

***

### userRegistrationRequired

> **userRegistrationRequired**: `boolean`

Defined in: [src/utils/interfaces.ts:605](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L605)

Indicates if user registration is required for this organization.

***

### visibleInSearch

> **visibleInSearch**: `boolean`

Defined in: [src/utils/interfaces.ts:606](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L606)

Indicates if the organization is visible in search results.
