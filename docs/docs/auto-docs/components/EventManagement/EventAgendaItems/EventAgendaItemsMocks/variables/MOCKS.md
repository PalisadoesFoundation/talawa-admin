[Admin Docs](/)

***

# Variable: MOCKS

> `const` **MOCKS**: (\{ `request`: \{ `query`: `DocumentNode`; `variables`: \{ `input?`: `undefined`; `organizationId`: `string`; `relatedEventId?`: `undefined`; \}; \}; `result`: \{ `data`: \{ `agendaItemByEvent?`: `undefined`; `agendaItemCategoriesByOrganization`: `object`[]; `createAgendaItem?`: `undefined`; \}; \}; \} \| \{ `request`: \{ `query`: `DocumentNode`; `variables`: \{ `input?`: `undefined`; `organizationId?`: `undefined`; `relatedEventId`: `string`; \}; \}; `result`: \{ `data`: \{ `agendaItemByEvent`: `object`[]; `agendaItemCategoriesByOrganization?`: `undefined`; `createAgendaItem?`: `undefined`; \}; \}; \} \| \{ `request`: \{ `query`: `DocumentNode`; `variables`: \{ `input`: \{ `attachments`: `any`[]; `categories`: `string`[]; `description`: `string`; `duration`: `string`; `organizationId`: `string`; `relatedEventId`: `string`; `sequence`: `number`; `title`: `string`; `urls`: `any`[]; \}; `organizationId?`: `undefined`; `relatedEventId?`: `undefined`; \}; \}; `result`: \{ `data`: \{ `agendaItemByEvent?`: `undefined`; `agendaItemCategoriesByOrganization?`: `undefined`; `createAgendaItem`: \{ `_id`: `string`; \}; \}; \}; \})[]

Defined in: [src/components/EventManagement/EventAgendaItems/EventAgendaItemsMocks.ts:6](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/EventManagement/EventAgendaItems/EventAgendaItemsMocks.ts#L6)
