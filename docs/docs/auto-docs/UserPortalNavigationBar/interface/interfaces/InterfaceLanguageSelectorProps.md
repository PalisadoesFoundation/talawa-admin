[**talawa-admin**](../../../README.md)

***

# Interface: InterfaceLanguageSelectorProps

Defined in: [src/types/UserPortalNavigationBar/interface.ts:181](https://github.com/MonishPuttu/talawa-admin/blob/4630ca9b3a05c039a7c82f0e137454f2802795b4/src/types/UserPortalNavigationBar/interface.ts#L181)

Props interface for LanguageSelector subcomponent

## Description

Defines properties for the language selection dropdown that allows users
to switch between available interface languages (en, fr, hi, es, zh).

## Properties

### currentLanguageCode?

> `optional` **currentLanguageCode**: `string`

Defined in: [src/types/UserPortalNavigationBar/interface.ts:186](https://github.com/MonishPuttu/talawa-admin/blob/4630ca9b3a05c039a7c82f0e137454f2802795b4/src/types/UserPortalNavigationBar/interface.ts#L186)

Currently active language code

***

### dropDirection?

> `optional` **dropDirection**: `"start"` \| `"end"` \| `"up"` \| `"down"`

Defined in: [src/types/UserPortalNavigationBar/interface.ts:184](https://github.com/MonishPuttu/talawa-admin/blob/4630ca9b3a05c039a7c82f0e137454f2802795b4/src/types/UserPortalNavigationBar/interface.ts#L184)

Direction for dropdown menu

***

### handleLanguageChange()

> **handleLanguageChange**: (`languageCode`) => `void` \| `Promise`\<`void`\>

Defined in: [src/types/UserPortalNavigationBar/interface.ts:185](https://github.com/MonishPuttu/talawa-admin/blob/4630ca9b3a05c039a7c82f0e137454f2802795b4/src/types/UserPortalNavigationBar/interface.ts#L185)

Handler called when language is selected

#### Parameters

##### languageCode

`string`

#### Returns

`void` \| `Promise`\<`void`\>

***

### showLanguageSelector?

> `optional` **showLanguageSelector**: `boolean`

Defined in: [src/types/UserPortalNavigationBar/interface.ts:182](https://github.com/MonishPuttu/talawa-admin/blob/4630ca9b3a05c039a7c82f0e137454f2802795b4/src/types/UserPortalNavigationBar/interface.ts#L182)

Whether to display the language selector

***

### testIdPrefix?

> `optional` **testIdPrefix**: `string`

Defined in: [src/types/UserPortalNavigationBar/interface.ts:183](https://github.com/MonishPuttu/talawa-admin/blob/4630ca9b3a05c039a7c82f0e137454f2802795b4/src/types/UserPortalNavigationBar/interface.ts#L183)

Prefix for test IDs
