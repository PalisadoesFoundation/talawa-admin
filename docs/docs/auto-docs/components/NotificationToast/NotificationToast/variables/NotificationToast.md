[**talawa-admin**](../../../../README.md)

***

# Variable: NotificationToast

> `const` **NotificationToast**: [`InterfaceNotificationToastHelpers`](../../../../types/NotificationToast/interface/interfaces/InterfaceNotificationToastHelpers.md)

Defined in: [src/components/NotificationToast/NotificationToast.tsx:115](https://github.com/Anshikaaa06/talawa-admin/blob/9e54ad8a0be6c052a435c30f5a6bbbad9b905bb5/src/components/NotificationToast/NotificationToast.tsx#L115)

NotificationToast

A small wrapper around `react-toastify` that standardizes toast defaults and
supports translating messages with an explicit i18n namespace.

## Examples

```ts
NotificationToast.success('Saved');
```

```
NotificationToast.error({ key: 'unknownError', namespace: 'errors' });
```

```ts
NotificationToast.dismiss(); // Dismiss all active toasts
```

```ts
Notification.promise(promisifiedFunction, {
 pending: 'pending message',
 success: 'success message',
 error: 'error message'
});
```
