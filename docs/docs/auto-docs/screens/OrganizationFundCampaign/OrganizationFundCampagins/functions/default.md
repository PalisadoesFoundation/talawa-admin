[Admin Docs](/)

***

# Function: default()

> **default**(): `Element`

Defined in: [src/screens/OrganizationFundCampaign/OrganizationFundCampagins.tsx:102](https://github.com/syedali237/talawa-admin/blob/dd4a08e622d0fa38bcf9758a530e8cdf917dbac8/src/screens/OrganizationFundCampaign/OrganizationFundCampagins.tsx#L102)

`orgFundCampaign` component displays a list of fundraising campaigns for a specific fund within an organization.
It allows users to search, sort, view and edit campaigns.

### Functionality
- Displays a data grid with campaigns information, including their names, start and end dates, funding goals, and actions.
- Provides search functionality to filter campaigns by name.
- Offers sorting options based on funding goal and end date.
- Opens modals for creating or editing campaigns.

### State
- `campaign`: The current campaign being edited or deleted.
- `searchTerm`: The term used for searching campaigns by name.
- `sortBy`: The current sorting criteria for campaigns.
- `modalState`: An object indicating the visibility of different modals (`same` for create/edit).
- `campaignModalMode`: Determines if the modal is in 'edit' or 'create' mode.

### Methods
- `handleOpenModal(campaign: InterfaceCampaignInfo | null, mode: 'edit' | 'create')`: Opens the modal for creating or editing a campaign.
- `handleClick(campaignId: string)`: Navigates to the pledge details page for a specific campaign.

### GraphQL Queries
- Uses `FUND_CAMPAIGN` query to fetch the list of campaigns based on the provided fund ID, search term, and sorting criteria.

### Rendering
- Renders a `DataGrid` component with campaigns information.
- Displays modals for creating and editing campaigns.
- Shows error and loading states using `Loader` and error message components.

## Returns

`Element`

The rendered component including breadcrumbs, search and filter controls, data grid, and modals.

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
- `.head`
- `.btnsContainer`
- `.input`
- `.inputField`
- `.searchButon`
- `.btnsBlock`
- `.dropdown`

For more details on the reusable classes, refer to the global CSS file.
