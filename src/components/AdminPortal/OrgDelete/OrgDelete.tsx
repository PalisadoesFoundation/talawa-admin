/**
 * OrgDelete Component
 *
 * This component is responsible for rendering a message related to the deletion
 * of an organization. It utilizes the `react-i18next` library for internationalization
 * to display the message in the appropriate language based on the user's locale.
 *
 * @returns A React functional component that displays the organization
 * deletion message.
 *
 * @remarks
 * - The `useTranslation` hook is used to fetch the translated string for the key
 *   `deleteOrg` under the `orgDelete` key prefix in the `translation` namespace.
 * - The component is styled using the `search-OrgDelete` CSS class.
 *
 * @example
 * ```tsx
 * import OrgDelete from './OrgDelete';
 *
 * function App() {
 *   return (
 *     <div>
 *       <OrgDelete />
 *     </div>
 *   );
 * }
 * ```
 *
 *
 */
import React from 'react';
import { useTranslation } from 'react-i18next';

function orgDelete(): JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'orgDelete' });

  return (
    <>
      {/* Container for the organization deletion message */}
      <div id="OrgDelete" className="search-OrgDelete">
        {t('deleteOrg')}
      </div>
    </>
  );
}
export default orgDelete;
