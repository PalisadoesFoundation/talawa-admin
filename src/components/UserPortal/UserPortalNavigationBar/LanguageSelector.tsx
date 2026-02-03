import LanguageIcon from '@mui/icons-material/Language';
import { InterfaceLanguageSelectorProps } from 'types/UserPortal/UserPortalNavigationBar/interface';
import styles from './LanguageSelector.module.css';
import { languages } from 'utils/languages';
import { useTranslation } from 'react-i18next';
import DropDownButton from 'shared-components/DropDownButton';
/**
 * LanguageSelector Component
 *
 * Renders a dropdown menu for language selection with flag icons and language names.
 * Displays all available languages from the languages utility and automatically disables
 * the currently selected language. Integrates with i18next for internationalization.
 *
 *
 * @param showLanguageSelector - Whether to display the selector (returns null if false)
 * @param testIdPrefix - Prefix for test IDs to ensure unique identifiers across instances
 * @param dropDirection - Direction the dropdown menu opens relative to toggle
 * @param handleLanguageChange - Async callback executed when user selects a language
 * @param currentLanguageCode - ISO 639-1 language code of the currently active language (e.g., 'en', 'es', 'fr')
 *
 * @returns The rendered language selector dropdown, or null if showLanguageSelector is false
 *
 * @example
 * ```tsx
 * const handleLanguageChange = async (languageCode: string) => {
 *   await i18next.changeLanguage(languageCode);
 *   cookies.set('i18next', languageCode);
 * };
 *
 * <LanguageSelector
 *   showLanguageSelector={true}
 *   testIdPrefix="navbar"
 *   dropDirection="start"
 *   handleLanguageChange={handleLanguageChange}
 *   currentLanguageCode="en"
 * />
 * ```
 *
 * @remarks
 * - Language options are populated from the `languages` utility array
 * - Each language option displays a country flag using flag-icons CSS library
 * - The current language option is automatically disabled to prevent redundant selection
 * - Supports async language change handlers for i18next integration
 *
 * @see {@link InterfaceLanguageSelectorProps} for detailed prop type definitions
 * @see {@link languages} for the list of supported languages
 */
const LanguageSelector = (
  props: InterfaceLanguageSelectorProps,
): JSX.Element | null => {
  const {
    showLanguageSelector,
    testIdPrefix,
    handleLanguageChange,
    currentLanguageCode,
    dropDirection,
  } = props;
  const { t: tCommon } = useTranslation('common');
  if (!showLanguageSelector) return null;

  const languageOptions = languages.map((language) => ({
    value: language.code,
    label: language.name,
    disabled: currentLanguageCode === language.code,
  }));

  return (
    <DropDownButton
      // i18n-ignore-next-line
      id={`${testIdPrefix || ''}language-dropdown`}
      options={languageOptions}
      selectedValue={currentLanguageCode}
      drop={dropDirection}
      onSelect={handleLanguageChange}
      // i18n-ignore-next-line
      dataTestIdPrefix={`${testIdPrefix || ''}language`}
      variant="light"
      btnStyle={styles.colorWhite}
      icon={
        <LanguageIcon
          className={styles.colorWhite}
          data-testid={`${testIdPrefix || ''}languageIcon`}
        />
      }
      ariaLabel={tCommon('selectLanguage')}
      placeholder=""
    />
  );
};
export default LanguageSelector;
