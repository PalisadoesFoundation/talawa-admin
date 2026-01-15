[**talawa-admin**](../../../README.md)

***

# Interface: InterfaceOrganizationPg

Defined in: [src/utils/interfaces.ts:1317](https://github.com/Anshikaaa06/talawa-admin/blob/9e54ad8a0be6c052a435c30f5a6bbbad9b905bb5/src/utils/interfaces.ts#L1317)

InterfaceOrganizationPg

## Description

Defines the structure for an organization with PostgreSQL-specific fields.

## Properties

### organization

> **organization**: `object`

Defined in: [src/utils/interfaces.ts:1318](https://github.com/Anshikaaa06/talawa-admin/blob/9e54ad8a0be6c052a435c30f5a6bbbad9b905bb5/src/utils/interfaces.ts#L1318)

The organization object.

#### addressLine1

> **addressLine1**: `string`

#### addressLine2

> **addressLine2**: `string`

#### adminsCount

> **adminsCount**: `number`

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

#### membersCount

> **membersCount**: `number`

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
