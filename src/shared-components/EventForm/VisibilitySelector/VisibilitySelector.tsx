// translation-check-keyPrefix: common
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FormCheckField } from 'shared-components/FormFieldGroup/FormCheckField';
import type { InterfaceVisibilitySelectorProps } from 'types/shared-components/VisibilitySelector/interface';

import styles from './VisibilitySelector.module.css';

/**
 * Renders a radio button group for selecting event visibility.
 * @param props - Component props
 * @returns The visibility selector JSX
 */
const VisibilitySelector: React.FC<InterfaceVisibilitySelectorProps> = ({
  visibility,
  setVisibility,
  disabled = false,
}) => {
  const { t: tCommon } = useTranslation('common');
  return (
    <fieldset className="mb-3" aria-label={tCommon('eventVisibility')}>
      <legend className={`form-label ${styles.visibilityLabel}`}>
        {tCommon('eventVisibility')}
      </legend>
      <div className="ms-3">
        <FormCheckField
          type="radio"
          id="visibility-public"
          inline
          label={
            <div>
              <strong>{tCommon('publicEvent')}</strong>
              <div className="text-muted small">
                {tCommon('publicEventDescription')}
              </div>
            </div>
          }
          name="eventVisibility"
          checked={visibility === 'PUBLIC'}
          onChange={() => setVisibility('PUBLIC')}
          className={styles.visibilityOption}
          data-testid="visibilityPublicRadio"
          disabled={disabled}
        />
        <FormCheckField
          type="radio"
          id="visibility-org"
          label={
            <div>
              <strong>{tCommon('organizationEvent')}</strong>
              <div className="text-muted small">
                {tCommon('organizationEventDescription')}
              </div>
            </div>
          }
          name="eventVisibility"
          checked={visibility === 'ORGANIZATION'}
          onChange={() => setVisibility('ORGANIZATION')}
          className={styles.visibilityOption}
          data-testid="visibilityOrgRadio"
          disabled={disabled}
        />
        <FormCheckField
          type="radio"
          id="visibility-invite"
          label={
            <div>
              <strong>{tCommon('inviteOnlyEvent')}</strong>
              <div className="text-muted small">
                {tCommon('inviteOnlyEventDescription')}
              </div>
            </div>
          }
          name="eventVisibility"
          checked={visibility === 'INVITE_ONLY'}
          onChange={() => setVisibility('INVITE_ONLY')}
          className={styles.visibilityOption}
          data-testid="visibilityInviteRadio"
          disabled={disabled}
        />
      </div>
    </fieldset>
  );
};

export default VisibilitySelector;
