[Admin Docs](/)

***

# Variable: MOCKS

> `const` **MOCKS**: (\{ `request`: \{ `query`: `DocumentNode`; `variables`: \{ `eventId?`: `undefined`; `input`: \{ `allDay?`: `undefined`; `description?`: `undefined`; `endAt?`: `undefined`; `id`: `string`; `isPublic?`: `undefined`; `isRegisterable?`: `undefined`; `location?`: `undefined`; `name?`: `undefined`; `startAt?`: `undefined`; \}; \}; \}; `result`: \{ `data`: \{ `registerForEvent?`: `undefined`; `removeEvent`: \{ `_id`: `string`; \}; `updateEvent?`: `undefined`; \}; \}; \} \| \{ `request`: \{ `query`: `DocumentNode`; `variables`: \{ `eventId?`: `undefined`; `input`: \{ `allDay`: `boolean`; `description`: `string`; `endAt`: `string`; `id`: `string`; `isPublic`: `boolean`; `isRegisterable`: `boolean`; `location`: `string`; `name`: `string`; `startAt`: `string`; \}; \}; \}; `result`: \{ `data`: \{ `registerForEvent?`: `undefined`; `removeEvent?`: `undefined`; `updateEvent`: \{ `allDay`: `boolean`; `createdAt`: `string`; `creator`: \{ `id`: `string`; `name`: `string`; \}; `description`: `string`; `endAt`: `string`; `id`: `string`; `isPublic`: `boolean`; `isRegisterable`: `boolean`; `location`: `string`; `name`: `string`; `organization`: \{ `id`: `string`; `name`: `string`; \}; `startAt`: `string`; `updatedAt`: `string`; `updater`: \{ `id`: `string`; `name`: `string`; \}; \}; \}; \}; \} \| \{ `request`: \{ `query`: `DocumentNode`; `variables`: \{ `eventId`: `string`; `input?`: `undefined`; \}; \}; `result`: \{ `data`: \{ `registerForEvent`: `object`[]; `removeEvent?`: `undefined`; `updateEvent?`: `undefined`; \}; \}; \})[]

Defined in: [src/components/EventListCard/Modal/EventListCardMocks.ts:8](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/EventListCard/Modal/EventListCardMocks.ts#L8)
