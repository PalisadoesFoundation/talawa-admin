[**talawa-admin**](README.md)

***

# Variable: NotificationToast

> `const` **NotificationToast**: [`InterfaceNotificationToastHelpers`](types\NotificationToast\interface\README\interfaces\InterfaceNotificationToastHelpers.md)

Defined in: [src/components/NotificationToast/NotificationToast.tsx:76](https://github.com/SujalTripathi/talawa-admin/blob/ed913970521689f5a1e8aec0179ffa2d67f07028/src/components/NotificationToast/NotificationToast.tsx#L76)

NotificationToast

A small wrapper around `react-toastify` that standardizes toast defaults and
supports translating messages with an explicit i18n namespace.

## Examples

```ts
NotificationToast.success('Saved');
```

```ts
NotificationToast.error({ key: 'unknownError', namespace: 'errors' });
```

```ts
NotificationToast.dismiss(); // Dismiss all active toasts
```
