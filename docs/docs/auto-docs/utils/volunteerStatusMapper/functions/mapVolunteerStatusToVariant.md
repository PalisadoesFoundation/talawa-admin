[**talawa-admin**](../../../README.md)

***

# Function: mapVolunteerStatusToVariant()

> **mapVolunteerStatusToVariant**(`status`): `object`

Defined in: [src/utils/volunteerStatusMapper.ts:26](https://github.com/yb175/talawa-admin/blob/fce1167047be7ffe368e3ca73cbf38141b19703e/src/utils/volunteerStatusMapper.ts#L26)

Maps volunteer membership status to StatusBadge variant.

This function provides a single source of truth for status→variant mapping,
ensuring consistent visual representation across the application.

## Parameters

### status

`string`

The membership status string (e.g., 'requested', 'invited', 'accepted', 'rejected')

## Returns

`object`

Object containing the StatusBadge variant

### variant

> **variant**: [`StatusVariant`](../../../types/shared-components/StatusBadge/interface/type-aliases/StatusVariant.md)

## Example

```typescript
const badgeProps = mapVolunteerStatusToVariant('invited');
// Returns: { variant: 'pending' }
```
