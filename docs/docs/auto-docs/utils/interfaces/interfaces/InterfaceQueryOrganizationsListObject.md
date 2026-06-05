[Admin Docs](/)

***

# Interface: InterfaceQueryOrganizationsListObject

Defined in: [src/utils/interfaces.ts:476](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L476)

Defines the structure for an organization object returned from a query.

## Properties

### address

> **address**: [`InterfaceAddress`](InterfaceAddress.md)

Defined in: [src/utils/interfaces.ts:486](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L486)

***

### admins

> **admins**: `object`[]

Defined in: [src/utils/interfaces.ts:495](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L495)

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

Defined in: [src/utils/interfaces.ts:510](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L510)

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

Defined in: [src/utils/interfaces.ts:479](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L479)

#### email

> **email**: `string`

#### firstName

> **firstName**: `string`

#### lastName

> **lastName**: `string`

***

### description

> **description**: `string`

Defined in: [src/utils/interfaces.ts:485](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L485)

***

### id

> **id**: `string`

Defined in: [src/utils/interfaces.ts:477](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L477)

***

### image

> **image**: `string`

Defined in: [src/utils/interfaces.ts:478](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L478)

***

### members

> **members**: `object`[]

Defined in: [src/utils/interfaces.ts:489](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L489)

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

Defined in: [src/utils/interfaces.ts:502](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L502)

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

Defined in: [src/utils/interfaces.ts:484](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L484)

***

### userRegistrationRequired

> **userRegistrationRequired**: `boolean`

Defined in: [src/utils/interfaces.ts:487](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L487)

***

### visibleInSearch

> **visibleInSearch**: `boolean`

Defined in: [src/utils/interfaces.ts:488](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L488)
