[Admin Docs](/)

***

# Function: default()

> **default**(): `Element`

Defined in: [src/screens/UserPortal/Pledges/Pledges.tsx:89](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/UserPortal/Pledges/Pledges.tsx#L89)

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

## CSS Strategy Explanation:

To ensure consistency across the application and reduce duplication, common styles
(such as button styles) have been moved to the global CSS file. Instead of using
component-specific classes (e.g., `.greenregbtnOrganizationFundCampaign`, `.greenregbtnPledge`), a single reusable
class (e.g., .addButton) is now applied.

### Benefits:
- **Reduces redundant CSS code.
- **Improves maintainability by centralizing common styles.
- **Ensures consistent styling across components.

### Global CSS Classes used:
- `.editButton`
- `.searchButton`
- `.btnsBlock`

For more details on the reusable classes, refer to the global CSS file.
