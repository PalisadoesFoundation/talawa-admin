[Admin Docs](/)

***

# Variable: CREATE\_ERROR\_MOCKS

> `const` **CREATE\_ERROR\_MOCKS**: (\{ `error?`: `undefined`; `request`: \{ `query`: `DocumentNode`; `variables`: \{ `first`: `number`; `organizationId`: `string`; `upcomingOnly`: `boolean`; \}; \}; `result`: \{ `data`: \{ `getVolunteerMembership?`: `undefined`; `organization`: \{ `events`: \{ `edges`: `object`[]; \}; \}; \}; \}; \} \| \{ `error?`: `undefined`; `request`: \{ `query`: `DocumentNode`; `variables`: \{ `where`: \{ `userId`: `string`; \}; \}; \}; `result`: \{ `data`: \{ `getVolunteerMembership`: `any`[]; `organization?`: `undefined`; \}; \}; \} \| \{ `error`: `Error`; `request`: \{ `query`: `DocumentNode`; `variables`: \{ `data`: \{ `event`: `string`; `group`: `any`; `status`: `string`; `userId`: `string`; \}; \}; \}; \})[]

Defined in: [src/screens/UserPortal/Volunteer/UpcomingEvents/UpcomingEvents.mocks.ts:465](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/UserPortal/Volunteer/UpcomingEvents/UpcomingEvents.mocks.ts#L465)
