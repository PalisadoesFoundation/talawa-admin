[Admin Docs](/)

***

# Variable: volunteerListQuery

> `const` **volunteerListQuery**: (\{ `request`: \{ `query`: `DocumentNode`; `variables`: \{ `where`: \{ `eventId`: `string`; `hasAccepted`: `boolean`; \}; \}; \}; `result`: \{ `data`: \{ `getEventVolunteers`: (\{ `_id`: `string`; `assignments`: `any`[]; `groups`: `object`[]; `hasAccepted`: `boolean`; `hoursVolunteered`: `number`; `user`: \{ `_id`: `string`; `firstName`: `string`; `image`: `any`; `lastName`: `string`; \}; \} \| \{ `_id`: `undefined`; `assignments`: `any`[]; `groups`: `any`[]; `hasAccepted`: `boolean`; `hoursVolunteered`: `number`; `user`: \{ `_id`: `undefined`; `firstName`: `string`; `image`: `any`; `lastName`: `string`; \}; \})[]; \}; \}; \} \| \{ `request`: \{ `query`: `DocumentNode`; `variables`: \{ `where`: \{ `eventId`: `undefined`; `hasAccepted`: `boolean`; \}; \}; \}; `result`: \{ `data`: \{ `getEventVolunteers`: `any`[]; \}; \}; \})[]

Defined in: [src/screens/OrganizationActionItems/testObject.mocks.ts:228](https://github.com/gautam-divyanshu/talawa-admin/blob/7e5a95aa37ca1c5b95489b6b18ea8cf85fb3559b/src/screens/OrganizationActionItems/testObject.mocks.ts#L228)