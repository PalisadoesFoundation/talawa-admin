[Admin Docs](/)

***

# Class: EventManager

Defined in: src/plugin/managers/event-manager.ts:6

Event Manager
Handles event listeners and event emission for the plugin system

## Constructors

### new EventManager()

> **new EventManager**(): `EventManager`

#### Returns

`EventManager`

## Methods

### emit()

> **emit**(`event`, ...`args`): `void`

Defined in: src/plugin/managers/event-manager.ts:39

#### Parameters

##### event

`string`

##### args

...`any`[]

#### Returns

`void`

***

### getEvents()

> **getEvents**(): `string`[]

Defined in: src/plugin/managers/event-manager.ts:70

#### Returns

`string`[]

***

### getListenerCount()

> **getListenerCount**(`event`): `number`

Defined in: src/plugin/managers/event-manager.ts:65

#### Parameters

##### event

`string`

#### Returns

`number`

***

### off()

> **off**(`event`, `callback`): `void`

Defined in: src/plugin/managers/event-manager.ts:21

#### Parameters

##### event

`string`

##### callback

`Function`

#### Returns

`void`

***

### on()

> **on**(`event`, `callback`): `void`

Defined in: src/plugin/managers/event-manager.ts:9

#### Parameters

##### event

`string`

##### callback

`Function`

#### Returns

`void`

***

### removeAllListeners()

> **removeAllListeners**(`event`?): `void`

Defined in: src/plugin/managers/event-manager.ts:57

#### Parameters

##### event?

`string`

#### Returns

`void`
