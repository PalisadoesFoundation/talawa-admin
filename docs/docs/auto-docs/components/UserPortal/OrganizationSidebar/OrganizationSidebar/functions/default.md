[**talawa-admin**](../../../../../README.md)

***

[talawa-admin](../../../../../README.md) / [components/UserPortal/OrganizationSidebar/OrganizationSidebar](../README.md) / default

# Function: default()

> **default**(): `JSX.Element`

Defined in: [src/components/UserPortal/OrganizationSidebar/OrganizationSidebar.tsx:36](https://github.com/gautam-divyanshu/talawa-admin/blob/cfee07d9592eee1569f258baf49181c393e48f1b/src/components/UserPortal/OrganizationSidebar/OrganizationSidebar.tsx#L36)

OrganizationSidebar displays the sidebar for an organization, showing a list of members and events.

This component fetches and displays:
- The top 3 members of the organization with their images and names.
- The top 3 upcoming events for the organization with their titles, start, and end dates.

It includes:
- A link to view all members.
- A link to view all events.

The sidebar handles loading states and displays appropriate messages while data is being fetched.

## Returns

`JSX.Element`

JSX.Element representing the organization sidebar.
