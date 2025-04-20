/**
 * SignOut Component
 * @description This component provides a user interface for signing out of the application.
 * It handles the revocation of the user's refresh token and clears the session data.
 * If the token revocation fails, it provides an option to retry or proceed with a local logout.
 *
 * @component
 * @returns {JSX.Element} A React component that renders a sign-out button with an icon.
 *
 * @description
 * - This component uses the `useSession` hook to manage the user's session.
 * - It uses the `useMutation` hook from Apollo Client to call the `REVOKE_REFRESH_TOKEN` mutation.
 * - The `useNavigate` hook from React Router is used to redirect the user to the home page after logout.
 * - Handles errors during token revocation and provides a retry mechanism.
 *
 * @example
 * ```tsx
 * import SignOut from './SignOut';
 *
 * function App() {
 *   return <SignOut />;
 * }
 * ```
 *
 * @dependencies
 * - `@mui/icons-material/Logout`: For rendering the logout icon.
 * - `utils/useSession`: Custom hook for session management.
 * - `GraphQl/Mutations/mutations`: Contains the `REVOKE_REFRESH_TOKEN` mutation.
 * - `@apollo/client`: For GraphQL mutation handling.
 * - `react-router-dom`: For navigation after logout.
 *
 * @cssModule
 * - `style/app-fixed.module.css`: Contains styles for the sign-out button and container.
 */
import React from 'react';
import styles from 'style/app-fixed.module.css';
import LogoutIcon from '@mui/icons-material/Logout';
import useSession from 'utils/useSession';
import { REVOKE_REFRESH_TOKEN } from 'GraphQl/Mutations/mutations';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router';

const SignOut = (): JSX.Element => {
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
    <div className={styles.signOutContainer}>
      <LogoutIcon />
      <button
        className={styles.signOutButton}
        onClick={logout}
        aria-label="Sign out"
      >
        Sign Out
      </button>
    </div>
  );
};

export default SignOut;
