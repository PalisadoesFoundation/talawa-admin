[**talawa-admin**](../../../README.md)

***

# Interface: InterfaceOrganizationPg

Defined in: [src/utils/interfaces.ts:1314](https://github.com/iamanishx/talawa-admin/blob/7201593995ccfacf6f05849e614f59bf2c15323f/src/utils/interfaces.ts#L1314)

InterfaceOrganizationPg

## Description

Defines the structure for an organization with PostgreSQL-specific fields.

## Properties

### organization

> **organization**: `object`

Defined in: [src/utils/interfaces.ts:1315](https://github.com/iamanishx/talawa-admin/blob/7201593995ccfacf6f05849e614f59bf2c15323f/src/utils/interfaces.ts#L1315)

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
