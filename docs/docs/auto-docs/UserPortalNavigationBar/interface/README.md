[**talawa-admin**](../../README.md)

***

# UserPortalNavigationBar/interface

## File

Interface definitions for UserPortalNavigationBar component

## Description

This file defines the main component props interface (`InterfaceUserPortalNavbarProps`)
for the UserPortalNavigationBar component, which provides a unified navigation bar
that adapts to both user mode and organization mode contexts.

## Remarks

The interface supports extensive customization options including:
- **Mode Selection**: Toggle between 'user' and 'organization' modes with different defaults
- **Branding**: Customizable logo, brand name, and branding click handlers
- **Navigation Links**: Dynamic navigation menu configuration with translation support
- **Feature Toggles**: Control visibility of notifications, language selector, and user profile
- **Mobile Responsiveness**: Configurable breakpoints and mobile layouts (collapse/offcanvas)
- **Custom Handlers**: Override default behavior for logout, language change, and navigation
- **State Management**: Support for external state management or internal localStorage/cookie usage

## Exports

InterfaceUserPortalNavbarProps - Main component props interface

## Exports

DEFAULT_USER_MODE_PROPS - Default configuration for user mode

## Exports

DEFAULT_ORGANIZATION_MODE_PROPS - Default configuration for organization mode

## See

 - UserPortalNavigationBar for component implementation
 - [BrandingConfig](../../types/UserPortalNavigationBar/types/type-aliases/BrandingConfig.md) in types.ts for branding configuration
 - [NavigationLink](../../types/UserPortalNavigationBar/types/type-aliases/NavigationLink.md) in types.ts for navigation link structure

## Examples

```ts
// User mode navigation
<UserPortalNavigationBar mode="user" showNotifications={true} />
```

```ts
// Organization mode with custom navigation
<UserPortalNavigationBar
  mode="organization"
  organizationId="123"
  navigationLinks={[
    { id: 'home', label: 'Home', path: '/org/123' },
    { id: 'campaigns', label: 'Campaigns', path: '/org/123/campaigns' }
  ]}
  currentPage="campaigns"
/>
```

## Interfaces

- [InterfaceLanguageSelectorProps](interfaces/InterfaceLanguageSelectorProps.md)
- [InterfaceUserDropdownProps](interfaces/InterfaceUserDropdownProps.md)
- [InterfaceUserPortalNavbarProps](interfaces/InterfaceUserPortalNavbarProps.md)

## Variables

- [DEFAULT\_ORGANIZATION\_MODE\_PROPS](variables/DEFAULT_ORGANIZATION_MODE_PROPS.md)
- [DEFAULT\_USER\_MODE\_PROPS](variables/DEFAULT_USER_MODE_PROPS.md)
