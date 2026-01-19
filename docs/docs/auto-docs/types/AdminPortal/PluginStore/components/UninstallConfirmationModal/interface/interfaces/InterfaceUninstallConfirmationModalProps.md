[Admin Docs](/)

---

# Interface: InterfaceUninstallConfirmationModalProps

Defined in: [src/types/AdminPortal/PluginStore/components/UninstallConfirmationModal/interface.ts:26](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/PluginStore/components/UninstallConfirmationModal/interface.ts#L26)

InterfaceUninstallConfirmationModalProps

Defines the properties required to control the modal's visibility,
handle user actions, and pass the selected plugin data.

## Properties

### onClose()

> **onClose**: () => `void`

Defined in: [src/types/AdminPortal/PluginStore/components/UninstallConfirmationModal/interface.ts:31](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/PluginStore/components/UninstallConfirmationModal/interface.ts#L31)

Function to close the modal without taking action

#### Returns

`void`

---

### onConfirm()

> **onConfirm**: () => `Promise`\<`void`\>

Defined in: [src/types/AdminPortal/PluginStore/components/UninstallConfirmationModal/interface.ts:34](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/PluginStore/components/UninstallConfirmationModal/interface.ts#L34)

Function to proceed with the uninstallation process

#### Returns

`Promise`\<`void`\>

---

### plugin

> **plugin**: [`IPluginMeta`](../../../../../../../plugin/types/interfaces/IPluginMeta.md)

Defined in: [src/types/AdminPortal/PluginStore/components/UninstallConfirmationModal/interface.ts:37](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/PluginStore/components/UninstallConfirmationModal/interface.ts#L37)

The metadata of the plugin selected for uninstallation, or null if none selected

---

### show

> **show**: `boolean`

Defined in: [src/types/AdminPortal/PluginStore/components/UninstallConfirmationModal/interface.ts:28](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/PluginStore/components/UninstallConfirmationModal/interface.ts#L28)

Controls whether the uninstall confirmation modal is visible
