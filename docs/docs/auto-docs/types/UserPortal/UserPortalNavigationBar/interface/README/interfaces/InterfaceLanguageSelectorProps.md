[Admin Docs](/)

***

# Interface: InterfaceLanguageSelectorProps

Defined in: [src/types/UserPortal/UserPortalNavigationBar/interface.ts:173](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/UserPortalNavigationBar/interface.ts#L173)

Props interface for LanguageSelector subcomponent

Defines properties for the language selection dropdown that allows users
to switch between available interface languages (en, fr, hi, es, zh).

## Properties

### currentLanguageCode?

> `optional` **currentLanguageCode**: `string`

Defined in: [src/types/UserPortal/UserPortalNavigationBar/interface.ts:197](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/UserPortalNavigationBar/interface.ts#L197)

Current selected language code

***

### dropDirection?

> `optional` **dropDirection**: `"start"` \| `"end"` \| `"up"` \| `"down"`

Defined in: [src/types/UserPortal/UserPortalNavigationBar/interface.ts:187](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/UserPortalNavigationBar/interface.ts#L187)

Dropdown menu direction

***

### handleLanguageChange()

> **handleLanguageChange**: (`languageCode`) => `void` \| `Promise`\<`void`\>

Defined in: [src/types/UserPortal/UserPortalNavigationBar/interface.ts:192](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/UserPortalNavigationBar/interface.ts#L192)

Handler called when a language is selected

#### Parameters

##### languageCode

`string`

#### Returns

`void` \| `Promise`\<`void`\>

***

### showLanguageSelector?

> `optional` **showLanguageSelector**: `boolean`

Defined in: [src/types/UserPortal/UserPortalNavigationBar/interface.ts:177](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/UserPortalNavigationBar/interface.ts#L177)

Whether to display the language selector dropdown

***

### testIdPrefix?

> `optional` **testIdPrefix**: `string`

Defined in: [src/types/UserPortal/UserPortalNavigationBar/interface.ts:182](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/UserPortalNavigationBar/interface.ts#L182)

Prefix for test IDs
