**What kind of change does this PR introduce?**

Feature - Implements row selection, per-row action buttons, and bulk actions for the DataTable component (TableFix Phase 3).

**Issue Number:**

Fixes #5810

**Snapshots/Videos:**

N/A - All changes are testable via the existing test suite.

**If relevant, did you update the documentation?**

Yes - Updated `docs/docs/docs/developer-resources/tables.md` with correct import paths for `IRowAction` and `IBulkAction` types.

**Summary**

This PR implements Phase 3 of the TableFix initiative, adding standardized support for row actions and bulk operations to the DataTable component:

**New Features:**
- **Row Selection** - Checkbox column with controlled (`selectedKeys`/`onSelectionChange`) and uncontrolled (`initialSelectedKeys`) state support
- **Select-All Header Checkbox** - Tri-state checkbox (checked/unchecked/indeterminate) that selects/deselects all rows on current page
- **Per-Row Actions** - `ActionsCell` component renders action buttons per row with disabled state support (boolean or function)
- **Bulk Actions Toolbar** - `BulkActionsBar` component appears when rows are selected, showing selected count and bulk action buttons
- **Confirmation Dialog** - Optional `confirm` property on bulk actions shows confirmation before executing

**New Files Created:**
- `src/shared-components/DataTable/cells/ActionsCell.tsx` - Per-row action buttons
- `src/shared-components/DataTable/cells/ActionsCell.spec.tsx` - Tests for ActionsCell (8 tests)
- `src/shared-components/DataTable/BulkActionsBar.tsx` - Bulk actions toolbar

**Modified Files:**
- `src/types/shared-components/DataTable/interface.ts` - Added `Key`, `IRowAction`, `IBulkAction` types and selection props
- `src/shared-components/DataTable/DataTable.tsx` - Integrated selection state, checkboxes, and action components
- `src/shared-components/DataTable/DataTable.module.css` - Added styles for selection/actions columns and bulk bar
- `src/shared-components/DataTable/DataTable.spec.tsx` - Added 8 selection/action tests
- `docs/docs/docs/developer-resources/tables.md` - Updated import paths

**Does this PR introduce a breaking change?**

No. All new features are opt-in via new props (`selectable`, `rowActions`, `bulkActions`). Existing DataTable usage remains unchanged.

## Checklist

### CodeRabbit AI Review
- [x] I have reviewed and addressed all critical issues flagged by CodeRabbit AI
- [x] I have implemented or provided justification for each non-critical suggestion
- [x] I have documented my reasoning in the PR comments where CodeRabbit AI suggestions were not implemented

### Test Coverage
- [x] I have written tests for all new changes/features
- [x] I have verified that test coverage meets or exceeds 95%
- [x] I have run the test suite locally and all tests pass

**Other information**

This PR is part of the TableFix initiative:
- **Blocked by:** #5810 (prerequisite phases)
- **Related:** #5807

**Have you read the [contributing guide](https://github.com/PalisadoesFoundation/talawa-admin/blob/master/CONTRIBUTING.md)?**

Yes
