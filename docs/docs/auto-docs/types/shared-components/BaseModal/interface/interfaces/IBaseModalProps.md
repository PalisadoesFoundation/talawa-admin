[Admin Docs](/)

***

# Interface: IBaseModalProps

Defined in: [src/types/shared-components/BaseModal/interface.ts:30](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/BaseModal/interface.ts#L30)

BaseModal component props.

A reusable modal wrapper component that standardizes modal structure
across the Talawa Admin application. Provides consistent header, body,
and footer layouts while reducing boilerplate code.

## Remarks

Props:
- show: Controls modal visibility.
- onHide: Callback when modal is closed via X button, backdrop click, or Escape key.
- title: Modal title displayed in header (uses i18n keys).
- headerContent: Custom header content that overrides the default title and close button.
- children: Modal body content.
- footer: Optional footer content with action buttons.
- size: Modal size variant: sm, lg, xl.
- centered: Whether to vertically center the modal.
- backdrop: Backdrop behavior: static prevents close on click, true allows it, false hides backdrop.
- keyboard: Whether the modal can be closed by pressing the Escape key.
- className: Additional CSS classes for the modal container.
- showCloseButton: Whether to show the close button in the header.
- closeButtonVariant: Bootstrap button variant for the close button.
- headerClassName: Additional CSS classes for the modal header.
- headerTestId: Test ID for the modal header.
- bodyClassName: Additional CSS classes for the modal body.
- footerClassName: Additional CSS classes for the modal footer.
- dataTestId: Test ID for automated testing.
- id: Optional HTML id attribute for the modal container element.

## Properties

### backdrop?

> `optional` **backdrop**: `boolean` \| `"static"`

Defined in: [src/types/shared-components/BaseModal/interface.ts:39](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/BaseModal/interface.ts#L39)

***

### bodyClassName?

> `optional` **bodyClassName**: `string`

Defined in: [src/types/shared-components/BaseModal/interface.ts:46](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/BaseModal/interface.ts#L46)

***

### centered?

> `optional` **centered**: `boolean`

Defined in: [src/types/shared-components/BaseModal/interface.ts:38](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/BaseModal/interface.ts#L38)

***

### children

> **children**: `ReactNode`

Defined in: [src/types/shared-components/BaseModal/interface.ts:35](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/BaseModal/interface.ts#L35)

***

### className?

> `optional` **className**: `string`

Defined in: [src/types/shared-components/BaseModal/interface.ts:41](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/BaseModal/interface.ts#L41)

***

### closeButtonVariant?

> `optional` **closeButtonVariant**: `string`

Defined in: [src/types/shared-components/BaseModal/interface.ts:43](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/BaseModal/interface.ts#L43)

***

### dataTestId?

> `optional` **dataTestId**: `string`

Defined in: [src/types/shared-components/BaseModal/interface.ts:49](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/BaseModal/interface.ts#L49)

***

### footer?

> `optional` **footer**: `ReactNode`

Defined in: [src/types/shared-components/BaseModal/interface.ts:36](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/BaseModal/interface.ts#L36)

***

### footerClassName?

> `optional` **footerClassName**: `string`

Defined in: [src/types/shared-components/BaseModal/interface.ts:47](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/BaseModal/interface.ts#L47)

***

### headerClassName?

> `optional` **headerClassName**: `string`

Defined in: [src/types/shared-components/BaseModal/interface.ts:44](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/BaseModal/interface.ts#L44)

***

### headerContent?

> `optional` **headerContent**: `ReactNode`

Defined in: [src/types/shared-components/BaseModal/interface.ts:34](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/BaseModal/interface.ts#L34)

***

### headerTestId?

> `optional` **headerTestId**: `string`

Defined in: [src/types/shared-components/BaseModal/interface.ts:45](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/BaseModal/interface.ts#L45)

***

### id?

> `optional` **id**: `string`

Defined in: [src/types/shared-components/BaseModal/interface.ts:48](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/BaseModal/interface.ts#L48)

***

### keyboard?

> `optional` **keyboard**: `boolean`

Defined in: [src/types/shared-components/BaseModal/interface.ts:40](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/BaseModal/interface.ts#L40)

***

### onHide()

> **onHide**: () => `void`

Defined in: [src/types/shared-components/BaseModal/interface.ts:32](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/BaseModal/interface.ts#L32)

#### Returns

`void`

***

### show

> **show**: `boolean`

Defined in: [src/types/shared-components/BaseModal/interface.ts:31](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/BaseModal/interface.ts#L31)

***

### showCloseButton?

> `optional` **showCloseButton**: `boolean`

Defined in: [src/types/shared-components/BaseModal/interface.ts:42](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/BaseModal/interface.ts#L42)

***

### size?

> `optional` **size**: `"sm"` \| `"lg"` \| `"xl"`

Defined in: [src/types/shared-components/BaseModal/interface.ts:37](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/BaseModal/interface.ts#L37)

***

### title?

> `optional` **title**: `ReactNode`

Defined in: [src/types/shared-components/BaseModal/interface.ts:33](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/BaseModal/interface.ts#L33)
