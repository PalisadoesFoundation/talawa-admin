[Admin Docs](/)

***

# Function: default()

> **default**(): `Element`

Defined in: [src/screens/UserPortal/Pledges/Pledges.tsx:70](https://github.com/syedali237/talawa-admin/blob/dd4a08e622d0fa38bcf9758a530e8cdf917dbac8/src/screens/UserPortal/Pledges/Pledges.tsx#L70)

The `Pledges` component is responsible for rendering a user's pledges within a campaign.
It fetches pledges data using Apollo Client's `useQuery` hook and displays the data
in a DataGrid with various features such as search, sorting, and modal dialogs for updating
or deleting a pledge. The component also handles various UI interactions including opening
modals for editing or deleting a pledge, showing additional pledgers in a popup, and
applying filters for searching pledges by campaign or pledger name.

Key functionalities include:
- Fetching pledges data from the backend using GraphQL query `USER_PLEDGES`.
- Displaying pledges in a table with columns for pledgers, associated campaigns,
  end dates, pledged amounts, and actions.
- Handling search and sorting of pledges.
- Opening and closing modals for updating and deleting pledges.
- Displaying additional pledgers in a popup when the list of pledgers exceeds a certain limit.

## Returns

`Element`

The rendered Pledges component.
