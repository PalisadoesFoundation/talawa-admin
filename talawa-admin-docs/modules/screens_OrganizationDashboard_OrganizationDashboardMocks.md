[talawa-admin](../README.md) / [Modules](../modules.md) / screens/OrganizationDashboard/OrganizationDashboardMocks

# Module: screens/OrganizationDashboard/OrganizationDashboardMocks

## Table of contents

### Variables

- [EMPTY\_MOCKS](screens_OrganizationDashboard_OrganizationDashboardMocks.md#empty_mocks)
- [ERROR\_MOCKS](screens_OrganizationDashboard_OrganizationDashboardMocks.md#error_mocks)
- [MOCKS](screens_OrganizationDashboard_OrganizationDashboardMocks.md#mocks)

## Variables

### EMPTY\_MOCKS

• `Const` **EMPTY\_MOCKS**: (\{ `request`: \{ `query`: `DocumentNode` = ORGANIZATIONS\_LIST \} ; `result`: \{ `data`: \{ `eventsByOrganizationConnection?`: `undefined` ; `organizations`: \{ `_id`: `number` = 123; `address`: \{ `city`: `string` = 'Delhi'; `countryCode`: `string` = 'IN'; `dependentLocality`: `string` = 'Some Dependent Locality'; `line1`: `string` = '123 Random Street'; `line2`: `string` = 'Apartment 456'; `postalCode`: `string` = '110001'; `sortingCode`: `string` = 'ABC-123'; `state`: `string` = 'Delhi' \} ; `admins`: \{ `_id`: `string` = '123'; `email`: `string` = 'johndoe@gmail.com'; `firstName`: `string` = 'John'; `lastName`: `string` = 'Doe' \}[] ; `blockedUsers`: \{ `_id`: `string` = '789'; `email`: `string` = 'stevesmith@gmail.com'; `firstName`: `string` = 'Steve'; `lastName`: `string` = 'Smith' \}[] ; `creator`: \{ `email`: `string` = 'johndoe@gmail.com'; `firstName`: `string` = 'John'; `lastName`: `string` = 'Doe' \} ; `description`: `string` = 'This is a Dummy Organization'; `image`: `string` = ''; `members`: \{ `_id`: `string` = '123'; `email`: `string` = 'johndoe@gmail.com'; `firstName`: `string` = 'John'; `lastName`: `string` = 'Doe' \}[] ; `membershipRequests`: `never`[] = []; `name`: `string` = 'Dummy Organization'; `userRegistrationRequired`: `boolean` = true; `visibleInSearch`: `boolean` = false \}[] ; `postsByOrganizationConnection?`: `undefined`  \}  \}  \} \| \{ `request`: \{ `query`: `DocumentNode` = ORGANIZATION\_POST\_CONNECTION\_LIST \} ; `result`: \{ `data`: \{ `eventsByOrganizationConnection?`: `undefined` ; `organizations?`: `undefined` ; `postsByOrganizationConnection`: \{ `edges`: `never`[] = [] \}  \}  \}  \} \| \{ `request`: \{ `query`: `DocumentNode` = ORGANIZATION\_EVENT\_CONNECTION\_LIST \} ; `result`: \{ `data`: \{ `eventsByOrganizationConnection`: `never`[] = []; `organizations?`: `undefined` ; `postsByOrganizationConnection?`: `undefined`  \}  \}  \})[]

#### Defined in

[src/screens/OrganizationDashboard/OrganizationDashboardMocks.ts:197](https://github.com/PalisadoesFoundation/talawa-admin/blob/66ecb91/src/screens/OrganizationDashboard/OrganizationDashboardMocks.ts#L197)

___

### ERROR\_MOCKS

• `Const` **ERROR\_MOCKS**: \{ `error`: `Error` ; `request`: \{ `query`: `DocumentNode` = ORGANIZATIONS\_LIST \}  \}[]

#### Defined in

[src/screens/OrganizationDashboard/OrganizationDashboardMocks.ts:281](https://github.com/PalisadoesFoundation/talawa-admin/blob/66ecb91/src/screens/OrganizationDashboard/OrganizationDashboardMocks.ts#L281)

___

### MOCKS

• `Const` **MOCKS**: (\{ `request`: \{ `query`: `DocumentNode` = ORGANIZATIONS\_LIST; `variables?`: `undefined`  \} ; `result`: \{ `data`: \{ `eventsByOrganizationConnection?`: `undefined` ; `organizations`: \{ `_id`: `number` = 123; `address`: \{ `city`: `string` = 'Delhi'; `countryCode`: `string` = 'IN'; `dependentLocality`: `string` = 'Some Dependent Locality'; `line1`: `string` = '123 Random Street'; `line2`: `string` = 'Apartment 456'; `postalCode`: `string` = '110001'; `sortingCode`: `string` = 'ABC-123'; `state`: `string` = 'Delhi' \} ; `admins`: \{ `_id`: `string` = '123'; `email`: `string` = 'johndoe@gmail.com'; `firstName`: `string` = 'John'; `lastName`: `string` = 'Doe' \}[] ; `blockedUsers`: \{ `_id`: `string` = '789'; `email`: `string` = 'stevesmith@gmail.com'; `firstName`: `string` = 'Steve'; `lastName`: `string` = 'Smith' \}[] ; `creator`: \{ `email`: `string` = ''; `firstName`: `string` = ''; `lastName`: `string` = '' \} ; `description`: `string` = 'This is a Dummy Organization'; `image`: `string` = ''; `members`: \{ `_id`: `string` = '123'; `email`: `string` = 'johndoe@gmail.com'; `firstName`: `string` = 'John'; `lastName`: `string` = 'Doe' \}[] ; `membershipRequests`: \{ `_id`: `string` = '456'; `user`: \{ `email`: `string` = 'janedoe@gmail.com'; `firstName`: `string` = 'Jane'; `lastName`: `string` = 'Doe' \}  \}[] ; `name`: `string` = 'Dummy Organization'; `userRegistrationRequired`: `boolean` = true; `visibleInSearch`: `boolean` = false \}[] ; `postsByOrganizationConnection?`: `undefined`  \}  \}  \} \| \{ `request`: \{ `query`: `DocumentNode` = ORGANIZATION\_POST\_CONNECTION\_LIST; `variables?`: `undefined`  \} ; `result`: \{ `data`: \{ `eventsByOrganizationConnection?`: `undefined` ; `organizations?`: `undefined` ; `postsByOrganizationConnection`: \{ `edges`: \{ `_id`: `string` = '6411e54835d7ba2344a78e29'; `commentCount`: `number` = 2; `comments`: \{ `__typename`: `string` = 'Comment'; `_id`: `string` = '64eb13beca85de60ebe0ed0e'; `creator`: \{ `__typename`: `string` = 'User'; `_id`: `string` = '63d6064458fce20ee25c3bf7'; `email`: `string` = 'test@gmail.com'; `firstName`: `string` = 'Noble'; `lastName`: `string` = 'Mittal' \} ; `likeCount`: `number` = 1; `likedBy`: \{ `_id`: `number` = 1 \}[] ; `text`: `string` = 'Yes, that is $50' \}[] ; `createdAt`: `Dayjs` ; `creator`: \{ `_id`: `string` = '640d98d9eb6a743d75341067'; `email`: `string` = 'adidacreator1@gmail.com'; `firstName`: `string` = 'Aditya'; `lastName`: `string` = 'Shelke' \} ; `imageUrl`: ``null`` = null; `likeCount`: `number` = 0; `likedBy`: \{ `_id`: `string` = '63d6064458fce20ee25c3bf7'; `firstName`: `string` = 'Comment'; `lastName`: `string` = 'Likkert' \}[] ; `pinned`: `boolean` = false; `text`: `string` = 'Hey, anyone saw my watch that I left at the office?'; `title`: `string` = 'Post 2'; `videoUrl`: ``null`` = null \}[]  \}  \}  \}  \} \| \{ `request`: \{ `query`: `DocumentNode` = ORGANIZATION\_EVENT\_CONNECTION\_LIST; `variables`: \{ `organization_id`: `string` = '123' \}  \} ; `result`: \{ `data`: \{ `eventsByOrganizationConnection`: \{ `_id`: `string` = '1'; `allDay`: `boolean` = false; `description`: `string` = 'Sample Description'; `endDate`: `string` = '2023-10-29T23:59:59.000Z'; `endTime`: `string` = '17:00:00'; `isPublic`: `boolean` = true; `isRegisterable`: `boolean` = true; `location`: `string` = 'Sample Location'; `recurring`: `boolean` = false; `startDate`: `string` = '2023-10-29T00:00:00.000Z'; `startTime`: `string` = '08:00:00'; `title`: `string` = 'Sample Event' \}[] ; `organizations?`: `undefined` ; `postsByOrganizationConnection?`: `undefined`  \}  \}  \})[]

#### Defined in

[src/screens/OrganizationDashboard/OrganizationDashboardMocks.ts:8](https://github.com/PalisadoesFoundation/talawa-admin/blob/66ecb91/src/screens/OrganizationDashboard/OrganizationDashboardMocks.ts#L8)
