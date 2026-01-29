/**
 * This component renders a user interface for deleting a user account.
 * It includes a card layout with a title, a message, and a delete button styled using Bootstrap and custom CSS.
 * The component utilizes internationalization (i18n) for text content.
 *
 *
 * @returns A functional React component that displays the delete user section.
 *
 * requires 
 * - react
 * - react-bootstrap/Card
 * - react-i18next/useTranslation
 * - style/app-fixed.module.css
 *
 * @example
 * ```
 * // Example usage:
 * import DeleteUser from './DeleteUser';
 *
 * function App() {
 *   return (
 *     <div>
 *       <DeleteUser />
 *     </div>
 *   );
 * }
 *```

 * @remarks
 * - The `useTranslation` hook is used to fetch localized strings with the key prefix `settings`.
 * - The `styles` object is imported from a CSS module for custom styling.
 * - The delete button is styled with the `danger` variant from Bootstrap.
 *
 */
import React from 'react';
import { Card } from 'react-bootstrap';
import Button from 'shared-components/Button';
import { useTranslation } from 'react-i18next';
import styles from './DeleteUser.module.css';

const DeleteUser: React.FC = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'settings' });
  return (
    <>
      <Card border="0" className="rounded-4 mb-4">
        <div className={styles.cardHeader}>
          <div className={styles.cardTitle}>{t('deleteUser')}</div>
        </div>
        <Card.Body className={styles.cardBody}>
          <p>{t('deleteUserMessage')}</p>
          <Button variant="danger">{t('deleteUser')}</Button>
        </Card.Body>
      </Card>
    </>
  );
};

export default DeleteUser;
