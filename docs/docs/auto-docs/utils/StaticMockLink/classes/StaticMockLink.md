[Admin Docs](/)

***

# Class: StaticMockLink

Defined in: [src/utils/StaticMockLink.ts:28](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/StaticMockLink.ts#L28)

Similar to the standard Apollo MockLink, but doesn't consume a mock
when it is used allowing it to be used in places like Storybook.

## Extends

- `ApolloLink`

## Constructors

### Constructor

> **new StaticMockLink**(`mockedResponses`, `addTypename`): `StaticMockLink`

Defined in: [src/utils/StaticMockLink.ts:33](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/StaticMockLink.ts#L33)

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

Defined in: [src/utils/StaticMockLink.ts:30](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/StaticMockLink.ts#L30)

***

### operation?

> `optional` **operation**: `Operation`

Defined in: [src/utils/StaticMockLink.ts:29](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/StaticMockLink.ts#L29)

## Methods

### addMockedResponse()

> **addMockedResponse**(`mockedResponse`): `void`

Defined in: [src/utils/StaticMockLink.ts:43](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/StaticMockLink.ts#L43)

#### Parameters

##### mockedResponse

`MockedResponse`

#### Returns

`void`

***

### onError()

> **onError**(`error`, `observer`): `boolean`

Defined in: [src/utils/StaticMockLink.ts:58](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/StaticMockLink.ts#L58)

#### Parameters

##### error

`any`

##### observer

`any`

#### Returns

`boolean`

***

### request()

> **request**(`operation`): `Observable`\<`FormattedExecutionResult`\<`Record`\<`string`, `any`\>, `Record`\<`string`, `any`\>\>\>

Defined in: [src/utils/StaticMockLink.ts:66](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/StaticMockLink.ts#L66)

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
