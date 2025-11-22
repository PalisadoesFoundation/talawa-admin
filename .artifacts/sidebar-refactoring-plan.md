# Sidebar Refactoring Implementation Plan

## Problem Statement
The Admin Portal and User Portal have duplicate sidebar code across 4 components:
- `LeftDrawer` (Admin Portal - Global)
- `LeftDrawerOrg` (Admin Portal - Organization)
- `UserSidebar` (User Portal - Global)
- `UserSidebarOrg` (User Portal - Organization)

This creates:
1. ~65% code duplication
2. Maintenance difficulties
3. UI/UX inconsistencies
4. Broken profile links

## Figma Design Reference
- [Talawa UI Design File](https://www.figma.com/design/zkit2XQ9GiDAwVK1b8aarE/Talawa-UI-Design-File?node-id=0-1&t=UMPd7ol78tfFzHBQ-1)

## Refactoring Strategy

### Phase 1: Create Shared Components

#### 1.1 Create `SidebarBase` Component
**Location**: `/src/components/Sidebar/SidebarBase/SidebarBase.tsx`

**Purpose**: Core sidebar container with common functionality

**Props**:
```typescript
interface ISidebarBaseProps {
  hideDrawer: boolean;
  setHideDrawer: React.Dispatch<React.SetStateAction<boolean>>;
  portalType: 'admin' | 'user';
  children: React.ReactNode;
  headerContent?: React.ReactNode;
  footerContent?: React.ReactNode;
  backgroundColor?: string;
}
```

**Features**:
- Toggle functionality
- Hamburger menu
- Talawa logo and branding
- Responsive behavior (mobile/desktop)
- Consistent styling

#### 1.2 Create `SidebarNavItem` Component
**Location**: `/src/components/Sidebar/SidebarNavItem/SidebarNavItem.tsx`

**Purpose**: Reusable navigation item with icon

**Props**:
```typescript
interface ISidebarNavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  testId: string;
  hideDrawer: boolean;
  onClick?: () => void;
}
```

**Features**:
- Active/inactive states
- Icon styling
- Label visibility based on drawer state
- Accessibility

#### 1.3 Create `SidebarOrgSection` Component
**Location**: `/src/components/Sidebar/SidebarOrgSection/SidebarOrgSection.tsx`

**Purpose**: Organization profile section for org-scoped sidebars

**Props**:
```typescript
interface ISidebarOrgSectionProps {
  orgId: string;
  hideDrawer: boolean;
}
```

**Features**:
- Organization avatar
- Organization name and city
- Loading and error states
- Navigation to organization

#### 1.4 Create `SidebarPluginSection` Component
**Location**: `/src/components/Sidebar/SidebarPluginSection/SidebarPluginSection.tsx`

**Purpose**: Plugin items section

**Props**:
```typescript
interface ISidebarPluginSectionProps {
  pluginItems: IDrawerExtension[];
  hideDrawer: boolean;
  orgId?: string;
  onItemClick?: () => void;
}
```

### Phase 2: Refactor Existing Components

#### 2.1 Refactor `LeftDrawer`
Use `SidebarBase` with:
- Admin portal type
- Navigation items: Organizations, Plugin Store, Users (superAdmin only), Community Profile, Notification
- Plugin section (global/settings)
- ProfileCard in footer
- SignOut button

#### 2.2 Refactor `LeftDrawerOrg`
Use `SidebarBase` with:
- Admin portal type
- Organization section
- Dynamic navigation items from `targets` prop
- Plugin section (org-specific)
- ProfileCard in footer
- SignOut button

#### 2.3 Refactor `UserSidebar`
Use `SidebarBase` with:
- User portal type
- Navigation items: My Organizations, Notifications, Settings
- Plugin section (global user)
- ProfileCard in footer
- SignOut button
- User-specific styling (#f0f7fb background)

#### 2.4 Refactor `UserSidebarOrg`
Use `SidebarBase` with:
- User portal type
- Dynamic navigation items from `targets` prop
- Plugin section (org-specific user)
- ProfileCard in footer
- SignOut button
- User-specific styling

### Phase 3: Fix Profile Links

#### 3.1 Update ProfileCard Component
**Issues to fix**:
1. Navigation logic based on role
2. Proper orgId handling
3. Consistent routing

**Changes**:
```typescript
// Current problematic code:
userRole === 'User'
  ? navigate(`/user/settings`)
  : navigate(`/member/${orgId || ''}`)

// Fixed code:
const handleProfileClick = () => {
  if (portalType === 'user') {
    navigate('/user/settings');
  } else if (portalType === 'admin' && orgId) {
    navigate(`/member/${orgId}`);
  } else {
    // Fallback to user settings or profile page
    navigate('/user/settings');
  }
};
```

#### 3.2 Add ProfileCard Props
```typescript
interface IProfileCardProps {
  portalType?: 'admin' | 'user';
  orgId?: string;
}
```

### Phase 4: Update Tests

#### 4.1 Create Shared Component Tests
- `SidebarBase.spec.tsx` - 100% coverage
- `SidebarNavItem.spec.tsx` - 100% coverage
- `SidebarOrgSection.spec.tsx` - 100% coverage
- `SidebarPluginSection.spec.tsx` - 100% coverage

#### 4.2 Update Existing Component Tests
- Update `LeftDrawer.spec.tsx` - ensure 100% coverage
- Update `LeftDrawerOrg.spec.tsx` - ensure 100% coverage
- Update `UserSidebar.spec.tsx` - ensure 100% coverage
- Update `UserSidebarOrg.spec.tsx` - ensure 100% coverage
- Update `ProfileCard.spec.tsx` - test profile link fixes

**Test Coverage Requirements**:
- All user interactions (clicks, keyboard navigation)
- Mobile/desktop responsive behavior
- Plugin system integration
- Profile link navigation
- Loading and error states
- Accessibility

### Phase 5: CSS Consolidation

#### 5.1 Review and Consolidate Styles
From `app-fixed.module.css`:
- `.leftDrawer` - sidebar container
- `.collapsedDrawer` / `.expandedDrawer` - drawer states
- `.sidebarBtn` / `.sidebarBtnActive` - navigation buttons
- `.leftDrawerActiveButton` / `.leftDrawerInactiveButton` - org drawer buttons
- `.iconWrapper` - icon container
- `.profileContainer` - profile section
- `.userSidebarOrgFooter` - footer section
- `.organizationContainer` - org section

**Actions**:
1. Ensure consistent naming
2. Remove duplicates
3. Use CSS variables for theming
4. Maintain existing styling while consolidating

### Phase 6: Documentation

#### 6.1 Component Documentation
- Add comprehensive JSDoc comments
- Document all props and their purposes
- Add usage examples
- Document accessibility features

#### 6.2 Migration Guide
- Document changes for developers
- Add before/after examples
- Update relevant documentation

## Implementation Steps

### Step 1: Create Shared Components
1. Create `SidebarBase` component
2. Create `SidebarNavItem` component
3. Create `SidebarOrgSection` component
4. Create `SidebarPluginSection` component
5. Write comprehensive tests for each (100% coverage)

### Step 2: Refactor Admin Portal Sidebars
1. Refactor `LeftDrawer` to use shared components
2. Update `LeftDrawer.spec.tsx` tests
3. Refactor `LeftDrawerOrg` to use shared components
4. Update `LeftDrawerOrg.spec.tsx` tests
5. Verify all tests pass

### Step 3: Refactor User Portal Sidebars
1. Refactor `UserSidebar` to use shared components
2. Update `UserSidebar.spec.tsx` tests
3. Refactor `UserSidebarOrg` to use shared components
4. Update `UserSidebarOrg.spec.tsx` tests
5. Verify all tests pass

### Step 4: Fix Profile Links
1. Update `ProfileCard` component with portalType and orgId props
2. Fix navigation logic
3. Update `ProfileCard.spec.tsx` tests
4. Add new tests for profile link scenarios
5. Verify all profile navigation works correctly

### Step 5: Final Testing & Validation
1. Run all unit tests
2. Run integration tests
3. Manual testing in browser
4. Accessibility testing
5. Mobile/desktop responsive testing
6. Cross-browser testing

## Success Criteria

1. ✅ All 4 sidebar components use shared base components
2. ✅ Code duplication reduced by at least 60%
3. ✅ All existing features maintained
4. ✅ Profile links work correctly in all scenarios
5. ✅ 100% test coverage for all new and modified components
6. ✅ All existing tests pass
7. ✅ UI/UX matches Figma design
8. ✅ Responsive behavior works on mobile and desktop
9. ✅ Accessibility standards met
10. ✅ Documentation updated

## File Structure

```
src/
├── components/
│   ├── Sidebar/
│   │   ├── SidebarBase/
│   │   │   ├── SidebarBase.tsx
│   │   │   ├── SidebarBase.spec.tsx
│   │   │   └── SidebarBase.module.css (if needed)
│   │   ├── SidebarNavItem/
│   │   │   ├── SidebarNavItem.tsx
│   │   │   ├── SidebarNavItem.spec.tsx
│   │   │   └── SidebarNavItem.module.css (if needed)
│   │   ├── SidebarOrgSection/
│   │   │   ├── SidebarOrgSection.tsx
│   │   │   ├── SidebarOrgSection.spec.tsx
│   │   │   └── SidebarOrgSection.module.css (if needed)
│   │   └── SidebarPluginSection/
│   │       ├── SidebarPluginSection.tsx
│   │       ├── SidebarPluginSection.spec.tsx
│   │       └── SidebarPluginSection.module.css (if needed)
│   ├── LeftDrawer/
│   │   ├── LeftDrawer.tsx (refactored)
│   │   └── LeftDrawer.spec.tsx (updated)
│   ├── LeftDrawerOrg/
│   │   ├── LeftDrawerOrg.tsx (refactored)
│   │   └── LeftDrawerOrg.spec.tsx (updated)
│   ├── UserPortal/
│   │   ├── UserSidebar/
│   │   │   ├── UserSidebar.tsx (refactored)
│   │   │   └── UserSidebar.spec.tsx (updated)
│   │   └── UserSidebarOrg/
│   │       ├── UserSidebarOrg.tsx (refactored)
│   │       └── UserSidebarOrg.spec.tsx (updated)
│   └── ProfileCard/
│       ├── ProfileCard.tsx (updated)
│       └── ProfileCard.spec.tsx (updated)
└── style/
    └── app-fixed.module.css (consolidated)
```

## Timeline Estimate

- **Phase 1** (Shared Components): 2-3 days
- **Phase 2** (Admin Portal Refactor): 1-2 days
- **Phase 3** (User Portal Refactor): 1-2 days
- **Phase 4** (Profile Link Fix): 1 day
- **Phase 5** (CSS Consolidation): 0.5 day
- **Phase 6** (Testing & Documentation): 1-2 days

**Total**: ~7-11 days

## Risks & Mitigation

### Risk 1: Breaking existing functionality
**Mitigation**: 
- Incremental refactoring
- Comprehensive test coverage
- Manual testing at each step

### Risk 2: Plugin system compatibility
**Mitigation**:
- Preserve all plugin hooks
- Test with mock plugins
- Review plugin documentation

### Risk 3: Styling inconsistencies
**Mitigation**:
- Reference Figma designs
- Side-by-side comparison testing
- CSS variable usage for consistency

## Notes

- Follow existing code style guidelines in `CODE_STYLE.md`
- Use TypeScript strict mode
- Ensure all components are properly typed
- Maintain accessibility standards (ARIA labels, keyboard navigation)
- Follow React best practices (hooks, memoization)
