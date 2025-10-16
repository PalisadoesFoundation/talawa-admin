[Admin Docs](/)

***

# Variable: MOCKS

> `const` **MOCKS**: (\{ `request`: \{ `query`: `DocumentNode`; `variables`: \{ `first`: `number`; `organizationId`: `string`; `upcomingOnly`: `boolean`; \}; \}; `result`: \{ `data`: \{ `createVolunteerMembership`: `undefined`; `getVolunteerMembership`: `undefined`; `organization`: \{ `events`: \{ `edges`: `object`[]; \}; \}; \}; \}; \} \| \{ `request`: \{ `query`: `DocumentNode`; `variables`: \{ `where`: \{ `userId`: `string`; \}; \}; \}; `result`: \{ `data`: \{ `createVolunteerMembership`: `undefined`; `getVolunteerMembership`: `any`[]; `organization`: `undefined`; \}; \}; \} \| \{ `request`: \{ `query`: `DocumentNode`; `variables`: \{ `data`: \{ `event`: `string`; `group`: `string`; `status`: `string`; `userId`: `string`; \}; \}; \}; `result`: \{ `data`: \{ `createVolunteerMembership`: \{ `createdAt`: `string`; `createdBy`: \{ `id`: `string`; `name`: `string`; \}; `event`: \{ `id`: `string`; `name`: `string`; \}; `group`: \{ `description`: `string`; `id`: `string`; `name`: `string`; \}; `id`: `string`; `status`: `string`; `volunteer`: \{ `hasAccepted`: `boolean`; `id`: `string`; `user`: \{ `id`: `string`; `name`: `string`; \}; \}; \}; `getVolunteerMembership`: `undefined`; `organization`: `undefined`; \}; \}; \})[]

Defined in: [src/screens/UserPortal/Volunteer/UpcomingEvents/UpcomingEvents.mocks.ts:176](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/UserPortal/Volunteer/UpcomingEvents/UpcomingEvents.mocks.ts#L176)
