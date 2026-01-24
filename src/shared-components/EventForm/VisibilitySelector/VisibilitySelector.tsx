/**
 * VisibilitySelector - Sub-component for event visibility radio buttons.
 * Allows selection between PUBLIC, ORGANIZATION, and INVITE_ONLY visibility.
 */
// translation-check-keyPrefix: common
import React from 'react';
import FormCheck from 'react-bootstrap/FormCheck';
import FormLabel from 'react-bootstrap/FormLabel';
import type { InterfaceVisibilitySelectorProps } from 'types/shared-components/VisibilitySelector/interface';

/**
 * Renders a radio button group for selecting event visibility.
 * @param props - Component props
 * @returns The visibility selector JSX
 */
const VisibilitySelector: React.FC<InterfaceVisibilitySelectorProps> = ({
  visibility,
  setVisibility,
  tCommon,
  disabled = false,
}) => {
  return (
    <div className="mb-3">
      <FormLabel className="fw-bold fs-5">
        {tCommon('eventVisibility')}
      </FormLabel>
      <div
        className="ms-3"
        role="radiogroup"
        aria-label={tCommon('eventVisibility')}
      >
        <FormCheck
          type="radio"
          id="visibility-public"
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
          className="mb-2"
          data-testid="visibilityPublicRadio"
          disabled={disabled}
        />
        <FormCheck
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
          className="mb-2"
          data-testid="visibilityOrgRadio"
          disabled={disabled}
        />
        <FormCheck
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
          className="mb-2"
          data-testid="visibilityInviteRadio"
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default VisibilitySelector;
