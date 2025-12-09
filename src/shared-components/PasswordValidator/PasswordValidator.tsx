import React from 'react';
import { Check, Clear } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import styles from 'style/app-fixed.module.css';
import { InterfacePasswordValidatorProps } from 'types/PasswordValidator/interface';
import ValidationItem from './ValidationItem';

/**
 * PasswordValidator Component
 *
 * Displays real-time password validation feedback
 *
 * @param {InterfacePasswordValidatorProps} props - Component props
 * @returns {JSX.Element} The rendered password validator
 *
 * @example
 * <PasswordValidator
 *   password={password}
 *   isInputFocused={focused}
 *   validation={validationState}
 * />
 */
const PasswordValidator: React.FC<InterfacePasswordValidatorProps> = ({
  password,
  isInputFocused,
  validation,
}) => {
  const { t } = useTranslation('translation', { keyPrefix: 'loginPage' });

  return (
    <div className={styles.password_checks} data-testid="passwordValidator">
      {isInputFocused ? (
        password.length < 6 ? (
          <div data-testid="passwordCheck">
            <p
              className={`form-text text-danger ${styles.password_check_element_top}`}
            >
              <span>
                <Clear />
              </span>
              {t('atleast_6_char_long')}
            </p>
          </div>
        ) : (
          <p
            className={`form-text text-success ${styles.password_check_element_top}`}
          >
            <span>
              <Check />
            </span>
            {t('atleast_6_char_long')}
          </p>
        )
      ) : null}

      {!isInputFocused && password.length > 0 && password.length < 6 && (
        <div
          className={`form-text text-danger ${styles.password_check_element}`}
          data-testid="passwordCheck"
        >
          <span>
            <Clear className="size-sm" />
          </span>
          {t('atleast_6_char_long')}
        </div>
      )}

      {isInputFocused && (
        <>
          <ValidationItem
            isValid={validation.lowercaseChar}
            text={t('lowercase_check')}
            className={styles.password_check_element}
          />
          <ValidationItem
            isValid={validation.uppercaseChar}
            text={t('uppercase_check')}
            className={styles.password_check_element}
          />
          <ValidationItem
            isValid={validation.numericValue}
            text={t('numeric_value_check')}
            className={styles.password_check_element}
          />
          <ValidationItem
            isValid={validation.specialChar}
            text={t('special_char_check')}
            className={`${styles.password_check_element} ${styles.password_check_element_bottom}`}
          />
        </>
      )}
    </div>
  );
};

export default PasswordValidator;
