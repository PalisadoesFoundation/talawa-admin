[Admin Docs](/)

***

# Function: default()

> **default**(): `Element`

Defined in: [src/screens/UserPortal/Volunteer/Invitations/Invitations.tsx:49](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/UserPortal/Volunteer/Invitations/Invitations.tsx#L49)

The `Invitations` component displays list of invites for the user to volunteer.
It allows the user to search, sort, and accept/reject invites.

## Returns

`Element`

The rendered component displaying the upcoming events.

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
- `.searchButton`

For more details on the reusable classes, refer to the global CSS file.
