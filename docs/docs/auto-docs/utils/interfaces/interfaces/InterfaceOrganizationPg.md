[Admin Docs](/)

***

# Interface: InterfaceOrganizationPg

Defined in: [src/utils/interfaces.ts:1303](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1303)

InterfaceOrganizationPg

## Description

Defines the structure for an organization with PostgreSQL-specific fields.

## Properties

### organization

> **organization**: `object`

Defined in: [src/utils/interfaces.ts:1304](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1304)

The organization object.

#### addressLine1

> **addressLine1**: `string`

#### addressLine2

> **addressLine2**: `string`

#### advertisements

> **advertisements**: [`InterfaceOrganizationAdvertisementsConnectionPg`](InterfaceOrganizationAdvertisementsConnectionPg.md)

#### avatarMimeType

> **avatarMimeType**: `string`

#### avatarURL

> **avatarURL**: `string`

#### blockedUsers

> **blockedUsers**: [`InterfaceOrganizationBlockedUsersConnectionPg`](InterfaceOrganizationBlockedUsersConnectionPg.md)

#### chats

> **chats**: `InterfaceOrganizationChatsConnectionPg`

#### city

> **city**: `string`

#### countryCode

> **countryCode**: [`Iso3166Alpha2CountryCode`](../enumerations/Iso3166Alpha2CountryCode.md)

#### createdAt

> **createdAt**: `Date`

#### creator

> **creator**: [`InterfaceUserPg`](InterfaceUserPg.md)

#### description

> **description**: `string`

#### events

> **events**: [`InterfaceOrganizationEventsConnectionPg`](InterfaceOrganizationEventsConnectionPg.md)

#### funds

> **funds**: [`InterfaceOrganizationFundsConnectionPg`](InterfaceOrganizationFundsConnectionPg.md)

#### id

> **id**: `string`

#### members

> **members**: [`InterfaceOrganizationMembersConnectionPg`](InterfaceOrganizationMembersConnectionPg.md)

#### name

> **name**: `string`

#### pinnedPosts

> **pinnedPosts**: [`InterfaceOrganizationPinnedPostsConnectionPg`](InterfaceOrganizationPinnedPostsConnectionPg.md)

#### pinnedPostsCount

> **pinnedPostsCount**: `number`

#### posts

> **posts**: [`InterfaceOrganizationPostsConnectionPg`](InterfaceOrganizationPostsConnectionPg.md)

#### postsCount

> **postsCount**: `number`

#### tagFolders

> **tagFolders**: [`InterfaceOrganizationTagFoldersConnectionPg`](InterfaceOrganizationTagFoldersConnectionPg.md)

#### tags

> **tags**: [`InterfaceOrganizationTagsConnectionPg`](InterfaceOrganizationTagsConnectionPg.md)

#### updatedAt

> **updatedAt**: `Date`

#### updater

> **updater**: [`InterfaceUserPg`](InterfaceUserPg.md)

#### venues

> **venues**: [`InterfaceOrganizationVenuesConnectionPg`](InterfaceOrganizationVenuesConnectionPg.md)
