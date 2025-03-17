import { authClient } from 'lib/auth-client';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

type UseSessionReturnType = {
  listSession: () => Promise<
    Awaited<ReturnType<typeof authClient.listSessions>>
  >;
  revokeOtherSessionExceptCurrentSession: () => Promise<void>;
  revokeAllSession: () => Promise<void>;
  handleLogout: () => void; //for when logged in already, simply extend session
};

/**
 * Custom hook for managing user session timeouts in a React application.
 *
 * This hook handles:
 * - Starting and ending the user session.
 * - Displaying a warning toast at half of the session timeout duration.
 * - Logging the user out and displaying a session expiration toast when the session times out.
 * - Automatically resetting the timers when user activity is detected.
 * - Pausing session timers when the tab is inactive and resuming them when it becomes active again.
 *
 * @returns UseSessionReturnType - An object with methods to start and end the session, and to handle logout.
 */
const useSession = (): UseSessionReturnType => {
  const { t: tCommon } = useTranslation('common');
  const navigate = useNavigate();

  //in this way we can access the session of a user in client side uncomment this when it is required
  // const { data: session, isPending, error, refetch } = authClient.useSession();

  //List all active session
  const listSession = async (): Promise<
    Awaited<ReturnType<typeof authClient.listSessions>>
  > => {
    try {
      const sessions = await authClient.listSessions();
      return sessions;
    } catch (error) {
      toast.error(tCommon('sessionListingFailed'));
      throw error;
    }
  };
  //it will revoke all active session except the current session
  const revokeOtherSessionExceptCurrentSession = async (): Promise<void> => {
    try {
      await authClient.revokeOtherSessions();
    } catch (error) {
      toast.error(tCommon('revokeOtherSessionsFailed'));
      throw error;
    }
  };

  //it will revoke all session with current session
  const revokeAllSession = async (): Promise<void> => {
    try {
      await authClient.revokeSessions();
    } catch (error) {
      toast.error(tCommon('revokeAllSessionsFailed'));
      throw error;
    }
  };
  //it will logout the user so it will automatically  revoke its current session
  const handleLogout = async (): Promise<void> => {
    localStorage.clear();
    await authClient.signOut();
    navigate('/');
  };

  return {
    listSession,
    revokeOtherSessionExceptCurrentSession,
    revokeAllSession,
    handleLogout,
  };
};

export default useSession;
