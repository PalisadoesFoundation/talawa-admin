[talawa-admin](../README.md) / [Modules](../modules.md) / screens/OrgList/OrgListMocks

# Module: screens/OrgList/OrgListMocks

## Table of contents

### Variables

- [MOCKS](screens_OrgList_OrgListMocks.md#mocks)
- [MOCKS\_ADMIN](screens_OrgList_OrgListMocks.md#mocks_admin)
- [MOCKS\_EMPTY](screens_OrgList_OrgListMocks.md#mocks_empty)

## Variables

### MOCKS

• **MOCKS** (Array of objects):
  - Object option 1:
    - **request**: Object with properties:
      - `query` (DocumentNode): Default value `ORGANIZATION_CONNECTION_LIST`.
      - `variables?`: `undefined`.
    - **result**: Object with properties:
      - `data`: Object with properties:
        - `organizationsConnection`: Array of `InterfaceOrgConnectionInfoType`, default value `organizations`.
  - Object option 2:
    - **request**: Object with properties:
      - `query` (DocumentNode): Default value `USER_ORGANIZATION_LIST`.
      - `variables`: Object with property:
        - `id` (string): Default value `'123'`.
    - **result**: Object with property:
      - `data`: `InterfaceUserType`, default value `superAdminUser`.

#### Defined in

[src/screens/OrgList/OrgListMocks.ts:79](https://github.com/PalisadoesFoundation/talawa-admin/blob/b619a0d/src/screens/OrgList/OrgListMocks.ts#L79)

___

### MOCKS\_ADMIN

• **MOCKS_ADMIN** (Array of object options):
  - Option 1:
    - **request**: Object with properties:
      - `query` (DocumentNode): Default value `ORGANIZATION_CONNECTION_LIST`.
      - `variables?`: `undefined`.
    - **result**: Object with properties:
      - `data`: Object with properties:
        - `organizationsConnection`: Array of `InterfaceOrgConnectionInfoType`, default value `organizations`.
  - Option 2:
    - **request**: Object with properties:
      - `query` (DocumentNode): Default value `USER_ORGANIZATION_LIST`.
      - `variables`: Object with property:
        - `id` (string): Default value `'123'`.
    - **result**: Object with property:
      - `data`: `InterfaceUserType`, default value `adminUser`.

#### Defined in

[src/screens/OrgList/OrgListMocks.ts:123](https://github.com/PalisadoesFoundation/talawa-admin/blob/b619a0d/src/screens/OrgList/OrgListMocks.ts#L123)

___

### MOCKS\_EMPTY

• **MOCKS_ADMIN** (Array of object options):
  - Option 1:
    - **request**: Object with properties:
      - `query` (DocumentNode): Default value `ORGANIZATION_CONNECTION_LIST`.
      - `variables?`: `undefined`.
    - **result**: Object with properties:
      - `data`: Object with properties:
        - `organizationsConnection`: Array of `InterfaceOrgConnectionInfoType`, default value `organizations`.
  - Option 2:
    - **request**: Object with properties:
      - `query` (DocumentNode): Default value `USER_ORGANIZATION_LIST`.
      - `variables`: Object with property:
        - `id` (string): Default value `'123'`.
    - **result**: Object with property:
      - `data`: `InterfaceUserType`, default value `adminUser`.

#### Defined in

[src/screens/OrgList/OrgListMocks.ts:100](https://github.com/PalisadoesFoundation/talawa-admin/blob/b619a0d/src/screens/OrgList/OrgListMocks.ts#L100)
