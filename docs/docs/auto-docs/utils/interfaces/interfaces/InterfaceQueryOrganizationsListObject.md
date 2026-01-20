[Admin Docs](/)

***

# Interface: InterfaceQueryOrganizationsListObject

Defined in: [src/utils/interfaces.ts:473](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L473)

Defines the structure for an organization object returned from a query.

## Properties

### address

> **address**: [`InterfaceAddress`](InterfaceAddress.md)

Defined in: [src/utils/interfaces.ts:483](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L483)

***

### admins

> **admins**: `object`[]

Defined in: [src/utils/interfaces.ts:492](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L492)

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

Defined in: [src/utils/interfaces.ts:507](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L507)

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

Defined in: [src/utils/interfaces.ts:476](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L476)

#### email

> **email**: `string`

#### firstName

> **firstName**: `string`

#### lastName

> **lastName**: `string`

***

### description

> **description**: `string`

Defined in: [src/utils/interfaces.ts:482](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L482)

***

### id

> **id**: `string`

Defined in: [src/utils/interfaces.ts:474](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L474)

***

### image

> **image**: `string`

Defined in: [src/utils/interfaces.ts:475](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L475)

***

### members

> **members**: `object`[]

Defined in: [src/utils/interfaces.ts:486](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L486)

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

Defined in: [src/utils/interfaces.ts:499](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L499)

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

Defined in: [src/utils/interfaces.ts:481](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L481)

***

### userRegistrationRequired

> **userRegistrationRequired**: `boolean`

Defined in: [src/utils/interfaces.ts:484](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L484)

***

### visibleInSearch

> **visibleInSearch**: `boolean`

Defined in: [src/utils/interfaces.ts:485](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L485)
