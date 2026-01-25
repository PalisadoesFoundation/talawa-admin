[**talawa-admin**](../../../../README.md)

***

# Variable: NotificationToast

> `const` **NotificationToast**: [`InterfaceNotificationToastHelpers`](../../../../types/shared-components/NotificationToast/interface/interfaces/InterfaceNotificationToastHelpers.md)

Defined in: [src/shared-components/NotificationToast/NotificationToast.tsx:126](https://github.com/BittuBarnwal7479/talawa-admin/blob/7329c220ecd98ce2ec3fc0b9fc39dd1a39bb1df4/src/shared-components/NotificationToast/NotificationToast.tsx#L126)

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
