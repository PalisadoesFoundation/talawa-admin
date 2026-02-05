[Admin Docs](/)

***

# Interface: InterfaceOrganizationPg

Defined in: [src/utils/interfaces.ts:958](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L958)

Defines the structure for an organization with PostgreSQL-specific fields.

## Properties

### organization

> **organization**: `object`

Defined in: [src/utils/interfaces.ts:959](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L959)

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

#### blockedUsersCount

> **blockedUsersCount**: `number`

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

#### eventsCount

> **eventsCount**: `number`

#### funds

> **funds**: [`InterfaceOrganizationFundsConnectionPg`](InterfaceOrganizationFundsConnectionPg.md)

#### id

> **id**: `string`

#### members

> **members**: [`InterfaceOrganizationMembersConnectionPg`](InterfaceOrganizationMembersConnectionPg.md)

#### membersCount

> **membersCount**: `number`

#### membershipRequests?

> `optional` **membershipRequests**: `object`[]

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

#### venuesCount

> **venuesCount**: `number`
