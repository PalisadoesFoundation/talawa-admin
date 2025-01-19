[Admin Docs](/)

***

# Function: default()

> **default**(`props`): `JSX.Element`

Defined in: [src/components/AddOn/core/AddOnEntry/AddOnEntry.tsx:63](https://github.com/syedali237/talawa-admin/blob/dd4a08e622d0fa38bcf9758a530e8cdf917dbac8/src/components/AddOn/core/AddOnEntry/AddOnEntry.tsx#L63)

A React component that represents an add-on entry, displaying its details and allowing installation or uninstallation.

## Parameters

### props

`InterfaceAddOnEntryProps`

The properties for the component.

## Returns

`JSX.Element`

A JSX element containing the add-on entry.

## Example

```tsx
<AddOnEntry
  id="1"
  enabled={true}
  title="Sample Add-On"
  description="This is a sample add-on."
  createdBy="Author Name"
  component="SampleComponent"
  modified={new Date()}
  uninstalledOrgs={['org1', 'org2']}
  getInstalledPlugins={() => {}}
/>
```
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
- `.removeButton`

For more details on the reusable classes, refer to the global CSS file.
