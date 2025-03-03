import React from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, useParams } from 'react-router-dom';
import GeneralSettings from 'components/OrgSettings/General/GeneralSettings';

/**
 * The `orgSettings` component provides a user interface for managing various settings related to an organization.
 * It includes options for updating organization details, deleting the organization, changing language preferences,
 * and managing custom fields and action item categories.
 *
 * The component renders different settings sections based on the user's selection from the tabs or dropdown menu.
 *
 * @returns The rendered component displaying the organization settings.
 */
function OrgSettings(): JSX.Element {
  // Translation hook for internationalization
  const { t } = useTranslation('translation', {
    keyPrefix: 'orgSettings',
  });

  document.title = t('title');

  // Get the organization ID from the URL parameters
  const { orgId } = useParams();

  if (!orgId) {
    return <Navigate to={'/'} replace />;
  }

  return (
    <div className="d-flex justify-content-between">
      <div data-testid="generalTab">
        <GeneralSettings orgId={orgId} />
      </div>
    </div>
  );
}

export default OrgSettings;
