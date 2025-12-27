/**
 * SignOut Component
 *
 * This component provides a user interface for signing out of the application.
 * It handles the logout process by calling the server's logout mutation which
 * clears HTTP-Only cookies and revokes refresh tokens.
 *
 * @remarks
 * - Uses the `useSession` hook to manage the user's session.
 * - Calls the `LOGOUT_MUTATION` via Apollo Client's `useMutation`.
 * - Redirects to the homepage using `useNavigate` from React Router.
 * - Handles logout errors gracefully with a retry mechanism.
 *
 * ### Dependencies
 * - `@mui/icons-material/Logout`: Logout icon.
 * - `utils/useSession`: Custom session hook.
 * - `GraphQl/Mutations/mutations`: Contains the mutation.
 * - `@apollo/client`: Handles GraphQL.
 * - `react-router-dom`: Navigation.
 *
 * ### CSS Modules
 * - `style/app-fixed.module.css`: Styles for the component.
 * ### Props
 * - `hideDrawer`: State to determine the visibility of the sidebar. `true` hides it, and `false` shows it.
 *
 * @returns A React component that renders a sign-out button with an icon.
 *
 * @example
 * ```tsx
 * import SignOut from './SignOut';
 *
 * function App() {
 *   return <SignOut />;
 * }
 * ```
 */
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from 'style/app-fixed.module.css';
import LogoutIcon from '@mui/icons-material/Logout';
import useSession from 'utils/useSession';
import { LOGOUT_MUTATION } from 'GraphQl/Mutations/mutations';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router';
import useLocalStorage from 'utils/useLocalstorage';

interface ISignOutProps {
  hideDrawer?: boolean; // Optional prop to conditionally render the button
}

const SignOut = ({ hideDrawer = false }: ISignOutProps): React.JSX.Element => {
  const { t } = useTranslation('translation', { keyPrefix: 'common' });
  const { endSession } = useSession();
  const [logout] = useMutation(LOGOUT_MUTATION);
  const navigate = useNavigate();
  const { clearAllItems } = useLocalStorage();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async (): Promise<void> => {
    if (isLoggingOut) return; // Prevent multiple clicks
    setIsLoggingOut(true);

    const handleSignOut = (): void => {
      clearAllItems();
      endSession();
      navigate('/');
    };

    try {
      // Call logout mutation - this clears HTTP-Only cookies on the server
      await logout();
      handleSignOut();
    } catch (error) {
      console.error('Error during logout:', error);
      const retryLogout = window.confirm(t('retryPrompt'));
      if (retryLogout) {
        try {
          await logout();
          handleSignOut();
        } catch {
          // Proceed with local logout if retry fails
          console.error('Logout retry failed');
          handleSignOut();
        }
      } else {
        handleSignOut();
      }
    } finally {
      // Reset loading state if component is still mounted (e.g., navigation failed)
      setIsLoggingOut(false);
    }
  };

  return (
    <div
      className={`${styles.signOutContainer} ${isLoggingOut ? styles.signOutDisabled : ''}`}
      onClick={() => {
        if (isLoggingOut) return; // Early-return when disabled
        handleLogout();
      }}
      onKeyDown={(e) => {
        // Block keyboard activation when disabled
        if (isLoggingOut) return;
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleLogout();
        }
      }}
      role="button"
      tabIndex={isLoggingOut ? -1 : 0}
      aria-label={t('signOut')}
      aria-disabled={isLoggingOut}
      data-testid="signOutBtn"
    >
      <div data-testid="LogoutIconid">
        <LogoutIcon />
      </div>
      <div className={`${styles.signOutButton} ${styles.sidebarText}`}>
        {hideDrawer ? '' : isLoggingOut ? t('signingOut') : t('signOut')}
      </div>
    </div>
  );
};

export default SignOut;
