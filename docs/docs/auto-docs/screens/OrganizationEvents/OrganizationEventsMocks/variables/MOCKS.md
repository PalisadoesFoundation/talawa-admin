[Admin Docs](/)

***

# Variable: MOCKS

> `const` **MOCKS**: (\{ `request`: \{ `query`: `DocumentNode`; `variables?`: `undefined`; \}; `result`: \{ `data`: \{ `createEvent?`: `undefined`; `organization`: \{ `events`: \{ `edges`: `object`[]; \}; `id?`: `undefined`; `name?`: `undefined`; \}; \}; \}; \} \| \{ `request`: \{ `query`: `DocumentNode`; `variables?`: `undefined`; \}; `result`: \{ `data`: \{ `createEvent?`: `undefined`; `organization`: \{ `events?`: `undefined`; `id`: `string`; `name`: `string`; \}; \}; \}; \} \| \{ `request`: \{ `query`: `DocumentNode`; `variables`: \{ `input`: \{ `allDay`: `boolean`; `description`: `string`; `endAt`: `string`; `isPublic`: `boolean`; `isRegisterable`: `boolean`; `location`: `string`; `name`: `string`; `organizationId`: `string`; `startAt`: `string`; \}; \}; \}; `result`: \{ `data`: \{ `createEvent`: \{ `allDay`: `boolean`; `baseEventId`: `any`; `createdAt`: `string`; `creator`: \{ `id`: `string`; `name`: `string`; \}; `description`: `string`; `endAt`: `string`; `hasExceptions`: `boolean`; `id`: `string`; `instanceStartTime`: `any`; `isMaterialized`: `boolean`; `isPublic`: `boolean`; `isRecurringTemplate`: `boolean`; `isRegisterable`: `boolean`; `location`: `string`; `name`: `string`; `organization`: \{ `id`: `string`; `name`: `string`; \}; `progressLabel`: `string`; `recurringEventId`: `any`; `sequenceNumber`: `number`; `startAt`: `string`; `totalCount`: `number`; `updatedAt`: `string`; `updater`: \{ `id`: `string`; `name`: `string`; \}; \}; `organization?`: `undefined`; \}; \}; \})[]

Defined in: [src/screens/OrganizationEvents/OrganizationEventsMocks.ts:7](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/OrganizationEvents/OrganizationEventsMocks.ts#L7)
