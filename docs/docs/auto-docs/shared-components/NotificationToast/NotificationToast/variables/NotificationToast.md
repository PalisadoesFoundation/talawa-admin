[**talawa-admin**](../../../../README.md)

***

# Variable: NotificationToast

> `const` **NotificationToast**: [`InterfaceNotificationToastHelpers`](../../../../types/shared-components/NotificationToast/interface/interfaces/InterfaceNotificationToastHelpers.md)

Defined in: [src/shared-components/NotificationToast/NotificationToast.tsx:126](https://github.com/yb175/talawa-admin/blob/fce1167047be7ffe368e3ca73cbf38141b19703e/src/shared-components/NotificationToast/NotificationToast.tsx#L126)

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
