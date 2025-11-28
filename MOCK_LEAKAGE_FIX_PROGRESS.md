# Mock Leakage Fix Progress - Issue #4671

## Objective
Fix mock leakage in all test files within `src/components/` by moving module-level mocks into `beforeEach` hooks.

## Pattern Applied

### ❌ Bad: Module-level mock (leaks between tests)
```typescript
const mockFunction = vi.fn();

describe('Component', () => {
  it('test 1', () => { /* uses mockFunction */ });
  it('test 2', () => { /* mockFunction still has test 1 calls! */ });
});
```

### ✅ Good: Fresh mock per test
```typescript
describe('Component', () => {
  let mockFunction: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockFunction = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('test 1', () => { /* uses fresh mock */ });
  it('test 2', () => { /* uses fresh mock */ });
});
```

## Files Fixed ✅

1. **src/components/ProfileDropdown/ProfileDropdown.spec.tsx**
   - Fixed: `mockNavigate` moved from module-level to `beforeEach`
   - Added: `vi.restoreAllMocks()` in `afterEach`
   - Removed: Duplicate `afterEach` block
   - Status: ✅ All 8 tests passing

2. **src/components/EditCustomFieldDropDown/EditCustomFieldDropDown.spec.tsx**
   - Fixed: `mockSetCustomFieldData` and `defaultProps` moved to `beforeEach`
   - Added: `vi.restoreAllMocks()` in `afterEach`
   - Status: ✅ All 6 tests passing

## Files Identified with Module-Level Mocks (Remaining)

Based on grep search, the following files contain module-level `vi.fn()` calls:

### High Priority (Files with clear module-level mocks)
3. `src/components/UserPortal/ChatRoom/ChatRoom.spec.tsx`
4. `src/components/Advertisements/Advertisements.spec.tsx`
5. `src/components/GroupChatDetails/GroupChatDetails.spec.tsx`
6. `src/components/EventCalender/Header/EventHeader.spec.tsx`
7. `src/components/EventListCard/EventListCard.spec.tsx`
8. `src/components/EventListCard/Modal/Delete/EventListCardDeleteModal.spec.tsx`
9. `src/components/OrgAdminListCard/OrgAdminListCard.spec.tsx`

### Additional Files to Review
- All other files in `src/components/**/*.spec.tsx` directory

## Next Steps

1. Continue fixing files systematically
2. Run tests after each fix to ensure no regressions
3. Focus on files with multiple module-level mocks first
4. Submit PR once all files are fixed

## Success Criteria

- ✅ No module-level mock declarations in `src/components/**`
- ✅ All mocks initialized in `beforeEach` hooks
- ✅ All tests have `vi.restoreAllMocks()` in `afterEach`
- ✅ 100% test pass rate maintained

## Progress: 2/~30+ files (ongoing identification)
