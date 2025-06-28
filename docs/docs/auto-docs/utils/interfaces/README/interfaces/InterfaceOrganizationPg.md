[Admin Docs](/)

***

# Interface: InterfaceOrganizationPg

Defined in: [src/utils/interfaces.ts:1405](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1405)

InterfaceOrganizationPg

## Description

Defines the structure for an organization with PostgreSQL-specific fields.

## Properties

### organization

> **organization**: `object`

Defined in: [src/utils/interfaces.ts:1406](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1406)

The organization object.

#### addressLine1

> **addressLine1**: `string`

#### addressLine2

> **addressLine2**: `string`

#### advertisements

> **advertisements**: [`InterfaceOrganizationAdvertisementsConnectionPg`]/auto-docs/utils/interfaces/README/interfaces/InterfaceOrganizationAdvertisementsConnectionPg

#### avatarMimeType

> **avatarMimeType**: `string`

#### avatarURL

> **avatarURL**: `string`

#### blockedUsers

> **blockedUsers**: [`InterfaceOrganizationBlockedUsersConnectionPg`]/auto-docs/utils/interfaces/README/interfaces/InterfaceOrganizationBlockedUsersConnectionPg

#### chats

> **chats**: `InterfaceOrganizationChatsConnectionPg`

#### city

> **city**: `string`

#### countryCode

> **countryCode**: [`Iso3166Alpha2CountryCode`]/auto-docs/utils/interfaces/README/enumerations/Iso3166Alpha2CountryCode

#### createdAt

> **createdAt**: `Date`

#### creator

> **creator**: [`InterfaceUserPg`]/auto-docs/utils/interfaces/README/interfaces/InterfaceUserPg

#### description

> **description**: `string`

#### events

> **events**: [`InterfaceOrganizationEventsConnectionPg`]/auto-docs/utils/interfaces/README/interfaces/InterfaceOrganizationEventsConnectionPg

#### funds

> **funds**: [`InterfaceOrganizationFundsConnectionPg`]/auto-docs/utils/interfaces/README/interfaces/InterfaceOrganizationFundsConnectionPg

#### id

> **id**: `string`

#### members

> **members**: [`InterfaceOrganizationMembersConnectionPg`]/auto-docs/utils/interfaces/README/interfaces/InterfaceOrganizationMembersConnectionPg

#### name

> **name**: `string`

#### pinnedPosts

> **pinnedPosts**: [`InterfaceOrganizationPinnedPostsConnectionPg`]/auto-docs/utils/interfaces/README/interfaces/InterfaceOrganizationPinnedPostsConnectionPg

#### pinnedPostsCount

> **pinnedPostsCount**: `number`

#### posts

> **posts**: [`InterfaceOrganizationPostsConnectionPg`]/auto-docs/utils/interfaces/README/interfaces/InterfaceOrganizationPostsConnectionPg

#### postsCount

> **postsCount**: `number`

#### tagFolders

> **tagFolders**: [`InterfaceOrganizationTagFoldersConnectionPg`]/auto-docs/utils/interfaces/README/interfaces/InterfaceOrganizationTagFoldersConnectionPg

#### tags

> **tags**: [`InterfaceOrganizationTagsConnectionPg`]/auto-docs/utils/interfaces/README/interfaces/InterfaceOrganizationTagsConnectionPg

#### updatedAt

> **updatedAt**: `Date`

#### updater

> **updater**: [`InterfaceUserPg`]/auto-docs/utils/interfaces/README/interfaces/InterfaceUserPg

#### venues

> **venues**: [`InterfaceOrganizationVenuesConnectionPg`]/auto-docs/utils/interfaces/README/interfaces/InterfaceOrganizationVenuesConnectionPg
