[Admin Docs](/)

***

# Function: default()

> **default**(`props`): `JSX.Element`

Defined in: [src/components/UserPortal/PeopleCard/PeopleCard.tsx:47](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/UserPortal/PeopleCard/PeopleCard.tsx#L47)

PeopleCard component displays information about a person within an organization.

It includes:
- An image of the person or a default image if none is provided.
- The serial number of the person.
- The person's name.
- The person's email address.
- The person's role within the organization, styled with a border.

## Parameters

### props

`InterfaceOrganizationCardProps`

The properties passed to the component.

## Returns

`JSX.Element`

JSX.Element representing a card with the person's details.

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
- `.blueText`

For more details on the reusable classes, refer to the global CSS file.
