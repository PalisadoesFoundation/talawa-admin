[Admin Docs](/)

***

# Interface: InterfaceQueryOrganizationsListObject

Defined in: [src/utils/interfaces.ts:582](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L582)

InterfaceQueryOrganizationsListObject
Defines the structure for an organization object returned from a query.

## Properties

### address

> **address**: [`InterfaceAddress`](InterfaceAddress.md)

Defined in: [src/utils/interfaces.ts:592](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L592)

The address of the organization.

***

### admins

> **admins**: `object`[]

Defined in: [src/utils/interfaces.ts:601](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L601)

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

Defined in: [src/utils/interfaces.ts:616](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L616)

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

Defined in: [src/utils/interfaces.ts:585](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L585)

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

Defined in: [src/utils/interfaces.ts:591](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L591)

The description of the organization.

***

### id

> **id**: `string`

Defined in: [src/utils/interfaces.ts:583](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L583)

The unique identifier of the organization.

***

### image

> **image**: `string`

Defined in: [src/utils/interfaces.ts:584](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L584)

The URL of the organization's image, or null.

***

### members

> **members**: `object`[]

Defined in: [src/utils/interfaces.ts:595](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L595)

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

Defined in: [src/utils/interfaces.ts:608](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L608)

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

Defined in: [src/utils/interfaces.ts:590](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L590)

The name of the organization.

***

### userRegistrationRequired

> **userRegistrationRequired**: `boolean`

Defined in: [src/utils/interfaces.ts:593](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L593)

Indicates if user registration is required for this organization.

***

### visibleInSearch

> **visibleInSearch**: `boolean`

Defined in: [src/utils/interfaces.ts:594](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L594)

Indicates if the organization is visible in search results.
