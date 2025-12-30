[Admin Docs](/)

***

# Variable: OrgSelector

> `const` **OrgSelector**: `React.FC`\<[`InterfaceOrgSelectorProps`](../../../../../types/Auth/OrgSelector/interface/interfaces/InterfaceOrgSelectorProps.md)\>

Defined in: [src/components/Auth/OrgSelector/OrgSelector.tsx:25](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/Auth/OrgSelector/OrgSelector.tsx#L25)

Reusable organization selector component with validation and accessibility support.

## Remarks

This component provides a dropdown for selecting an organization from a list.
It supports error display, required field indication, and proper ARIA attributes
for accessibility.

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
