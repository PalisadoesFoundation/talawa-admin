[**talawa-admin**](../../../../../../README.md)

***

[talawa-admin](../../../../../../README.md) / [components/AddOn/core/AddOnEntry/AddOnEntry](../README.md) / default

# Function: default()

> **default**(`props`): `JSX.Element`

Defined in: [src/components/AddOn/core/AddOnEntry/AddOnEntry.tsx:46](https://github.com/bint-Eve/talawa-admin/blob/3ea1bc8148fd1f2efa92a17958ea5a5df0d9cc86/src/components/AddOn/core/AddOnEntry/AddOnEntry.tsx#L46)

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
