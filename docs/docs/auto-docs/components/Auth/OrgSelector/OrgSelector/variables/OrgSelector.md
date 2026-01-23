[**talawa-admin**](../../../../../README.md)

***

# Variable: OrgSelector

> `const` **OrgSelector**: `React.FC`\<[`InterfaceOrgSelectorProps`](../../../../../types/Auth/OrgSelector/interface/interfaces/InterfaceOrgSelectorProps.md)\>

Defined in: [src/components/Auth/OrgSelector/OrgSelector.tsx:26](https://github.com/VanshikaSabharwal/talawa-admin/blob/b013ea08c548e04dfa8e27b7d9e9418af9419ded/src/components/Auth/OrgSelector/OrgSelector.tsx#L26)

Reusable organization selector component with search/autocomplete and accessibility support.

## Remarks

This component provides a searchable dropdown for selecting an organization from a list.
It supports search/autocomplete, error display, required field indication, and proper
ARIA attributes for accessibility.

## Example

```tsx
<OrgSelector
  options={organizations}
  value={selectedOrgId}
  onChange={handleOrgChange}
  error={orgError}
  required
/>
```
