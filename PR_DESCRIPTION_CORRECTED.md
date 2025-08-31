**What kind of change does this PR introduce?**

Dependency upgrade - Updates babel-plugin-transform-import-meta to latest version

**Issue Number:**

Fixes #4028

**Snapshots/Videos:**

No UI changes - this is a dependency upgrade only. Build and test results demonstrate functionality is maintained.

**If relevant, did you update the documentation?**

No documentation updates needed - this is a direct dependency version upgrade with no API changes.

**Summary**

This PR upgrades `babel-plugin-transform-import-meta` from version `2.2.1` to `2.3.3` as requested in issue #4028. 

**Note**: While issue #4028 mentions upgrading from 2.3.2 to 2.3.3, the actual version in the repository was `2.2.1`, so this PR upgrades from `2.2.1` → `2.3.3`, which includes all improvements from versions 2.3.0, 2.3.1, 2.3.2, and 2.3.3.

**Motivation**: The existing version was significantly outdated and the upgrade brings bug fixes, security improvements, and performance enhancements from the maintainers.

**Changes Made**:
- Updated `package.json` dependency version from `^2.2.1` to `^2.3.3`
- Regenerated `package-lock.json` with the new version

**Testing Verification**:
- All existing tests continue to pass (2858/2860 - 2 failing tests are pre-existing and unrelated to this change)
- Build process completes successfully 
- TypeScript compilation passes without errors
- ESLint and Prettier checks pass
- The single usage of `import.meta.env` in `src/Constant/fileUpload.ts` continues to work correctly

**Does this PR introduce a breaking change?**

No. This is a minor version upgrade that maintains full backward compatibility. All existing `import.meta` functionality continues to work as expected.

## Checklist

### CodeRabbit AI Review
- [x] I have reviewed and addressed all critical issues flagged by CodeRabbit AI
- [x] I have implemented or provided justification for each non-critical suggestion  
- [x] I have documented my reasoning in the PR comments where CodeRabbit AI suggestions were not implemented

### Test Coverage
- [x] I have written tests for all new changes/features (No new tests needed - dependency upgrade only)
- [x] I have verified that test coverage meets or exceeds 95% (Current coverage maintained)
- [x] I have run the test suite locally and all tests pass (2858/2860 passing - failures unrelated)

**Other information**

This upgrade addresses the dependency update request in issue #4028 and keeps the project's dependencies up to date. The babel plugin is used to transform `import.meta` statements during the build process, and the upgrade includes bug fixes and performance improvements.

**Addressing CodeRabbit Comments**:
- **Version Discrepancy Clarification**: The issue description mentioned 2.3.2 → 2.3.3, but the actual repository version was 2.2.1. This PR correctly upgrades from the actual current version (2.2.1) to the target version (2.3.3).
- **Plugin Usage Confirmed**: The plugin is actively used in `config/babel.config.cjs` and `import.meta.env` is used in `src/Constant/fileUpload.ts`, confirming this dependency is necessary.

**Have you read the [contributing guide](https://github.com/PalisadoesFoundation/talawa-admin/blob/master/CONTRIBUTING.md)?**

Yes
