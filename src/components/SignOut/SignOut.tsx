import styles from '../../style/app-fixed.module.css';
import LogoutIcon from '@mui/icons-material/Logout';
import useSession from 'utils/useSession';
import { REVOKE_REFRESH_TOKEN } from 'GraphQl/Mutations/mutations';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router';

/**
 * Renders a sign out button.
 *
 * This component helps to logout.
 * The logout function revokes the refresh token and clears local storage before redirecting to the home page.

 *
 * @returns JSX.Element - The profile card .
 */

const SignOut = (): JSX.Element => {
  const { handleLogout } = useSession();
  return (
    <div className={styles.signOutContainer}>
      <LogoutIcon />
      <button
        className={styles.signOutButton}
        onClick={handleLogout}
        aria-label="Sign out"
      >
        Sign Out
      </button>
    </div>
  );
};

export default SignOut;
