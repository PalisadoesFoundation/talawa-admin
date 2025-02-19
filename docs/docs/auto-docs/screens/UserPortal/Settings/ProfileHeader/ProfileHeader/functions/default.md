[Admin Docs](/)

***

# Function: default()

> **default**(`props`, `deprecatedLegacyContext`?): `ReactNode`

Defined in: [src/screens/UserPortal/Settings/ProfileHeader/ProfileHeader.tsx:42](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/UserPortal/Settings/ProfileHeader/ProfileHeader.tsx#L42)

A header component that displays a title and profile dropdown menu

This component creates a header section that includes:
- A title on the left side
- A profile dropdown menu on the right side

The layout uses flexbox for proper alignment and spacing between
the title and the dropdown menu.

## Parameters

### props

`InterfaceProfileHeaderProps`

### deprecatedLegacyContext?

`any`

**Deprecated**

**See**

[React Docs](https://legacy.reactjs.org/docs/legacy-context.html#referencing-context-in-lifecycle-methods)

## Returns

`ReactNode`

## Remarks

The component uses Bootstrap classes for layout and styling:
- d-flex for flexbox layout
- justify-content-between for spacing
- align-items-center for vertical alignment

## Example

Basic usage:
```tsx
<ProfileHeader title="Settings" />
```

Usage with translated text:
```tsx
<ProfileHeader title={t('settings')} />
```
