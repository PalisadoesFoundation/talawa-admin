import React from 'react';
import styles from '../../style/app-fixed.module.css';
import LogoutIcon from '@mui/icons-material/Logout';
import useSession from 'utils/useSession';
import { REVOKE_REFRESH_TOKEN } from 'GraphQl/Mutations/mutations';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';

/**
 * Renders a sign out button.
 *
 * This component helps to logout.
 * The logout function revokes the refresh token and clears local storage before redirecting to the home page.

 *
 * @returns JSX.Element - The profile card .
 */

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
