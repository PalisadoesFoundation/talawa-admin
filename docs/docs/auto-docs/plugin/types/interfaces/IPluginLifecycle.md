[Admin Docs](/)

***

# Interface: IPluginLifecycle

Defined in: [src/plugin/types.ts:174](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/types.ts#L174)

## Properties

### onActivate()?

> `optional` **onActivate**: () => `Promise`\<`void`\>

Defined in: [src/plugin/types.ts:175](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/types.ts#L175)

#### Returns

`Promise`\<`void`\>

***

### onDeactivate()?

> `optional` **onDeactivate**: () => `Promise`\<`void`\>

Defined in: [src/plugin/types.ts:176](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/types.ts#L176)

#### Returns

`Promise`\<`void`\>

***

### onInstall()?

> `optional` **onInstall**: () => `Promise`\<`void`\>

Defined in: [src/plugin/types.ts:177](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/types.ts#L177)

#### Returns

`Promise`\<`void`\>

***

### onUninstall()?

> `optional` **onUninstall**: () => `Promise`\<`void`\>

Defined in: [src/plugin/types.ts:178](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/types.ts#L178)

#### Returns

`Promise`\<`void`\>

***

### onUpdate()?

> `optional` **onUpdate**: (`fromVersion`, `toVersion`) => `Promise`\<`void`\>

Defined in: [src/plugin/types.ts:179](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/types.ts#L179)

#### Parameters

##### fromVersion

`string`

##### toVersion

`string`

#### Returns

`Promise`\<`void`\>
