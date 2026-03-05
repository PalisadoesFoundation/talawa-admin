[Admin Docs](/)

***

# Function: default()

> **default**(`props`): `Element`

Defined in: [src/components/UserPortal/UserPortalNavigationBar/LanguageSelector.tsx:48](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/UserPortal/UserPortalNavigationBar/LanguageSelector.tsx#L48)

LanguageSelector Component

Renders a dropdown menu for language selection with flag icons and language names.
Displays all available languages from the languages utility and automatically disables
the currently selected language. Integrates with i18next for internationalization.

## Parameters

### props

[`InterfaceLanguageSelectorProps`](../../../../../types/UserPortal/UserPortalNavigationBar/interface/interfaces/InterfaceLanguageSelectorProps.md)

## Returns

`Element`

The rendered language selector dropdown, or null if showLanguageSelector is false

## Example

```tsx
const handleLanguageChange = async (languageCode: string) => {
  await i18next.changeLanguage(languageCode);
  cookies.set('i18next', languageCode);
};

<LanguageSelector
  showLanguageSelector={true}
  testIdPrefix="navbar"
  dropDirection="start"
  handleLanguageChange={handleLanguageChange}
  currentLanguageCode="en"
/>
```

## Remarks

- Language options are populated from the `languages` utility array
- Each language option displays a country flag using flag-icons CSS library
- The current language option is automatically disabled to prevent redundant selection
- Supports async language change handlers for i18next integration

## See

 - [InterfaceLanguageSelectorProps](../../../../../types/UserPortal/UserPortalNavigationBar/interface/interfaces/InterfaceLanguageSelectorProps.md) for detailed prop type definitions
 - [languages](../../../../../utils/languages/variables/languages.md) for the list of supported languages
