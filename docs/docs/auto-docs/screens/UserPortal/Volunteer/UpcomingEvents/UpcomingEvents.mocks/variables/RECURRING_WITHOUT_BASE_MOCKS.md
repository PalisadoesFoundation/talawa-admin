[Admin Docs](/)

***

# Variable: RECURRING\_WITHOUT\_BASE\_MOCKS

> `const` **RECURRING\_WITHOUT\_BASE\_MOCKS**: (\{ `request`: \{ `query`: `DocumentNode`; `variables`: \{ `first`: `number`; `organizationId`: `string`; `upcomingOnly`: `boolean`; \}; \}; `result`: \{ `data`: \{ `createVolunteerMembership?`: `undefined`; `getVolunteerMembership?`: `undefined`; `organization`: \{ `events`: \{ `edges`: `object`[]; \}; \}; \}; \}; \} \| \{ `request`: \{ `query`: `DocumentNode`; `variables`: \{ `where`: \{ `userId`: `string`; \}; \}; \}; `result`: \{ `data`: \{ `createVolunteerMembership?`: `undefined`; `getVolunteerMembership`: `any`[]; `organization?`: `undefined`; \}; \}; \} \| \{ `request`: \{ `query`: `DocumentNode`; `variables`: \{ `data`: \{ `event`: `string`; `group`: `any`; `recurringEventInstanceId`: `string`; `scope`: `string`; `status`: `string`; `userId`: `string`; \}; \}; \}; `result`: \{ `data`: \{ `createVolunteerMembership`: \{ `id`: `string`; `status`: `string`; \}; `getVolunteerMembership?`: `undefined`; `organization?`: `undefined`; \}; \}; \})[]

Defined in: [src/screens/UserPortal/Volunteer/UpcomingEvents/UpcomingEvents.mocks.ts:697](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/UserPortal/Volunteer/UpcomingEvents/UpcomingEvents.mocks.ts#L697)
