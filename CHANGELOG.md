# Changelog

## [3.0.0] - 2026-01-30

### 💥 BREAKING CHANGES

#### i18n Translation Keys Migrated to camelCase

All translation keys have been standardized to camelCase format.

**Migration Required:**

| Old Key | New Key |
|---------|---------|
| "My Organizations" | "myOrganizations" |
| "Dashboard" | "dashboard" |
| "Block/Unblock" | "blockUnblock" |
| "Membership Requests" | "membershipRequests" |
| "Action Items" | "actionItems" |
| "Latest" | "latest" |
| "Oldest" | "oldest" |

**Impact:**
- All code using translation keys must update to camelCase
- Affects: Components, tests, external consumers

**Migration Steps:**
1. Find all usages: `rg -i "t\(['\"]My Organizations"`
2. Replace with camelCase: `t('myOrganizations')`
3. Run tests: `pnpm test`
4. Verify i18n: `pnpm run check-i18n`
