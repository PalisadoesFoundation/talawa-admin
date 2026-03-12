[Admin Docs](/)

***

# Interface: InterfaceDropDownProps

Defined in: [src/types/shared-components/DropDownButton/interface.ts:30](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DropDownButton/interface.ts#L30)

Interface for dropdown component props.

Styling props:
- **Base (component/default layout):** `parentContainerStyle` and `btnStyle` are applied first
  (e.g. from SortingButton or Navbar defaults).
- **Consumer overrides:** `containerClassName` and `toggleClassName` are merged with the base
  so parent screens can add their own CSS module classes without replacing defaults.

## Extended by

- [`InterfaceDropDownButtonProps`](InterfaceDropDownButtonProps.md)

## Properties

### btnStyle?

> `optional` **btnStyle**: `string`

Defined in: [src/types/shared-components/DropDownButton/interface.ts:41](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DropDownButton/interface.ts#L41)

Base class(es) for the toggle button. Applied first; often set by the wrapping component.
Use this for default button layout/theme.

***

### containerClassName?

> `optional` **containerClassName**: `string`

Defined in: [src/types/shared-components/DropDownButton/interface.ts:53](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DropDownButton/interface.ts#L53)

Consumer override: extra class name(s) for the dropdown container, merged with
parentContainerStyle. Use from parent screens (e.g. CSS module classes) to style the
container without coupling to test IDs.

***

### menuClassName?

> `optional` **menuClassName**: `string`

Defined in: [src/types/shared-components/DropDownButton/interface.ts:46](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DropDownButton/interface.ts#L46)

Custom class name for the dropdown menu.

***

### parentContainerStyle?

> `optional` **parentContainerStyle**: `string`

Defined in: [src/types/shared-components/DropDownButton/interface.ts:35](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DropDownButton/interface.ts#L35)

Base class(es) for the dropdown container. Applied first; often set by the wrapping component
(e.g. SortingButton, Navbar). Use this for default layout/theme.

***

### toggleClassName?

> `optional` **toggleClassName**: `string`

Defined in: [src/types/shared-components/DropDownButton/interface.ts:60](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DropDownButton/interface.ts#L60)

Consumer override: extra class name(s) for the toggle button, merged with btnStyle.
Use from parent screens (e.g. CSS module classes) to style the toggle without
coupling to test IDs.
