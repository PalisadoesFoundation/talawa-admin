[Admin Docs](/)

***

# Function: default()

> **default**(`props`): `JSX.Element`

Defined in: [src/components/UserPortal/DonationCard/DonationCard.tsx:36](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/UserPortal/DonationCard/DonationCard.tsx#L36)

Displays a card with details about a donation.

Shows the donor's name, the amount donated, and the date of the donation.
Includes a button to view more details about the donation.

## Parameters

### props

[`InterfaceDonationCardProps`](../../../../../screens/UserPortal/Donate/Donate/interfaces/InterfaceDonationCardProps.md)

The properties passed to the component.

## Returns

`JSX.Element`

The rendered donation card component.

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
- `.addButton`

For more details on the reusable classes, refer to the global CSS file.
