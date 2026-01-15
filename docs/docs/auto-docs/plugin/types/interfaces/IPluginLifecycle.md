[Admin Docs](/)

***

# Interface: IPluginLifecycle

Defined in: [src/plugin/types.ts:198](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/types.ts#L198)

## Properties

### onActivate()?

> `optional` **onActivate**: () => `Promise`\<`void`\>

Defined in: [src/plugin/types.ts:199](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/types.ts#L199)

#### Returns

`Promise`\<`void`\>

***

### onDeactivate()?

> `optional` **onDeactivate**: () => `Promise`\<`void`\>

Defined in: [src/plugin/types.ts:200](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/types.ts#L200)

#### Returns

`Promise`\<`void`\>

***

### onInstall()?

> `optional` **onInstall**: () => `Promise`\<`void`\>

Defined in: [src/plugin/types.ts:201](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/types.ts#L201)

#### Returns

`Promise`\<`void`\>

***

### onUninstall()?

> `optional` **onUninstall**: () => `Promise`\<`void`\>

Defined in: [src/plugin/types.ts:202](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/types.ts#L202)

#### Returns

`Promise`\<`void`\>

***

### onUpdate()?

> `optional` **onUpdate**: (`fromVersion`, `toVersion`) => `Promise`\<`void`\>

Defined in: [src/plugin/types.ts:203](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/types.ts#L203)

#### Parameters

##### fromVersion

`string`

##### toVersion

`string`

#### Returns

`Promise`\<`void`\>
