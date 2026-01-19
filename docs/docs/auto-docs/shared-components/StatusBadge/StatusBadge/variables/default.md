[Admin Docs](/)

***

# Variable: default

> `const` **default**: `React.FC`\<[`InterfaceStatusBadgeProps`](../../../../types/shared-components/StatusBadge/interface/interfaces/InterfaceStatusBadgeProps.md)\>

Defined in: [src/shared-components/StatusBadge/StatusBadge.tsx:69](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/StatusBadge/StatusBadge.tsx#L69)

StatusBadge component for displaying status information with consistent styling.

This component wraps MUI Chip and provides:
- Domain-to-semantic variant mapping (e.g., 'completed' implies 'success')
- Three size variants: sm (20px), md (24px), lg (32px)
- Internationalization support with fallback keys (statusBadge.variant)
- Accessibility features (role="status", aria-label)
- Optional icon and label customization

## Param

Component properties

## Returns

A styled badge component with semantic coloring

## Example

```tsx
// Basic usage
<StatusBadge variant="completed" />

// With size and icon
<StatusBadge variant="pending" size="lg" icon={<WarningIcon />} />

// With custom label
<StatusBadge variant="approved" label="Verified" />
```
