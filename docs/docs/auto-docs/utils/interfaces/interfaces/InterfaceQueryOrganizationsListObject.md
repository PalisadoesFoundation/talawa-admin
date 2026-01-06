[Admin Docs](/)

***

# Interface: InterfaceQueryOrganizationsListObject

Defined in: [src/utils/interfaces.ts:573](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L573)

Defines the structure for an organization object returned from a query.

## Properties

### address

> **address**: [`InterfaceAddress`](InterfaceAddress.md)

Defined in: [src/utils/interfaces.ts:583](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L583)

The address of the organization.

***

### admins

> **admins**: `object`[]

Defined in: [src/utils/interfaces.ts:592](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L592)

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

Defined in: [src/utils/interfaces.ts:607](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L607)

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

Defined in: [src/utils/interfaces.ts:576](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L576)

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

Defined in: [src/utils/interfaces.ts:582](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L582)

The description of the organization.

***

### id

> **id**: `string`

Defined in: [src/utils/interfaces.ts:574](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L574)

The unique identifier of the organization.

***

### image

> **image**: `string`

Defined in: [src/utils/interfaces.ts:575](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L575)

The URL of the organization's image, or null.

***

### members

> **members**: `object`[]

Defined in: [src/utils/interfaces.ts:586](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L586)

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

Defined in: [src/utils/interfaces.ts:599](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L599)

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

Defined in: [src/utils/interfaces.ts:581](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L581)

The name of the organization.

***

### userRegistrationRequired

> **userRegistrationRequired**: `boolean`

Defined in: [src/utils/interfaces.ts:584](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L584)

Indicates if user registration is required for this organization.

***

### visibleInSearch

> **visibleInSearch**: `boolean`

Defined in: [src/utils/interfaces.ts:585](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L585)

Indicates if the organization is visible in search results.
