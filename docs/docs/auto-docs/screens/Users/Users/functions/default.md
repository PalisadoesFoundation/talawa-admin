[Admin Docs](/)

***

# Function: default()

> **default**(): `Element`

Defined in: [src/screens/Users/Users.tsx:83](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/Users/Users.tsx#L83)

The `Users` component is responsible for displaying a list of users in a paginated and sortable format.
It supports search functionality, filtering, and sorting of users. The component integrates with GraphQL
for fetching and managing user data and displays results with infinite scrolling.

## Features:
- **Search:** Allows users to search for users by their first name.
- **Sorting:** Provides options to sort users by creation date (newest or oldest).
- **Filtering:** Enables filtering users based on their roles (admin, superadmin, user, etc.).
- **Pagination:** Utilizes infinite scrolling to load more users as the user scrolls down.

## GraphQL Queries:
- `USER_LIST`: Fetches a list of users with specified search, sorting, and pagination parameters.
- `ORGANIZATION_CONNECTION_LIST`: Fetches a list of organizations to verify organization existence.

## Component State:
- `isLoading`: Indicates whether the component is currently loading data.
- `hasMore`: Indicates if there are more users to load.
- `isLoadingMore`: Indicates if more users are currently being loaded.
- `searchByName`: The current search query for user names.
- `sortingOption`: The current sorting option (newest or oldest).
- `filteringOption`: The current filtering option (admin, superadmin, user, cancel).
- `displayedUsers`: The list of users currently displayed, filtered and sorted.

## Event Handlers:
- `handleSearch`: Handles searching users by name and refetches the user list.
- `handleSearchByEnter`: Handles search input when the Enter key is pressed.
- `handleSearchByBtnClick`: Handles search input when the search button is clicked.
- `resetAndRefetch`: Resets search and refetches the user list with default parameters.
- `loadMoreUsers`: Loads more users when scrolling reaches the end of the list.
- `handleSorting`: Updates sorting option and refetches the user list.
- `handleFiltering`: Updates filtering option and refetches the user list.

## Rendering:
- Displays a search input and button for searching users.
- Provides dropdowns for sorting and filtering users.
- Renders a table of users with infinite scrolling support.
- Shows appropriate messages when no users are found or when search yields no results.

## Returns

`Element`

The rendered `Users` component.

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
- `.btnsContainer`
- `.input`
- `.inputField`
- `.searchButton`

For more details on the reusable classes, refer to the global CSS file.
