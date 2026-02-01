[Admin Docs](/)

***

# Function: useUpdateEventHandler()

> **useUpdateEventHandler**(): `object`

Defined in: [src/components/EventListCard/Modal/updateLogic.ts:28](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/EventListCard/Modal/updateLogic.ts#L28)

Creates the update handler for EventListCard modal edits, managing mutations for standalone and recurring events.

## Returns

`object`

An object containing the update logic:
- updateEventHandler: `(args: IUpdateEventHandlerProps) => Promise<void>` - Asynchronous function that handles the event update process, including validation and mutation execution.

### updateEventHandler()

> **updateEventHandler**: (`__namedParameters`) => `Promise`\<`void`\>

#### Parameters

##### \_\_namedParameters

[`InterfaceUpdateEventHandlerProps`](../../../../../types/EventListCard/interface/interfaces/InterfaceUpdateEventHandlerProps.md)

#### Returns

`Promise`\<`void`\>
