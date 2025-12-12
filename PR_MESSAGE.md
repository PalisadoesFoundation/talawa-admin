Refactor: Refactor The People Screens to Reusable Components

**What kind of change does this PR introduce?**

Refactoring, Bug fix

**Issue Number:**

Fixes #4998

**Snapshots/Videos:**

N/A

**If relevant, did you update the documentation?**

No

**Summary**

This PR introduces a new reusable component `PeopleTable` to handle the display of people lists using `MUI DataGrid`. This component is now used in both `UserPortal/People` and `OrganizationPeople` screens, reducing code duplication and ensuring consistency.

Additionally, this PR fixes pagination issues found in the `People` screen and updates the corresponding tests. It also resolves several ESLint and TypeScript errors that were present.

**Does this PR introduce a breaking change?**

No

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

None

**Have you read the [contributing guide](https://github.com/PalisadoesFoundation/talawa-admin/blob/master/CONTRIBUTING.md)?**

Yes
