[Admin Docs](/)

***

# Interface: InterfaceUserPg

Defined in: [src/utils/interfaces.ts:672](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L672)

InterfaceUserPg

## Description

Defines the structure for a user with PostgreSQL-specific fields.

## Properties

### addressLine1

> **addressLine1**: `string`

Defined in: [src/utils/interfaces.ts:673](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L673)

The first line of the user's address.

***

### addressLine2

> **addressLine2**: `string`

Defined in: [src/utils/interfaces.ts:674](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L674)

The second line of the user's address.

***

### avatarMimeType

> **avatarMimeType**: `string`

Defined in: [src/utils/interfaces.ts:675](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L675)

The MIME type of the user's avatar.

***

### avatarURL

> **avatarURL**: `string`

Defined in: [src/utils/interfaces.ts:676](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L676)

The URL of the user's avatar.

***

### birthDate

> **birthDate**: `Date`

Defined in: [src/utils/interfaces.ts:677](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L677)

The birth date of the user.

***

### city

> **city**: `string`

Defined in: [src/utils/interfaces.ts:678](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L678)

The city of the user's address.

***

### countryCode

> **countryCode**: [`Iso3166Alpha2CountryCode`](utils\interfaces\README\enumerations\Iso3166Alpha2CountryCode.md)

Defined in: [src/utils/interfaces.ts:679](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L679)

The country code of the user's address.

***

### createdAt

> **createdAt**: `string`

Defined in: [src/utils/interfaces.ts:680](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L680)

The creation date of the user record.

***

### creator

> **creator**: `InterfaceUserPg`

Defined in: [src/utils/interfaces.ts:681](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L681)

The user who created this record.

***

### description

> **description**: `string`

Defined in: [src/utils/interfaces.ts:682](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L682)

A description of the user.

***

### educationGrade

> **educationGrade**: `UserEducationGrade`

Defined in: [src/utils/interfaces.ts:683](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L683)

The education grade of the user.

***

### emailAddress

> **emailAddress**: `string`

Defined in: [src/utils/interfaces.ts:684](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L684)

The email address of the user.

***

### employmentStatus

> **employmentStatus**: `UserEmploymentStatus`

Defined in: [src/utils/interfaces.ts:685](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L685)

The employment status of the user.

***

### homePhoneNumber

> **homePhoneNumber**: `string`

Defined in: [src/utils/interfaces.ts:686](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L686)

The home phone number of the user.

***

### id

> **id**: `ID`

Defined in: [src/utils/interfaces.ts:687](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L687)

The unique identifier of the user.

***

### isEmailAddressVerified

> **isEmailAddressVerified**: `boolean`

Defined in: [src/utils/interfaces.ts:688](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L688)

Indicates if the user's email address is verified.

***

### maritalStatus

> **maritalStatus**: `UserMaritalStatus`

Defined in: [src/utils/interfaces.ts:689](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L689)

The marital status of the user.

***

### mobilePhoneNumber

> **mobilePhoneNumber**: `string`

Defined in: [src/utils/interfaces.ts:690](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L690)

The mobile phone number of the user.

***

### name

> **name**: `string`

Defined in: [src/utils/interfaces.ts:691](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L691)

The full name of the user.

***

### natalSex

> **natalSex**: `UserNatalSex`

Defined in: [src/utils/interfaces.ts:692](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L692)

The natal sex of the user.

***

### postalCode

> **postalCode**: `string`

Defined in: [src/utils/interfaces.ts:693](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L693)

The postal code of the user's address.

***

### role

> **role**: `UserRole`

Defined in: [src/utils/interfaces.ts:694](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L694)

The role of the user.

***

### state

> **state**: `string`

Defined in: [src/utils/interfaces.ts:695](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L695)

The state of the user's address.

***

### updatedAt

> **updatedAt**: `string`

Defined in: [src/utils/interfaces.ts:696](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L696)

The last update date of the user record.

***

### updater

> **updater**: `InterfaceUserPg`

Defined in: [src/utils/interfaces.ts:697](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L697)

The user who last updated this record.

***

### workPhoneNumber

> **workPhoneNumber**: `string`

Defined in: [src/utils/interfaces.ts:698](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L698)

The work phone number of the user.
