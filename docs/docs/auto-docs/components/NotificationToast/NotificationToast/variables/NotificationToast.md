[Admin Docs](/)

***

# Variable: NotificationToast

> `const` **NotificationToast**: [`InterfaceNotificationToastHelpers`](../../../../types/NotificationToast/interface/interfaces/InterfaceNotificationToastHelpers.md)

Defined in: [src/components/NotificationToast/NotificationToast.tsx:73](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/NotificationToast/NotificationToast.tsx#L73)

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
