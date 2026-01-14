[Admin Docs](/)

***

# Function: default()

> **default**(): `Element`

Defined in: [src/screens/EventVolunteers/Volunteers/Volunteers.tsx:68](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/EventVolunteers/Volunteers/Volunteers.tsx#L68)

Renders the Event Volunteers screen.

Responsibilities:
- Displays volunteer listings with status chips (Accepted/Pending/Rejected)
- Uses DataGridWrapper for integrated search, sort, and filter capabilities
- Search by volunteer name with debouncing
- Sort by hours volunteered (most/least)
- Filter by status (All/Pending/Accepted/Rejected)
- Shows volunteer avatars and hours volunteered
- Handles add, view, and delete volunteer flows via modals

Localization:
- Uses `common` and `eventVolunteers` namespaces

## Returns

`Element`

JSX.Element
