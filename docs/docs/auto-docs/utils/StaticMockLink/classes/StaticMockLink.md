[Admin Docs](/)

***

# Class: StaticMockLink

Defined in: src/utils/StaticMockLink.ts:35

Similar to the standard Apollo MockLink, but doesn't consume a mock
when it is used allowing it to be used in places like Storybook.

## Extends

- `ApolloLink`

## Constructors

### Constructor

> **new StaticMockLink**(`mockedResponses`, `addTypename`): `StaticMockLink`

Defined in: src/utils/StaticMockLink.ts:40

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

Defined in: src/utils/StaticMockLink.ts:37

***

### operation?

> `optional` **operation**: `Operation`

Defined in: src/utils/StaticMockLink.ts:36

## Methods

### addMockedResponse()

> **addMockedResponse**(`mockedResponse`): `void`

Defined in: src/utils/StaticMockLink.ts:50

#### Parameters

##### mockedResponse

`MockedResponse`

#### Returns

`void`

***

### request()

> **request**(`operation`): `Observable`\<`FetchResult`\>

Defined in: src/utils/StaticMockLink.ts:65

#### Parameters

##### operation

`Operation`

#### Returns

`Observable`\<`FetchResult`\>

#### Overrides

`ApolloLink.request`
