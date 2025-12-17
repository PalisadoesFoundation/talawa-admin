[Admin Docs](/)

***

# Interface: InterfaceUserPg

Defined in: src/utils/interfaces.ts:678

InterfaceUserPg

## Description

Defines the structure for a user with PostgreSQL-specific fields.

## Properties

### addressLine1

> **addressLine1**: `string`

Defined in: src/utils/interfaces.ts:679

The first line of the user's address.

***

### addressLine2

> **addressLine2**: `string`

Defined in: src/utils/interfaces.ts:680

The second line of the user's address.

***

### avatarMimeType

> **avatarMimeType**: `string`

Defined in: src/utils/interfaces.ts:681

The MIME type of the user's avatar.

***

### avatarURL

> **avatarURL**: `string`

Defined in: src/utils/interfaces.ts:682

The URL of the user's avatar.

***

### birthDate

> **birthDate**: `Date`

Defined in: src/utils/interfaces.ts:683

The birth date of the user.

***

### city

> **city**: `string`

Defined in: src/utils/interfaces.ts:684

The city of the user's address.

***

### countryCode

> **countryCode**: [`Iso3166Alpha2CountryCode`](../enumerations/Iso3166Alpha2CountryCode.md)

Defined in: src/utils/interfaces.ts:685

The country code of the user's address.

***

### createdAt

> **createdAt**: `string`

Defined in: src/utils/interfaces.ts:686

The creation date of the user record.

***

### creator

> **creator**: `InterfaceUserPg`

Defined in: src/utils/interfaces.ts:687

The user who created this record.

***

### description

> **description**: `string`

Defined in: src/utils/interfaces.ts:688

A description of the user.

***

### educationGrade

> **educationGrade**: `UserEducationGrade`

Defined in: src/utils/interfaces.ts:689

The education grade of the user.

***

### emailAddress

> **emailAddress**: `string`

Defined in: src/utils/interfaces.ts:690

The email address of the user.

***

### employmentStatus

> **employmentStatus**: `UserEmploymentStatus`

Defined in: src/utils/interfaces.ts:691

The employment status of the user.

***

### homePhoneNumber

> **homePhoneNumber**: `string`

Defined in: src/utils/interfaces.ts:692

The home phone number of the user.

***

### id

> **id**: `ID`

Defined in: src/utils/interfaces.ts:693

The unique identifier of the user.

***

### isEmailAddressVerified

> **isEmailAddressVerified**: `boolean`

Defined in: src/utils/interfaces.ts:694

Indicates if the user's email address is verified.

***

### maritalStatus

> **maritalStatus**: `UserMaritalStatus`

Defined in: src/utils/interfaces.ts:695

The marital status of the user.

***

### mobilePhoneNumber

> **mobilePhoneNumber**: `string`

Defined in: src/utils/interfaces.ts:696

The mobile phone number of the user.

***

### name

> **name**: `string`

Defined in: src/utils/interfaces.ts:697

The full name of the user.

***

### natalSex

> **natalSex**: `UserNatalSex`

Defined in: src/utils/interfaces.ts:698

The natal sex of the user.

***

### postalCode

> **postalCode**: `string`

Defined in: src/utils/interfaces.ts:699

The postal code of the user's address.

***

### role

> **role**: `UserRole`

Defined in: src/utils/interfaces.ts:700

The role of the user.

***

### state

> **state**: `string`

Defined in: src/utils/interfaces.ts:701

The state of the user's address.

***

### updatedAt

> **updatedAt**: `string`

Defined in: src/utils/interfaces.ts:702

The last update date of the user record.

***

### updater

> **updater**: `InterfaceUserPg`

Defined in: src/utils/interfaces.ts:703

The user who last updated this record.

***

### workPhoneNumber

> **workPhoneNumber**: `string`

Defined in: src/utils/interfaces.ts:704

The work phone number of the user.
