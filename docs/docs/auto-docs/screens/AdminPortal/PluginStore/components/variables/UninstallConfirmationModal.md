[Admin Docs](/)

***

# Variable: UninstallConfirmationModal

> `const` **UninstallConfirmationModal**: `React.FC`\<[`InterfaceUninstallConfirmationModalProps`](../../../../../types/AdminPortal/PluginStore/components/UninstallConfirmationModal/interface/interfaces/InterfaceUninstallConfirmationModalProps.md)\>

Defined in: [src/screens/AdminPortal/PluginStore/components/UninstallConfirmationModal.tsx:35](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/AdminPortal/PluginStore/components/UninstallConfirmationModal.tsx#L35)

UninstallConfirmationModal

A confirmation modal displayed before uninstalling a plugin.
It warns the user about the action and triggers the uninstall process.

## Param

Boolean to control modal visibility

## Param

Function to close the modal without taking action

## Param

Function to proceed with uninstallation

## Param

The plugin object being uninstalled

## Returns

The rendered modal component or null if no plugin is selected.
