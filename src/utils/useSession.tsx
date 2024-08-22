import { useMutation, useQuery } from '@apollo/client';
import { REVOKE_REFRESH_TOKEN } from 'GraphQl/Mutations/mutations';
import { GET_COMMUNITY_SESSION_TIMEOUT_DATA } from 'GraphQl/Queries/Queries';
import { t } from 'i18next';
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { errorHandler } from 'utils/errorHandler';

type UseSessionReturnType = {
  startSession: () => void;
  endSession: () => void;
  handleLogout: () => void;
};

/**
 * Custom hook for managing user session timeouts in a React application.
 *
 * This hook handles:
 * - Starting and ending the user session.
 * - Displaying a warning toast at half of the session timeout duration.
 * - Logging the user out and displaying a session expiration toast when the session times out.
 * - Automatically resetting the timers when user activity is detected.
 *
 * @returns UseSessionReturnType - An object with methods to start and end the session, and to handle logout.
 */
const useSession = (): UseSessionReturnType => {
  const [sessionTimeout, setSessionTimeout] = useState<number>(30);
  const sessionTimerRef = useRef<NodeJS.Timeout | null>(null);
  const warningTimerRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

  const [revokeRefreshToken] = useMutation(REVOKE_REFRESH_TOKEN);
  const { data, error: queryError } = useQuery(
    GET_COMMUNITY_SESSION_TIMEOUT_DATA,
  );

  /**
   * Effect that runs on initial mount to fetch session timeout data and set the session timeout state.
   * If the query fails, an error handler is invoked.
   */
  useEffect(() => {
    if (queryError) {
      errorHandler(t, queryError as Error);
    } else {
      const sessionTimeoutData = data?.getCommunityData;

      if (sessionTimeoutData) {
        setSessionTimeout(sessionTimeoutData.timeout);
      }
    }
  }, [data, queryError]);

  /**
   * Resets the session and warning timers by clearing any existing timeouts.
   */
  const resetTimers = (): void => {
    if (sessionTimerRef.current) clearTimeout(sessionTimerRef.current);
    if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
  };

  /**
   * Ends the session by clearing timers and removing event listeners for user activity.
   */
  const endSession = (): void => {
    resetTimers();
    window.removeEventListener('mousemove', extendSession);
    window.removeEventListener('keydown', extendSession);
  };

  /**
   * Handles user logout, revoking the refresh token and clearing local storage.
   * Displays a toast notification about session expiration and redirects the user to the login page.
   */
  const handleLogout = async (): Promise<void> => {
    try {
      await revokeRefreshToken();
    } catch (error) {
      console.error('Error revoking refresh token:', error);
      toast.error('Failed to revoke session. Please try again.');
    }
    localStorage.clear();
    endSession();
    navigate('/');
    toast.warning(
      'Your session has expired due to inactivity. Please log in again to continue.',
      { autoClose: false },
    );
  };

  /**
   * Initializes the session and warning timers based on the current session timeout duration.
   * Displays a warning toast at half the session timeout duration and logs the user out at the end of the session.
   */
  const initializeTimers = (): void => {
    const warningTime = sessionTimeout / 2;
    const sessionTimeoutInMilliseconds = sessionTimeout * 60 * 1000;
    const warningTimeInMilliseconds = warningTime * 60 * 1000;

    warningTimerRef.current = setTimeout(() => {
      toast.warning(
        'Your session will expire soon due to inactivity. Please interact with the page to extend your session.',
      );
    }, warningTimeInMilliseconds);

    sessionTimerRef.current = setTimeout(() => {
      handleLogout();
    }, sessionTimeoutInMilliseconds);
  };

  /**
   * Extends the session by resetting the timers and initializing them again.
   * This function is triggered by user activity such as mouse movement or key presses.
   */
  const extendSession = (): void => {
    resetTimers();
    initializeTimers();
  };

  /**
   * Starts the session by initializing timers and adding event listeners for user activity.
   * Resets the timers whenever user activity is detected.
   */
  const startSession = (): void => {
    resetTimers();
    initializeTimers();
    window.addEventListener('mousemove', extendSession);
    window.addEventListener('keydown', extendSession);
  };

  /**
   * Effect that runs on component unmount to end the session and clean up resources.
   */
  useEffect(() => {
    return () => endSession();
  }, []);

  return { startSession, endSession, handleLogout };
};

export default useSession;
