[Admin Docs](/)

***

# Function: default()

> **default**(`props`): `JSX.Element`

Defined in: [src/components/AddOn/core/AddOnEntry/AddOnEntry.tsx:46](https://github.com/gautam-divyanshu/talawa-admin/blob/10f2081e01fc4f6c0767e35f8c4ed3f09fb1baac/src/components/AddOn/core/AddOnEntry/AddOnEntry.tsx#L46)

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
