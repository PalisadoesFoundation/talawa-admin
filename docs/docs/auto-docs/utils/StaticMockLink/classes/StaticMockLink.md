[Admin Docs](/)

***

# Class: StaticMockLink

Defined in: [src/utils/StaticMockLink.ts:130](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/StaticMockLink.ts#L130)

Similar to the standard Apollo MockLink, but doesn't consume a mock
when it is used allowing it to be used in places like Storybook.

## Extends

- `ApolloLink`

## Constructors

### Constructor

> **new StaticMockLink**(`mockedResponses`, `addTypename`): `StaticMockLink`

Defined in: [src/utils/StaticMockLink.ts:136](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/StaticMockLink.ts#L136)

#### Parameters

##### mockedResponses

readonly [`IStaticMockedResponse`](../interfaces/IStaticMockedResponse.md)[]

##### addTypename

`boolean` = `true`

#### Returns

`StaticMockLink`

#### Overrides

`ApolloLink.constructor`

## Properties

### addTypename

> **addTypename**: `boolean` = `true`

Defined in: [src/utils/StaticMockLink.ts:132](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/StaticMockLink.ts#L132)

***

### operation?

> `optional` **operation**: `Operation`

Defined in: [src/utils/StaticMockLink.ts:131](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/StaticMockLink.ts#L131)

## Methods

### addMockedResponse()

> **addMockedResponse**(`mockedResponse`): `void`

Defined in: [src/utils/StaticMockLink.ts:149](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/StaticMockLink.ts#L149)

#### Parameters

##### mockedResponse

[`IStaticMockedResponse`](../interfaces/IStaticMockedResponse.md)

#### Returns

`void`

***

### onError()

> **onError**(`_error`, `_observer?`): `boolean` \| `void`

Defined in: [src/utils/StaticMockLink.ts:255](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/StaticMockLink.ts#L255)

#### Parameters

##### \_error

`Error`

##### \_observer?

`unknown`

#### Returns

`boolean` \| `void`

***

### request()

> **request**(`operation`): `Observable`\<`FormattedExecutionResult`\<`Record`\<`string`, `any`\>, `Record`\<`string`, `any`\>\>\>

Defined in: [src/utils/StaticMockLink.ts:164](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/StaticMockLink.ts#L164)

Runs the request handler for the provided operation.

> [!NOTE]
> This is called by the `ApolloLink.execute` function for you and should
> not be called directly. Prefer using `ApolloLink.execute` to make the
> request instead.

#### Parameters

##### operation

`Operation`

#### Returns

`Observable`\<`FormattedExecutionResult`\<`Record`\<`string`, `any`\>, `Record`\<`string`, `any`\>\>\>

#### Overrides

`ApolloLink.request`
