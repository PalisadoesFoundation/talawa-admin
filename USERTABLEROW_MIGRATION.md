# UserTableRow Migration Documentation

## Overview
This document outlines the migration of admin screens to use the consolidated `UserTableRow` component, reducing code duplication and improving maintainability.

## Migration Checklist

### ✅ Completed Migrations

#### 1. BlockUser Screen
- **Status**: ✅ Complete
- **Location**: `src/screens/BlockUser/BlockUser.tsx`
- **Changes Made**:
  - Replaced individual table cells with `UserTableRow` component
  - Reduced table structure from 4 columns to 2 columns
  - Fixed TypeScript type conversion issues (`String(user.id)`)
  - Updated function signatures for block/unblock handlers
  - All 26 tests passing
- **Key Fixes**:
  - Added `String(user.id)` conversion for GraphQL mutation parameters
  - Corrected `handleBlockUser`/`handleUnBlockUser` to expect user objects
  - Updated test assertions for new 2-column structure

#### 2. OrganizationPeople Screen (Users)
- **Status**: ✅ Complete (Pre-existing)
- **Location**: `src/screens/OrganizationPeople/OrganizationPeople.tsx`
- **Implementation**:
  - Already using `UserTableRow` component with ReportingTable
  - Supports multiple user types (members, administrators, users)
  - Includes pagination, search, and filtering
  - All 15 tests passing

## Migration Pattern

### Before Migration
```tsx
// Individual table cells
<Table>
  <tbody>
    {users.map((user) => (
      <tr key={user.id}>
        <td>{user.name}</td>
        <td>{user.email}</td>
        <td>{user.createdAt}</td>
        <td>
          <Button onClick={() => handleAction(user.id)}>
            Action
          </Button>
        </td>
      </tr>
    ))}
  </tbody>
</Table>
```

### After Migration
```tsx
// Using UserTableRow component
<Table>
  <tbody>
    {users.map((user, index) => (
      <UserTableRow
        key={user.id}
        user={{
          id: user.id,
          name: user.name,
          emailAddress: user.email,
          avatarURL: user.image,
          createdAt: user.createdAt,
        }}
        rowNumber={index + 1}
        isDataGrid={false}
        showJoinedDate={true}
        actions={[
          {
            label: t('action'),
            onClick: () => handleAction(user),
            variant: 'primary',
            icon: <ActionIcon />,
            testId: `action${user.id}`,
          },
        ]}
        testIdPrefix="screen-name"
      />
    ))}
  </tbody>
</Table>
```

## Key Benefits

1. **Code Consolidation**: Reduced duplicate table rendering logic
2. **Consistent UI**: Standardized user display across admin screens
3. **Type Safety**: Improved TypeScript type checking
4. **Maintainability**: Single component to update for user display changes
5. **Testing**: Centralized testing for user row functionality

## Common Migration Issues & Solutions

### TypeScript Type Mismatches
**Issue**: GraphQL mutations expect string IDs but receive numbers
```tsx
// ❌ Before
blockUser({ variables: { userId: user.id } })

// ✅ After  
blockUser({ variables: { userId: String(user.id) } })
```

### Function Signature Changes
**Issue**: Action handlers expect different parameter types
```tsx
// ❌ Before
const handleAction = (userId: string) => { ... }

// ✅ After
const handleAction = (user: InterfaceUserInfo) => { ... }
```

### Test Updates
**Issue**: Tests expect old table structure
```tsx
// ❌ Before
expect(screen.getAllByRole('columnheader')).toHaveLength(4);

// ✅ After
expect(screen.getAllByRole('columnheader')).toHaveLength(2);
```

## UserTableRow Component Interface

```tsx
interface UserTableRowProps {
  user: InterfaceUserInfo;
  rowNumber: number;
  isDataGrid: boolean;
  showJoinedDate: boolean;
  onRowClick?: (user: InterfaceUserInfo) => void;
  actions: Array<{
    label: string;
    onClick: () => void;
    variant: 'primary' | 'secondary' | 'success' | 'danger';
    icon: React.ReactNode;
    disabled?: boolean;
    testId: string;
    ariaLabel?: string;
  }>;
  testIdPrefix: string;
}
```

## Testing Strategy

1. **Component Integration**: Verify UserTableRow renders correctly
2. **Action Functionality**: Test all action buttons work as expected
3. **Type Safety**: Ensure proper TypeScript type handling
4. **Accessibility**: Validate ARIA labels and keyboard navigation
5. **Responsive Design**: Test table behavior on different screen sizes

## Future Considerations

- Consider extending UserTableRow for additional user management screens
- Evaluate performance impact with large user datasets
- Monitor for accessibility improvements needed
- Plan for internationalization of action labels

## Migration Success Metrics

- ✅ All existing tests pass
- ✅ No TypeScript compilation errors
- ✅ Consistent user experience across screens
- ✅ Reduced code duplication
- ✅ Maintained functionality parity

---

**Migration Completed**: December 31, 2025  
**Total Screens Migrated**: 2 (BlockUser, OrganizationPeople)  
**Tests Passing**: 41/41 (26 BlockUser + 15 OrganizationPeople)
