[Admin Docs](/)

***

# Interface: IPluginLifecycle

Defined in: src/plugin/types.ts:198

## Properties

### onActivate()?

> `optional` **onActivate**: () => `Promise`\<`void`\>

Defined in: src/plugin/types.ts:199

#### Returns

`Promise`\<`void`\>

***

### onDeactivate()?

> `optional` **onDeactivate**: () => `Promise`\<`void`\>

Defined in: src/plugin/types.ts:200

#### Returns

`Promise`\<`void`\>

***

### onInstall()?

> `optional` **onInstall**: () => `Promise`\<`void`\>

Defined in: src/plugin/types.ts:201

#### Returns

`Promise`\<`void`\>

***

### onUninstall()?

> `optional` **onUninstall**: () => `Promise`\<`void`\>

Defined in: src/plugin/types.ts:202

#### Returns

`Promise`\<`void`\>

***

### onUpdate()?

> `optional` **onUpdate**: (`fromVersion`, `toVersion`) => `Promise`\<`void`\>

Defined in: src/plugin/types.ts:203

#### Parameters

##### fromVersion

`string`

##### toVersion

`string`

#### Returns

`Promise`\<`void`\>
