[**talawa-admin**](../../../../../README.md)

***

# Interface: IBaseModalProps

Defined in: [src/types/shared-components/BaseModal/interface.ts:27](https://github.com/ad1tyayadav/talawa-admin/blob/113d6bb4150eecf2f42bfd13d7ecd3aa2d021635/src/types/shared-components/BaseModal/interface.ts#L27)

BaseModal Component Props

A reusable modal wrapper component that standardizes modal structure
across the Talawa Admin application. Provides consistent header, body,
and footer layouts while reducing boilerplate code.

 IBaseModalProps

## Properties

### backdrop?

> `optional` **backdrop**: `boolean` \| `"static"`

Defined in: [src/types/shared-components/BaseModal/interface.ts:36](https://github.com/ad1tyayadav/talawa-admin/blob/113d6bb4150eecf2f42bfd13d7ecd3aa2d021635/src/types/shared-components/BaseModal/interface.ts#L36)

Backdrop behavior: 'static' prevents close on click, true allows it, false hides backdrop

***

### bodyClassName?

> `optional` **bodyClassName**: `string`

Defined in: [src/types/shared-components/BaseModal/interface.ts:42](https://github.com/ad1tyayadav/talawa-admin/blob/113d6bb4150eecf2f42bfd13d7ecd3aa2d021635/src/types/shared-components/BaseModal/interface.ts#L42)

Additional CSS classes for Modal.Body

***

### centered?

> `optional` **centered**: `boolean`

Defined in: [src/types/shared-components/BaseModal/interface.ts:35](https://github.com/ad1tyayadav/talawa-admin/blob/113d6bb4150eecf2f42bfd13d7ecd3aa2d021635/src/types/shared-components/BaseModal/interface.ts#L35)

Whether to vertically center modal

***

### children

> **children**: `ReactNode`

Defined in: [src/types/shared-components/BaseModal/interface.ts:32](https://github.com/ad1tyayadav/talawa-admin/blob/113d6bb4150eecf2f42bfd13d7ecd3aa2d021635/src/types/shared-components/BaseModal/interface.ts#L32)

Modal body content

***

### className?

> `optional` **className**: `string`

Defined in: [src/types/shared-components/BaseModal/interface.ts:38](https://github.com/ad1tyayadav/talawa-admin/blob/113d6bb4150eecf2f42bfd13d7ecd3aa2d021635/src/types/shared-components/BaseModal/interface.ts#L38)

Additional CSS classes for modal container

***

### closeButtonVariant?

> `optional` **closeButtonVariant**: `string`

Defined in: [src/types/shared-components/BaseModal/interface.ts:40](https://github.com/ad1tyayadav/talawa-admin/blob/113d6bb4150eecf2f42bfd13d7ecd3aa2d021635/src/types/shared-components/BaseModal/interface.ts#L40)

Bootstrap button variant for close button

***

### dataTestId?

> `optional` **dataTestId**: `string`

Defined in: [src/types/shared-components/BaseModal/interface.ts:44](https://github.com/ad1tyayadav/talawa-admin/blob/113d6bb4150eecf2f42bfd13d7ecd3aa2d021635/src/types/shared-components/BaseModal/interface.ts#L44)

Test ID for automated testing

***

### footer?

> `optional` **footer**: `ReactNode`

Defined in: [src/types/shared-components/BaseModal/interface.ts:33](https://github.com/ad1tyayadav/talawa-admin/blob/113d6bb4150eecf2f42bfd13d7ecd3aa2d021635/src/types/shared-components/BaseModal/interface.ts#L33)

Optional footer content with action buttons

***

### footerClassName?

> `optional` **footerClassName**: `string`

Defined in: [src/types/shared-components/BaseModal/interface.ts:43](https://github.com/ad1tyayadav/talawa-admin/blob/113d6bb4150eecf2f42bfd13d7ecd3aa2d021635/src/types/shared-components/BaseModal/interface.ts#L43)

Additional CSS classes for Modal.Footer

***

### headerClassName?

> `optional` **headerClassName**: `string`

Defined in: [src/types/shared-components/BaseModal/interface.ts:41](https://github.com/ad1tyayadav/talawa-admin/blob/113d6bb4150eecf2f42bfd13d7ecd3aa2d021635/src/types/shared-components/BaseModal/interface.ts#L41)

Additional CSS classes for Modal.Header

***

### headerContent?

> `optional` **headerContent**: `ReactNode`

Defined in: [src/types/shared-components/BaseModal/interface.ts:31](https://github.com/ad1tyayadav/talawa-admin/blob/113d6bb4150eecf2f42bfd13d7ecd3aa2d021635/src/types/shared-components/BaseModal/interface.ts#L31)

Custom header content (overrides default title + close button)

***

### keyboard?

> `optional` **keyboard**: `boolean`

Defined in: [src/types/shared-components/BaseModal/interface.ts:37](https://github.com/ad1tyayadav/talawa-admin/blob/113d6bb4150eecf2f42bfd13d7ecd3aa2d021635/src/types/shared-components/BaseModal/interface.ts#L37)

Whether the modal can be closed by pressing the Escape key

***

### onHide()

> **onHide**: () => `void`

Defined in: [src/types/shared-components/BaseModal/interface.ts:29](https://github.com/ad1tyayadav/talawa-admin/blob/113d6bb4150eecf2f42bfd13d7ecd3aa2d021635/src/types/shared-components/BaseModal/interface.ts#L29)

Callback when modal is closed (via X button, backdrop click, or Escape key)

#### Returns

`void`

***

### show

> **show**: `boolean`

Defined in: [src/types/shared-components/BaseModal/interface.ts:28](https://github.com/ad1tyayadav/talawa-admin/blob/113d6bb4150eecf2f42bfd13d7ecd3aa2d021635/src/types/shared-components/BaseModal/interface.ts#L28)

Controls modal visibility

***

### showCloseButton?

> `optional` **showCloseButton**: `boolean`

Defined in: [src/types/shared-components/BaseModal/interface.ts:39](https://github.com/ad1tyayadav/talawa-admin/blob/113d6bb4150eecf2f42bfd13d7ecd3aa2d021635/src/types/shared-components/BaseModal/interface.ts#L39)

Whether to show X close button in header

***

### size?

> `optional` **size**: `"sm"` \| `"lg"` \| `"xl"`

Defined in: [src/types/shared-components/BaseModal/interface.ts:34](https://github.com/ad1tyayadav/talawa-admin/blob/113d6bb4150eecf2f42bfd13d7ecd3aa2d021635/src/types/shared-components/BaseModal/interface.ts#L34)

Modal size variant (default: responsive)

***

### title?

> `optional` **title**: `string`

Defined in: [src/types/shared-components/BaseModal/interface.ts:30](https://github.com/ad1tyayadav/talawa-admin/blob/113d6bb4150eecf2f42bfd13d7ecd3aa2d021635/src/types/shared-components/BaseModal/interface.ts#L30)

Modal title displayed in header (uses i18n keys)
