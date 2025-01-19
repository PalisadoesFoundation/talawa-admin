[Admin Docs](/)

***

# Function: default()

> **default**(): `JSX.Element`

Defined in: [src/screens/OrganizationEvents/OrganizationEvents.tsx:75](https://github.com/syedali237/talawa-admin/blob/dd4a08e622d0fa38bcf9758a530e8cdf917dbac8/src/screens/OrganizationEvents/OrganizationEvents.tsx#L75)

Organization Events Page Component to display the events of an organization
and create new events for the organization by the admin or superadmin user.
The component uses the EventCalendar component to display the events and EventHeader component
 to display the view type and create event button.
 The component uses the RecurrenceOptions component to display the recurrence options for the event.
 The component uses the CREATE_EVENT_MUTATION mutation to create a new event for the organization.
 The component uses the ORGANIZATION_EVENT_CONNECTION_LIST and ORGANIZATIONS_LIST queries to fetch the events
 and organization details.
 The component uses the useLocalStorage hook to get the user details from the local storage.

## Returns

`JSX.Element`

JSX.Element to display the Organization Events Page

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
- `.inputField`
- `.switch`
- `.addButton`

For more details on the reusable classes, refer to the global CSS file.
