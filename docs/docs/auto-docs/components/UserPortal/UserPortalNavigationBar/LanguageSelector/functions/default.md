[**talawa-admin**](../../../../../README.md)

***

# Function: default()

> **default**(`props`): `Element`

Defined in: [src/components/UserPortal/UserPortalNavigationBar/LanguageSelector.tsx:51](https://github.com/Anshikaaa06/talawa-admin/blob/9e54ad8a0be6c052a435c30f5a6bbbad9b905bb5/src/components/UserPortal/UserPortalNavigationBar/LanguageSelector.tsx#L51)

LanguageSelector Component

## Parameters

### props

[`InterfaceLanguageSelectorProps`](../../../../../UserPortalNavigationBar/interface/interfaces/InterfaceLanguageSelectorProps.md)

Component props

## Returns

`Element`

The rendered language selector dropdown, or null if showLanguageSelector is false

## Description

Renders a dropdown menu for language selection with flag icons and language names.
Displays all available languages from the languages utility and automatically disables
the currently selected language. Integrates with i18next for internationalization.

## Component

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

 - [InterfaceLanguageSelectorProps](../../../../../UserPortalNavigationBar/interface/interfaces/InterfaceLanguageSelectorProps.md) for detailed prop type definitions
 - [languages](../../../../../utils/languages/variables/languages.md) for the list of supported languages
