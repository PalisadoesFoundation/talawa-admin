[Admin Docs](/)

***

# Class: StaticMockLink

Defined in: [src/utils/StaticMockLink.ts:34](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/StaticMockLink.ts#L34)

Similar to the standard Apollo MockLink, but doesn't consume a mock
when it is used allowing it to be used in places like Storybook.

## Extends

- `ApolloLink`

## Constructors

### Constructor

> **new StaticMockLink**(`mockedResponses`, `addTypename`): `StaticMockLink`

Defined in: [src/utils/StaticMockLink.ts:39](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/StaticMockLink.ts#L39)

#### Parameters

##### mockedResponses

readonly `MockedResponse`[]

##### addTypename

`boolean` = `true`

#### Returns

`StaticMockLink`

#### Overrides

`ApolloLink.constructor`

## Properties

### addTypename

> **addTypename**: `boolean` = `true`

Defined in: [src/utils/StaticMockLink.ts:36](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/StaticMockLink.ts#L36)

***

### operation?

> `optional` **operation**: `Operation`

Defined in: [src/utils/StaticMockLink.ts:35](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/StaticMockLink.ts#L35)

## Methods

### addMockedResponse()

> **addMockedResponse**(`mockedResponse`): `void`

Defined in: [src/utils/StaticMockLink.ts:49](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/StaticMockLink.ts#L49)

#### Parameters

##### mockedResponse

`MockedResponse`

#### Returns

`void`

***

### onError()

> **onError**(`error`, `observer`): `boolean`

Defined in: [src/utils/StaticMockLink.ts:64](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/StaticMockLink.ts#L64)

#### Parameters

##### error

`Error`

##### observer

###### error

(`e`) => `void`

#### Returns

`boolean`

***

### request()

> **request**(`operation`): `Observable`\<`FormattedExecutionResult`\<`Record`\<`string`, `any`\>, `Record`\<`string`, `any`\>\>\>

Defined in: [src/utils/StaticMockLink.ts:74](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/StaticMockLink.ts#L74)

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
