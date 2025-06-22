[Admin Docs](/)

***

# Class: StaticMockLink

Defined in: [src/utils/StaticMockLink.ts:30](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/StaticMockLink.ts#L30)

Similar to the standard Apollo MockLink, but doesn't consume a mock
when it is used allowing it to be used in places like Storybook.

## Extends

- `ApolloLink`

## Constructors

### new StaticMockLink()

> **new StaticMockLink**(`mockedResponses`, `addTypename`): `StaticMockLink`

Defined in: [src/utils/StaticMockLink.ts:35](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/StaticMockLink.ts#L35)

#### Parameters

##### mockedResponses

readonly `MockedResponse`\<`Record`\<`string`, `any`\>, `Record`\<`string`, `any`\>\>[]

##### addTypename

`boolean` = `true`

#### Returns

`StaticMockLink`

#### Overrides

`ApolloLink.constructor`

## Properties

### addTypename

> **addTypename**: `boolean` = `true`

Defined in: [src/utils/StaticMockLink.ts:32](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/StaticMockLink.ts#L32)

***

### operation?

> `optional` **operation**: `Operation`

Defined in: [src/utils/StaticMockLink.ts:31](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/StaticMockLink.ts#L31)

## Methods

### addMockedResponse()

> **addMockedResponse**(`mockedResponse`): `void`

Defined in: [src/utils/StaticMockLink.ts:45](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/StaticMockLink.ts#L45)

#### Parameters

##### mockedResponse

`MockedResponse`

#### Returns

`void`

***

### request()

> **request**(`operation`): `Observable`\<`FetchResult`\>

Defined in: [src/utils/StaticMockLink.ts:60](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/StaticMockLink.ts#L60)

#### Parameters

##### operation

`any`

#### Returns

`Observable`\<`FetchResult`\>

#### Overrides

`ApolloLink.request`
