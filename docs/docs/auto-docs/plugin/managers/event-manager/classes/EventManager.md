[Admin Docs](/)

***

# Class: EventManager

Defined in: src/plugin/managers/event-manager.ts:6

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

Defined in: src/plugin/managers/event-manager.ts:45

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

Defined in: src/plugin/managers/event-manager.ts:76

#### Returns

`string`[]

***

### getListenerCount()

> **getListenerCount**(`event`): `number`

Defined in: src/plugin/managers/event-manager.ts:71

#### Parameters

##### event

`string`

#### Returns

`number`

***

### off()

> **off**(`event`, `callback`): `void`

Defined in: src/plugin/managers/event-manager.ts:27

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

Defined in: src/plugin/managers/event-manager.ts:10

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

Defined in: src/plugin/managers/event-manager.ts:63

#### Parameters

##### event?

`string`

#### Returns

`void`
