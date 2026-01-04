import React from 'react';
import { useTranslation } from 'react-i18next';
import { PASSWORD_REGEX } from '../../../utils/validators/authValidators';
import type { InterfacePasswordStrengthIndicatorProps } from '../../../types/Auth/PasswordStrengthIndicator/interface';
import { RequirementRow } from './RequirementRow';

/**
 * PasswordStrengthIndicator displays a visual checklist of password requirements.
 *
 * @remarks
 * Shows real-time feedback for password complexity requirements including
 * minimum length, lowercase, uppercase, numeric, and special characters.
 *
 * @param props - Component props
 * @returns Password strength indicator or null if not visible
 */
export const PasswordStrengthIndicator: React.FC<
  InterfacePasswordStrengthIndicatorProps
> = ({ password, isVisible = true }) => {
  const { t } = useTranslation('auth');

  if (!isVisible) return null;

  const checks = {
    minLen: password.length >= 8,
    lower: PASSWORD_REGEX.lowercase.test(password),
    upper: PASSWORD_REGEX.uppercase.test(password),
    num: PASSWORD_REGEX.numeric.test(password),
    special: PASSWORD_REGEX.specialChar.test(password),
  };

  return (
    <div role="status" aria-live="polite">
      <RequirementRow ok={checks.minLen} text={t('requirementMinLength')} />
      <RequirementRow ok={checks.lower} text={t('requirementLowercase')} />
      <RequirementRow ok={checks.upper} text={t('requirementUppercase')} />
      <RequirementRow ok={checks.num} text={t('requirementNumber')} />
      <RequirementRow ok={checks.special} text={t('requirementSpecialChar')} />
    </div>
  );
};
