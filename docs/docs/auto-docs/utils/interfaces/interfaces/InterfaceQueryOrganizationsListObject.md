[Admin Docs](/)

***

# Interface: InterfaceQueryOrganizationsListObject

Defined in: [src/utils/interfaces.ts:478](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L478)

Defines the structure for an organization object returned from a query.

## Properties

### address

> **address**: [`InterfaceAddress`](InterfaceAddress.md)

Defined in: [src/utils/interfaces.ts:488](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L488)

***

### admins

> **admins**: `object`[]

Defined in: [src/utils/interfaces.ts:497](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L497)

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

Defined in: [src/utils/interfaces.ts:512](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L512)

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

Defined in: [src/utils/interfaces.ts:481](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L481)

#### email

> **email**: `string`

#### firstName

> **firstName**: `string`

#### lastName

> **lastName**: `string`

***

### description

> **description**: `string`

Defined in: [src/utils/interfaces.ts:487](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L487)

***

### id

> **id**: `string`

Defined in: [src/utils/interfaces.ts:479](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L479)

***

### image

> **image**: `string`

Defined in: [src/utils/interfaces.ts:480](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L480)

***

### members

> **members**: `object`[]

Defined in: [src/utils/interfaces.ts:491](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L491)

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

Defined in: [src/utils/interfaces.ts:504](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L504)

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

Defined in: [src/utils/interfaces.ts:486](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L486)

***

### userRegistrationRequired

> **userRegistrationRequired**: `boolean`

Defined in: [src/utils/interfaces.ts:489](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L489)

***

### visibleInSearch

> **visibleInSearch**: `boolean`

Defined in: [src/utils/interfaces.ts:490](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L490)
