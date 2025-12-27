[**talawa-admin**](README.md)

***

# OrgContribution

OrgContribution Component

This component renders the "Organization Contribution" page, which includes:
- A sidebar for filtering contributions by organization name and transaction ID.
- A section displaying recent contribution statistics.
- A main content area displaying a list of contribution cards.

Features:
- Utilizes the `react-i18next` library for internationalization and localization.
- Dynamically sets the document title based on the translated page title.
- Includes reusable components such as `ContriStats` and `OrgContriCards`.

## Component

## Remarks

- The sidebar includes input fields for filtering contributions and displays recent statistics.
- The main content area lists contribution details such as user name, date, amount, transaction ID, and email.

## Dependencies

- `react-bootstrap` for layout and form controls.
- `react-i18next` for translation and localization.
- `ContriStats` and `OrgContriCards` for displaying contribution-related data.

## Example

```ts
// Example usage of OrgContribution component
import OrgContribution from './OrgContribution';

function App() {
  return <OrgContribution />;
}
```

## File

OrgContribution.tsx

## Functions

- [default](OrgContribution\README\functions\default.md)
