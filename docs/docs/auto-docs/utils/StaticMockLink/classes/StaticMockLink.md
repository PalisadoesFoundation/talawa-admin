[Admin Docs](/)

***

# Class: StaticMockLink

Defined in: [src/utils/StaticMockLink.ts:42](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/StaticMockLink.ts#L42)

Similar to the standard Apollo MockLink, but doesn't consume a mock
when it is used allowing it to be used in places like Storybook.

## Extends

- `ApolloLink`

## Constructors

### Constructor

> **new StaticMockLink**(`mockedResponses`, `addTypename`): `StaticMockLink`

Defined in: [src/utils/StaticMockLink.ts:47](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/StaticMockLink.ts#L47)

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

Defined in: [src/utils/StaticMockLink.ts:44](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/StaticMockLink.ts#L44)

***

### operation?

> `optional` **operation**: `Operation`

Defined in: [src/utils/StaticMockLink.ts:43](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/StaticMockLink.ts#L43)

## Methods

### addMockedResponse()

> **addMockedResponse**(`mockedResponse`): `void`

Defined in: [src/utils/StaticMockLink.ts:57](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/StaticMockLink.ts#L57)

#### Parameters

##### mockedResponse

`MockedResponse`

#### Returns

`void`

***

### request()

> **request**(`operation`): `Observable`\<`FetchResult`\>

Defined in: [src/utils/StaticMockLink.ts:72](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/StaticMockLink.ts#L72)

#### Parameters

##### operation

`Operation`

#### Returns

`Observable`\<`FetchResult`\>

#### Overrides

`ApolloLink.request`
