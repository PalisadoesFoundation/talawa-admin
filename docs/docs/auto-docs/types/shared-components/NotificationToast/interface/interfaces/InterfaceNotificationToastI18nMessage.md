[**talawa-admin**](../../../../../README.md)

***

# Interface: InterfaceNotificationToastI18nMessage

Defined in: [src/types/shared-components/NotificationToast/interface.ts:18](https://github.com/MonishPuttu/talawa-admin/blob/4630ca9b3a05c039a7c82f0e137454f2802795b4/src/types/shared-components/NotificationToast/interface.ts#L18)

i18n-backed toast message definition.

## Properties

### key

> **key**: `string`

Defined in: [src/types/shared-components/NotificationToast/interface.ts:25](https://github.com/MonishPuttu/talawa-admin/blob/4630ca9b3a05c039a7c82f0e137454f2802795b4/src/types/shared-components/NotificationToast/interface.ts#L25)

The i18next key to translate.

#### Example

```ts
'sessionWarning'
```

***

### namespace?

> `optional` **namespace**: [`NotificationToastNamespace`](../type-aliases/NotificationToastNamespace.md)

Defined in: [src/types/shared-components/NotificationToast/interface.ts:32](https://github.com/MonishPuttu/talawa-admin/blob/4630ca9b3a05c039a7c82f0e137454f2802795b4/src/types/shared-components/NotificationToast/interface.ts#L32)

Optional i18next namespace to use for translation.

Defaults to `'common'` when omitted.

***

### values?

> `optional` **values**: `Record`\<`string`, `unknown`\>

Defined in: [src/types/shared-components/NotificationToast/interface.ts:37](https://github.com/MonishPuttu/talawa-admin/blob/4630ca9b3a05c039a7c82f0e137454f2802795b4/src/types/shared-components/NotificationToast/interface.ts#L37)

Optional interpolation values for i18next.
