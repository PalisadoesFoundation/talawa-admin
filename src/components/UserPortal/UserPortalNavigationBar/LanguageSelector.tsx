import { Dropdown } from 'react-bootstrap';
import LanguageIcon from '@mui/icons-material/Language';
import { InterfaceLanguageSelectorProps } from 'types/UserPortalNavigationBar/interface';
import styles from './UserPortalNavigationBar.module.css';
import { languages } from 'utils/languages';

const LanguageSelector = (
  props: InterfaceLanguageSelectorProps,
): JSX.Element | null => {
  const {
    showLanguageSelector,
    testIdPrefix,
    dropDirection,
    handleLanguageChange,
    currentLanguageCode,
  } = props;
  if (!showLanguageSelector) return null;

  return (
    <Dropdown
      data-testid={`${testIdPrefix}languageDropdown`}
      drop={dropDirection}
    >
      <Dropdown.Toggle
        variant="white"
        id="dropdown-basic"
        data-testid={`${testIdPrefix}languageDropdownToggle`}
        className={styles.colorWhite}
      >
        <LanguageIcon
          className={styles.colorWhite}
          data-testid={`${testIdPrefix}languageIcon`}
        />
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {languages.map((language, index: number) => (
          <Dropdown.Item
            key={index}
            onClick={async (): Promise<void> => {
              await handleLanguageChange(language.code);
            }}
            disabled={currentLanguageCode === language.code}
            data-testid={`${testIdPrefix}changeLanguageBtn${index}`}
          >
            <span className={`fi fi-${language.country_code} mr-2`}></span>{' '}
            {language.name}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};
export default LanguageSelector;
