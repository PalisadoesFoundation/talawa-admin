[talawa-admin](../README.md) / [Modules](../modules.md) / screens/Users/UsersMocks

# Module: screens/Users/UsersMocks

## Table of contents

### Variables

- [EMPTY\_MOCKS](screens_Users_UsersMocks.md#empty_mocks)
- [MOCKS](screens_Users_UsersMocks.md#mocks)
- [MOCKS2](screens_Users_UsersMocks.md#mocks2)

## Variables

### EMPTY\_MOCKS

• `Const` **EMPTY\_MOCKS**: (\{ `request`: \{ `query`: `DocumentNode` = USER\_LIST; `variables`: \{ `first`: `number` = 12; `firstName_contains`: `string` = ''; `lastName_contains`: `string` = ''; `skip`: `number` = 0 \}  \} ; `result`: \{ `data`: \{ `organizationsConnection?`: `undefined` = organizations; `users`: `never`[] = [] \}  \}  \} \| \{ `request`: \{ `query`: `DocumentNode` = ORGANIZATION\_CONNECTION\_LIST; `variables?`: `undefined`  \} ; `result`: \{ `data`: \{ `organizationsConnection`: `never`[] = []; `users?`: `undefined`  \}  \}  \})[]

#### Defined in

[src/screens/Users/UsersMocks.ts:320](https://github.com/palisadoes/talawa-admin/blob/5828937/src/screens/Users/UsersMocks.ts#L320)

___

### MOCKS

• `Const` **MOCKS**: (\{ `request`: \{ `query`: `DocumentNode` = USER\_ORGANIZATION\_LIST; `variables`: \{ `first?`: `undefined` = 8; `firstName_contains?`: `undefined` = 'john'; `id`: `string` = 'user1'; `lastName_contains?`: `undefined` = ''; `skip?`: `undefined` = 0 \}  \} ; `result`: \{ `data`: \{ `organizationsConnection?`: `undefined` = organizations; `user`: \{ `_id`: `string` = 'user1'; `adminFor`: \{ `_id`: `number` = 1; `image`: `string` = ''; `name`: `string` = 'Palisadoes' \}[] ; `email`: `string` = 'John\_Does\_Palasidoes@gmail.com'; `firstName`: `string` = 'John'; `image`: `string` = ''; `lastName`: `string` = 'Doe'; `userType`: `string` = 'SUPERADMIN' \} ; `users?`: `undefined`  \}  \}  \} \| \{ `request`: \{ `query`: `DocumentNode` = USER\_LIST; `variables`: \{ `first`: `number` = 12; `firstName_contains`: `string` = ''; `id?`: `undefined` = '456'; `lastName_contains`: `string` = ''; `skip`: `number` = 0 \}  \} ; `result`: \{ `data`: \{ `organizationsConnection?`: `undefined` = organizations; `user?`: `undefined` ; `users`: \{ `_id`: `string` = 'user1'; `adminApproved`: `boolean` = true; `adminFor`: \{ `_id`: `string` = '123' \}[] ; `createdAt`: `string` = '20/06/2022'; `email`: `string` = 'john@example.com'; `firstName`: `string` = 'John'; `image`: ``null`` = null; `joinedOrganizations`: \{ `_id`: `string` = 'abc'; `createdAt`: `string` = '20/06/2022'; `creator`: \{ `_id`: `string` = '123'; `createdAt`: `string` = '20/06/2022'; `email`: `string` = 'john@example.com'; `firstName`: `string` = 'John'; `image`: ``null`` = null; `lastName`: `string` = 'Doe' \} ; `image`: ``null`` = null; `location`: `string` = 'Jamaica'; `name`: `string` = 'Joined Organization 1' \}[] ; `lastName`: `string` = 'Doe'; `organizationsBlockedBy`: \{ `_id`: `string` = 'xyz'; `createdAt`: `string` = '20/06/2022'; `creator`: \{ `_id`: `string` = '123'; `createdAt`: `string` = '20/06/2022'; `email`: `string` = 'john@example.com'; `firstName`: `string` = 'John'; `image`: ``null`` = null; `lastName`: `string` = 'Doe' \} ; `image`: ``null`` = null; `location`: `string` = 'Jamaica'; `name`: `string` = 'ABC' \}[] ; `userType`: `string` = 'SUPERADMIN' \}[]  \}  \}  \} \| \{ `request`: \{ `query`: `DocumentNode` = ORGANIZATION\_CONNECTION\_LIST; `variables?`: `undefined`  \} ; `result`: \{ `data`: \{ `organizationsConnection`: \{ `_id`: `number` = 123; `admins`: \{ `_id`: `string` = 'user1' \}[] ; `createdAt`: `string` = '09/11/2001'; `creator`: \{ `firstName`: `string` = 'John'; `lastName`: `string` = 'Doe' \} ; `image`: ``null`` = null; `location`: `string` = 'Twin Tower'; `members`: \{ `_id`: `string` = 'user1' \}[] ; `name`: `string` = 'Palisadoes' \}[] ; `user?`: `undefined` ; `users?`: `undefined`  \}  \}  \})[]

#### Defined in

[src/screens/Users/UsersMocks.ts:7](https://github.com/palisadoes/talawa-admin/blob/5828937/src/screens/Users/UsersMocks.ts#L7)

___

### MOCKS2

• `Const` **MOCKS2**: (\{ `request`: \{ `query`: `DocumentNode` = USER\_ORGANIZATION\_LIST; `variables`: \{ `first?`: `undefined` = 8; `firstName_contains?`: `undefined` = 'john'; `id`: `string` = 'user1'; `lastName_contains?`: `undefined` = ''; `skip?`: `undefined` = 0 \}  \} ; `result`: \{ `data`: \{ `organizationsConnection?`: `undefined` = organizations; `user`: \{ `_id`: `string` = 'user1'; `adminFor`: \{ `_id`: `number` = 1; `image`: `string` = ''; `name`: `string` = 'Palisadoes' \}[] ; `email`: `string` = 'John\_Does\_Palasidoes@gmail.com'; `firstName`: `string` = 'John'; `image`: `string` = ''; `lastName`: `string` = 'Doe'; `userType`: `string` = 'SUPERADMIN' \} ; `users?`: `undefined`  \}  \}  \} \| \{ `request`: \{ `query`: `DocumentNode` = USER\_LIST; `variables`: \{ `first`: `number` = 12; `firstName_contains`: `string` = ''; `id?`: `undefined` = '456'; `lastName_contains`: `string` = ''; `skip`: `number` = 0 \}  \} ; `result`: \{ `data`: \{ `organizationsConnection?`: `undefined` = organizations; `user?`: `undefined` ; `users`: \{ `_id`: `string` = 'user1'; `adminApproved`: `boolean` = true; `adminFor`: \{ `_id`: `string` = '123' \}[] ; `createdAt`: `string` = '20/06/2022'; `email`: `string` = 'john@example.com'; `firstName`: `string` = 'John'; `image`: ``null`` = null; `joinedOrganizations`: \{ `_id`: `string` = 'abc'; `createdAt`: `string` = '20/06/2022'; `creator`: \{ `_id`: `string` = '123'; `createdAt`: `string` = '20/06/2022'; `email`: `string` = 'john@example.com'; `firstName`: `string` = 'John'; `image`: ``null`` = null; `lastName`: `string` = 'Doe' \} ; `image`: ``null`` = null; `location`: `string` = 'Jamaica'; `name`: `string` = 'Joined Organization 1' \}[] ; `lastName`: `string` = 'Doe'; `organizationsBlockedBy`: \{ `_id`: `string` = 'xyz'; `createdAt`: `string` = '20/06/2022'; `creator`: \{ `_id`: `string` = '123'; `createdAt`: `string` = '20/06/2022'; `email`: `string` = 'john@example.com'; `firstName`: `string` = 'John'; `image`: ``null`` = null; `lastName`: `string` = 'Doe' \} ; `image`: ``null`` = null; `location`: `string` = 'Jamaica'; `name`: `string` = 'ABC' \}[] ; `userType`: `string` = 'SUPERADMIN' \}[]  \}  \}  \} \| \{ `request`: \{ `query`: `DocumentNode` = ORGANIZATION\_CONNECTION\_LIST; `variables?`: `undefined`  \} ; `result`: \{ `data`: \{ `organizationsConnection`: \{ `_id`: `number` = 123; `admins`: \{ `_id`: `string` = 'user1' \}[] ; `createdAt`: `string` = '09/11/2001'; `creator`: \{ `firstName`: `string` = 'John'; `lastName`: `string` = 'Doe' \} ; `image`: ``null`` = null; `location`: `string` = 'Twin Tower'; `members`: \{ `_id`: `string` = 'user1' \}[] ; `name`: `string` = 'Palisadoes' \}[] ; `user?`: `undefined` ; `users?`: `undefined`  \}  \}  \})[]

#### Defined in

[src/screens/Users/UsersMocks.ts:188](https://github.com/palisadoes/talawa-admin/blob/5828937/src/screens/Users/UsersMocks.ts#L188)
