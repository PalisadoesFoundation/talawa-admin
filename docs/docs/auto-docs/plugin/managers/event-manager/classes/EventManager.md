[Admin Docs](/)

***

# Class: EventManager

Defined in: [src/plugin/managers/event-manager.ts:6](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/managers/event-manager.ts#L6)

Event Manager
Handles event listeners and event emission for the plugin system

## Constructors

### Constructor

> **new EventManager**(): `EventManager`

#### Returns

`EventManager`

## Methods

### emit()

> **emit**(`event`, ...`args`): `void`

Defined in: [src/plugin/managers/event-manager.ts:44](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/managers/event-manager.ts#L44)

#### Parameters

##### event

`string`

##### args

...`unknown`[]

#### Returns

`void`

***

### getEvents()

> **getEvents**(): `string`[]

Defined in: [src/plugin/managers/event-manager.ts:75](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/managers/event-manager.ts#L75)

#### Returns

`string`[]

***

### getListenerCount()

> **getListenerCount**(`event`): `number`

Defined in: [src/plugin/managers/event-manager.ts:70](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/managers/event-manager.ts#L70)

#### Parameters

##### event

`string`

#### Returns

`number`

***

### off()

> **off**(`event`, `callback`): `void`

Defined in: [src/plugin/managers/event-manager.ts:26](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/managers/event-manager.ts#L26)

#### Parameters

##### event

`string`

##### callback

(...`args`) => `void`

#### Returns

`void`

***

### on()

> **on**(`event`, `callback`): `void`

Defined in: [src/plugin/managers/event-manager.ts:10](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/managers/event-manager.ts#L10)

#### Parameters

##### event

`string`

##### callback

(...`args`) => `void`

#### Returns

`void`

***

### removeAllListeners()

> **removeAllListeners**(`event?`): `void`

Defined in: [src/plugin/managers/event-manager.ts:62](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/managers/event-manager.ts#L62)

#### Parameters

##### event?

`string`

#### Returns

`void`
