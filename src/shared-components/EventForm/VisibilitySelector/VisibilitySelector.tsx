/**
 * VisibilitySelector - Sub-component for event visibility radio buttons.
 * Allows selection between PUBLIC, ORGANIZATION, and INVITE_ONLY visibility.
 */
// translation-check-keyPrefix: common
import React from 'react';
import { Form } from 'react-bootstrap';
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
}) => {
  return (
    <div className="mb-3">
      <Form.Label>{tCommon('eventVisibility')}</Form.Label>
      <div className="ms-3">
        <Form.Check
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
        />
        <Form.Check
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
        />
        <Form.Check
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
        />
      </div>
    </div>
  );
};

export default VisibilitySelector;
