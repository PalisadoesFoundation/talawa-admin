[**talawa-admin**](../../../../README.md)

***

# Variable: default

> `const` **default**: `React.FC`\<`InterfaceProfileFormWrapperProps`\>

Defined in: [src/shared-components/ProfileForm/ProfileFormWrapper.tsx:63](https://github.com/Anshikaaa06/talawa-admin/blob/9e54ad8a0be6c052a435c30f5a6bbbad9b905bb5/src/shared-components/ProfileForm/ProfileFormWrapper.tsx#L63)

ProfileFormWrapper - A conditional wrapper component that provides user-specific UI layout.

This wrapper is required because the SecuredRouteForUser component
(src/components/UserPortal/SecuredRouteForUser/SecuredRouteForUser.tsx)
does not provide any sidebar to the outlet directly. When a user is viewing
their own profile, we need to wrap the ProfileForm with the UserSidebar
and ProfileHeader to maintain consistent user portal layout.

## Param

The component props

## Param

If true, renders with UserSidebar and ProfileHeader for user profile view.
                      If false, renders children directly for admin member view.

## Param

Controls sidebar visibility state

## Param

Function to toggle sidebar visibility

## Param

Translation function for internationalized text

## Param

The ProfileForm content to be wrapped

## Returns

JSX element with conditional layout based on user context

## Example

```tsx
// For user profile view (includes sidebar and header)
<ProfileFormWrapper
  isUser={true}
  hideDrawer={false}
  setHideDrawer={setHideDrawer}
  tCommon={t}
>
  <ProfileFormContent />
</ProfileFormWrapper>

// For admin member view (no sidebar, just content)
<ProfileFormWrapper
  isUser={false}
  hideDrawer={false}
  setHideDrawer={setHideDrawer}
  tCommon={t}
>
  <ProfileFormContent />
</ProfileFormWrapper>
```
