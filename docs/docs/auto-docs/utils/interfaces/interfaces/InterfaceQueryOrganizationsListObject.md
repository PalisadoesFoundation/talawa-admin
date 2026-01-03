[Admin Docs](/)

***

# Interface: InterfaceQueryOrganizationsListObject

Defined in: [src/utils/interfaces.ts:615](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L615)

InterfaceQueryOrganizationsListObject

## Description

Defines the structure for an organization object returned from a query.

## Properties

### address

> **address**: [`InterfaceAddress`](InterfaceAddress.md)

Defined in: [src/utils/interfaces.ts:625](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L625)

The address of the organization.

***

### admins

> **admins**: `object`[]

Defined in: [src/utils/interfaces.ts:634](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L634)

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

Defined in: [src/utils/interfaces.ts:649](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L649)

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

Defined in: [src/utils/interfaces.ts:618](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L618)

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

Defined in: [src/utils/interfaces.ts:624](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L624)

The description of the organization.

***

### id

> **id**: `string`

Defined in: [src/utils/interfaces.ts:616](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L616)

The unique identifier of the organization.

***

### image

> **image**: `string`

Defined in: [src/utils/interfaces.ts:617](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L617)

The URL of the organization's image, or null.

***

### members

> **members**: `object`[]

Defined in: [src/utils/interfaces.ts:628](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L628)

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

Defined in: [src/utils/interfaces.ts:641](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L641)

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

Defined in: [src/utils/interfaces.ts:623](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L623)

The name of the organization.

***

### userRegistrationRequired

> **userRegistrationRequired**: `boolean`

Defined in: [src/utils/interfaces.ts:626](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L626)

Indicates if user registration is required for this organization.

***

### visibleInSearch

> **visibleInSearch**: `boolean`

Defined in: [src/utils/interfaces.ts:627](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L627)

Indicates if the organization is visible in search results.
