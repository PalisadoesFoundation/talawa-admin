[**talawa-admin**](README.md)

***

# Interface: InterfaceNotificationToastI18nMessage

Defined in: [src/types/NotificationToast/interface.ts:18](https://github.com/SujalTripathi/talawa-admin/blob/201c311285eee8900b55c8a032a23046ba8c861b/src/types/NotificationToast/interface.ts#L18)

i18n-backed toast message definition.

## Properties

### key

> **key**: `string`

Defined in: [src/types/NotificationToast/interface.ts:25](https://github.com/SujalTripathi/talawa-admin/blob/201c311285eee8900b55c8a032a23046ba8c861b/src/types/NotificationToast/interface.ts#L25)

The i18next key to translate.

#### Example

```ts
'sessionWarning'
```

***

### namespace?

> `optional` **namespace**: [`NotificationToastNamespace`](types\NotificationToast\interface\README\type-aliases\NotificationToastNamespace.md)

Defined in: [src/types/NotificationToast/interface.ts:32](https://github.com/SujalTripathi/talawa-admin/blob/201c311285eee8900b55c8a032a23046ba8c861b/src/types/NotificationToast/interface.ts#L32)

Optional i18next namespace to use for translation.

Defaults to `'common'` when omitted.

***

### values?

> `optional` **values**: `Record`\<`string`, `unknown`\>

Defined in: [src/types/NotificationToast/interface.ts:37](https://github.com/SujalTripathi/talawa-admin/blob/201c311285eee8900b55c8a032a23046ba8c861b/src/types/NotificationToast/interface.ts#L37)

Optional interpolation values for i18next.
