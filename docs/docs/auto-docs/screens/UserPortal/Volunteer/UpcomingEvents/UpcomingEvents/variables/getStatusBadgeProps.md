[**talawa-admin**](../../../../../../README.md)

***

# ~~Variable: getStatusBadgeProps()~~

> `const` **getStatusBadgeProps**: (`status`) => `object` = `mapVolunteerStatusToVariant`

Defined in: [src/screens/UserPortal/Volunteer/UpcomingEvents/UpcomingEvents.tsx:39](https://github.com/BittuBarnwal7479/talawa-admin/blob/7329c220ecd98ce2ec3fc0b9fc39dd1a39bb1df4/src/screens/UserPortal/Volunteer/UpcomingEvents/UpcomingEvents.tsx#L39)

Maps membership status to StatusBadge variant.

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

### ~~variant~~

> **variant**: [`StatusVariant`](../../../../../../types/shared-components/StatusBadge/interface/type-aliases/StatusVariant.md)

## Example

```typescript
const badgeProps = mapVolunteerStatusToVariant('invited');
// Returns: { variant: 'pending' }
```

## Deprecated

Use mapVolunteerStatusToVariant from utils/volunteerStatusMapper instead.
This export is maintained for backward compatibility with existing tests.

## Param

The membership status string (e.g., 'requested', 'invited', 'accepted', 'rejected')

## Returns

Object containing the StatusBadge variant
