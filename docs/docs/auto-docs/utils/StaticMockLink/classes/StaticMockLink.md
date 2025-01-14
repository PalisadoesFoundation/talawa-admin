[**talawa-admin**](../../../README.md)

***

[talawa-admin](../../../README.md) / [utils/StaticMockLink](../README.md) / StaticMockLink

# Class: StaticMockLink

Defined in: [src/utils/StaticMockLink.ts:30](https://github.com/bint-Eve/talawa-admin/blob/bb9ac170c0ec806cc5423650a66bbe110c3af5d9/src/utils/StaticMockLink.ts#L30)

Similar to the standard Apollo MockLink, but doesn't consume a mock
when it is used allowing it to be used in places like Storybook.

## Extends

- `unknown`

## Constructors

### new StaticMockLink()

> **new StaticMockLink**(`mockedResponses`, `addTypename`): [`StaticMockLink`](StaticMockLink.md)

Defined in: [src/utils/StaticMockLink.ts:35](https://github.com/bint-Eve/talawa-admin/blob/bb9ac170c0ec806cc5423650a66bbe110c3af5d9/src/utils/StaticMockLink.ts#L35)

#### Parameters

##### mockedResponses

readonly `MockedResponse`[]

##### addTypename

`boolean` = `true`

#### Returns

[`StaticMockLink`](StaticMockLink.md)

#### Overrides

`ApolloLink.constructor`

## Properties

### addTypename

> **addTypename**: `boolean` = `true`

Defined in: [src/utils/StaticMockLink.ts:32](https://github.com/bint-Eve/talawa-admin/blob/bb9ac170c0ec806cc5423650a66bbe110c3af5d9/src/utils/StaticMockLink.ts#L32)

***

### operation?

> `optional` **operation**: `Operation`

Defined in: [src/utils/StaticMockLink.ts:31](https://github.com/bint-Eve/talawa-admin/blob/bb9ac170c0ec806cc5423650a66bbe110c3af5d9/src/utils/StaticMockLink.ts#L31)

## Methods

### addMockedResponse()

> **addMockedResponse**(`mockedResponse`): `void`

Defined in: [src/utils/StaticMockLink.ts:45](https://github.com/bint-Eve/talawa-admin/blob/bb9ac170c0ec806cc5423650a66bbe110c3af5d9/src/utils/StaticMockLink.ts#L45)

#### Parameters

##### mockedResponse

`MockedResponse`

#### Returns

`void`

***

### request()

> **request**(`operation`): `any`

Defined in: [src/utils/StaticMockLink.ts:60](https://github.com/bint-Eve/talawa-admin/blob/bb9ac170c0ec806cc5423650a66bbe110c3af5d9/src/utils/StaticMockLink.ts#L60)

#### Parameters

##### operation

`any`

#### Returns

`any`
