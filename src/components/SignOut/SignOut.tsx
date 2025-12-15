/**
 * SignOut Component
 *
 * This component provides a user interface for signing out of the application.
 * It handles the revocation of the user's refresh token and clears the session data.
 * If the token revocation fails, it provides an option to retry or proceed with a local logout.
 *
 * @remarks
 * - Uses the `useSession` hook to manage the user's session.
 * - Calls the `REVOKE_REFRESH_TOKEN` mutation via Apollo Client's `useMutation`.
 * - Redirects to the homepage using `useNavigate` from React Router.
 * - Handles token revocation errors with a retry mechanism.
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
import React from 'react';
import styles from 'style/app-fixed.module.css';
import LogoutIcon from '@mui/icons-material/Logout';
import useSession from 'utils/useSession';
import { REVOKE_REFRESH_TOKEN } from 'GraphQl/Mutations/mutations';
import { useMutation } from '@apollo/client/react';
import { useNavigate } from 'react-router';

interface ISignOutProps {
  hideDrawer?: boolean; // Optional prop to conditionally render the button
}

const SignOut = ({ hideDrawer = false }: ISignOutProps): React.JSX.Element => {
  const { endSession } = useSession();
  const [revokeRefreshToken] = useMutation(REVOKE_REFRESH_TOKEN);
  const navigate = useNavigate();

  const logout = async (): Promise<void> => {
    const handleSignOut = (): void => {
      localStorage.clear();
      endSession();
      navigate('/');
    };

    try {
      await revokeRefreshToken();
      handleSignOut();
    } catch (error) {
      console.error('Error revoking refresh token:', error);
      const retryRevocation = window.confirm(
        'Failed to revoke session. Retry?',
      );
      if (retryRevocation) {
        try {
          await revokeRefreshToken();
          handleSignOut();
        } catch {
          // Proceed with local logout if retry fails
          console.error('Token revocation retry failed');
          handleSignOut();
        }
      } else {
        handleSignOut();
      }
    }
  };
  return (
    <div
      className={styles.signOutContainer}
      onClick={logout}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          logout();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label="Sign out"
      data-testid="signOutBtn"
    >
      <div data-testid="LogoutIconid">
        <LogoutIcon />
      </div>
      <div className={`${styles.signOutButton} ${styles.sidebarText}`}>
        {hideDrawer ? '' : 'Sign Out'}
      </div>
    </div>
  );
};

export default SignOut;
