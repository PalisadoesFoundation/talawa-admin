[Admin Docs](/)

***

# Interface: InterfaceUserPg

Defined in: [src/utils/interfaces.ts:704](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L704)

InterfaceUserPg

## Description

Defines the structure for a user with PostgreSQL-specific fields.

## Properties

### addressLine1

> **addressLine1**: `string`

Defined in: [src/utils/interfaces.ts:705](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L705)

The first line of the user's address.

***

### addressLine2

> **addressLine2**: `string`

Defined in: [src/utils/interfaces.ts:706](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L706)

The second line of the user's address.

***

### avatarMimeType

> **avatarMimeType**: `string`

Defined in: [src/utils/interfaces.ts:707](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L707)

The MIME type of the user's avatar.

***

### avatarURL

> **avatarURL**: `string`

Defined in: [src/utils/interfaces.ts:708](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L708)

The URL of the user's avatar.

***

### birthDate

> **birthDate**: `Date`

Defined in: [src/utils/interfaces.ts:709](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L709)

The birth date of the user.

***

### city

> **city**: `string`

Defined in: [src/utils/interfaces.ts:710](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L710)

The city of the user's address.

***

### countryCode

> **countryCode**: [`Iso3166Alpha2CountryCode`](../enumerations/Iso3166Alpha2CountryCode.md)

Defined in: [src/utils/interfaces.ts:711](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L711)

The country code of the user's address.

***

### createdAt

> **createdAt**: `string`

Defined in: [src/utils/interfaces.ts:712](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L712)

The creation date of the user record.

***

### creator

> **creator**: `InterfaceUserPg`

Defined in: [src/utils/interfaces.ts:713](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L713)

The user who created this record.

***

### description

> **description**: `string`

Defined in: [src/utils/interfaces.ts:714](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L714)

A description of the user.

***

### educationGrade

> **educationGrade**: `UserEducationGrade`

Defined in: [src/utils/interfaces.ts:715](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L715)

The education grade of the user.

***

### emailAddress

> **emailAddress**: `string`

Defined in: [src/utils/interfaces.ts:716](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L716)

The email address of the user.

***

### employmentStatus

> **employmentStatus**: `UserEmploymentStatus`

Defined in: [src/utils/interfaces.ts:717](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L717)

The employment status of the user.

***

### homePhoneNumber

> **homePhoneNumber**: `string`

Defined in: [src/utils/interfaces.ts:718](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L718)

The home phone number of the user.

***

### id

> **id**: `ID`

Defined in: [src/utils/interfaces.ts:719](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L719)

The unique identifier of the user.

***

### isEmailAddressVerified

> **isEmailAddressVerified**: `boolean`

Defined in: [src/utils/interfaces.ts:720](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L720)

Indicates if the user's email address is verified.

***

### maritalStatus

> **maritalStatus**: `UserMaritalStatus`

Defined in: [src/utils/interfaces.ts:721](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L721)

The marital status of the user.

***

### mobilePhoneNumber

> **mobilePhoneNumber**: `string`

Defined in: [src/utils/interfaces.ts:722](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L722)

The mobile phone number of the user.

***

### name

> **name**: `string`

Defined in: [src/utils/interfaces.ts:723](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L723)

The full name of the user.

***

### natalSex

> **natalSex**: `UserNatalSex`

Defined in: [src/utils/interfaces.ts:724](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L724)

The natal sex of the user.

***

### postalCode

> **postalCode**: `string`

Defined in: [src/utils/interfaces.ts:725](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L725)

The postal code of the user's address.

***

### role

> **role**: `UserRole`

Defined in: [src/utils/interfaces.ts:726](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L726)

The role of the user.

***

### state

> **state**: `string`

Defined in: [src/utils/interfaces.ts:727](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L727)

The state of the user's address.

***

### updatedAt

> **updatedAt**: `string`

Defined in: [src/utils/interfaces.ts:728](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L728)

The last update date of the user record.

***

### updater

> **updater**: `InterfaceUserPg`

Defined in: [src/utils/interfaces.ts:729](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L729)

The user who last updated this record.

***

### workPhoneNumber

> **workPhoneNumber**: `string`

Defined in: [src/utils/interfaces.ts:730](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L730)

The work phone number of the user.
