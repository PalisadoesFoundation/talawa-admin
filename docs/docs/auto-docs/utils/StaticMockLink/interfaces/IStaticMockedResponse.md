[Admin Docs](/)

***

# Interface: IStaticMockedResponse

Defined in: [src/utils/StaticMockLink.ts:107](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/StaticMockLink.ts#L107)

Extended MockedResponse type that supports variableMatcher for flexible matching,
delay, and dynamic newData generation.

## Extends

- `MockedResponse`

## Properties

### delay?

> `optional` **delay**: `number` \| (`operation`) => `number`

Defined in: [src/utils/StaticMockLink.ts:112](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/StaticMockLink.ts#L112)

#### Overrides

`MockedResponse.delay`

***

### newData()?

> `optional` **newData**: (`variables`) => `FormattedExecutionResult`\<`Record`\<`string`, `any`\>, `Record`\<`string`, `any`\>\> \| `ResultFunction`\<`FormattedExecutionResult`\<`Record`\<`string`, `any`\>, `Record`\<`string`, `any`\>\>\>

Defined in: [src/utils/StaticMockLink.ts:109](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/StaticMockLink.ts#L109)

#### Parameters

##### variables

`Record`\<`string`, `unknown`\>

#### Returns

`FormattedExecutionResult`\<`Record`\<`string`, `any`\>, `Record`\<`string`, `any`\>\> \| `ResultFunction`\<`FormattedExecutionResult`\<`Record`\<`string`, `any`\>, `Record`\<`string`, `any`\>\>\>

***

### variableMatcher()?

> `optional` **variableMatcher**: (`variables`) => `boolean`

Defined in: [src/utils/StaticMockLink.ts:108](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/StaticMockLink.ts#L108)

#### Parameters

##### variables

`Record`\<`string`, `unknown`\>

#### Returns

`boolean`
