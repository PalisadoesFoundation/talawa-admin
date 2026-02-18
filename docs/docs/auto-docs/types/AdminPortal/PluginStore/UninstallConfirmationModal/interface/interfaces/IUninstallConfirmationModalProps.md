[Admin Docs](/)

***

# Interface: IUninstallConfirmationModalProps

Defined in: [src/types/AdminPortal/PluginStore/UninstallConfirmationModal/interface.ts:11](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/PluginStore/UninstallConfirmationModal/interface.ts#L11)

Interface for the UninstallConfirmationModal component props.

## Param

Boolean to control the visibility of the modal.

## Param

Callback function to handle the closing of the modal.

## Param

Callback function to handle the confirmation action.

## Param

The plugin metadata object to be uninstalled, or null if none selected.

## Properties

### onClose()

> **onClose**: () => `void`

Defined in: [src/types/AdminPortal/PluginStore/UninstallConfirmationModal/interface.ts:13](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/PluginStore/UninstallConfirmationModal/interface.ts#L13)

#### Returns

`void`

***

### onConfirm()

> **onConfirm**: () => `void`

Defined in: [src/types/AdminPortal/PluginStore/UninstallConfirmationModal/interface.ts:14](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/PluginStore/UninstallConfirmationModal/interface.ts#L14)

#### Returns

`void`

***

### plugin

> **plugin**: [`IPluginMeta`](../../../../../../plugin/types/interfaces/IPluginMeta.md)

Defined in: [src/types/AdminPortal/PluginStore/UninstallConfirmationModal/interface.ts:15](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/PluginStore/UninstallConfirmationModal/interface.ts#L15)

***

### show

> **show**: `boolean`

Defined in: [src/types/AdminPortal/PluginStore/UninstallConfirmationModal/interface.ts:12](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/PluginStore/UninstallConfirmationModal/interface.ts#L12)
