[Admin Docs](/)

***

# Interface: ISignInResult

Defined in: [src/types/GraphQL/authQueries.ts:6](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/GraphQL/authQueries.ts#L6)

## File

authQueries.ts

## Description

Defines TypeScript interfaces for authentication-related GraphQL query and mutation results.

## Properties

### signIn

> **signIn**: `object`

Defined in: [src/types/GraphQL/authQueries.ts:7](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/GraphQL/authQueries.ts#L7)

#### authenticationToken

> **authenticationToken**: `string`

#### refreshToken

> **refreshToken**: `string`

#### user

> **user**: `object`

##### user.avatarURL?

> `optional` **avatarURL**: `string`

##### user.countryCode

> **countryCode**: `string`

##### user.emailAddress

> **emailAddress**: `string`

##### user.id

> **id**: `string`

##### user.name

> **name**: `string`

##### user.role

> **role**: `string`
