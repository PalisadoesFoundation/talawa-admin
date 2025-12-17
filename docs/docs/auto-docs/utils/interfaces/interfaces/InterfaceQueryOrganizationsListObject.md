[Admin Docs](/)

***

# Interface: InterfaceQueryOrganizationsListObject

Defined in: src/utils/interfaces.ts:592

InterfaceQueryOrganizationsListObject

## Description

Defines the structure for an organization object returned from a query.

## Properties

### address

> **address**: [`InterfaceAddress`](InterfaceAddress.md)

Defined in: src/utils/interfaces.ts:602

The address of the organization.

***

### admins

> **admins**: `object`[]

Defined in: src/utils/interfaces.ts:611

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

Defined in: src/utils/interfaces.ts:626

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

Defined in: src/utils/interfaces.ts:595

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

Defined in: src/utils/interfaces.ts:601

The description of the organization.

***

### id

> **id**: `string`

Defined in: src/utils/interfaces.ts:593

The unique identifier of the organization.

***

### image

> **image**: `string`

Defined in: src/utils/interfaces.ts:594

The URL of the organization's image, or null.

***

### members

> **members**: `object`[]

Defined in: src/utils/interfaces.ts:605

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

Defined in: src/utils/interfaces.ts:618

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

Defined in: src/utils/interfaces.ts:600

The name of the organization.

***

### userRegistrationRequired

> **userRegistrationRequired**: `boolean`

Defined in: src/utils/interfaces.ts:603

Indicates if user registration is required for this organization.

***

### visibleInSearch

> **visibleInSearch**: `boolean`

Defined in: src/utils/interfaces.ts:604

Indicates if the organization is visible in search results.
