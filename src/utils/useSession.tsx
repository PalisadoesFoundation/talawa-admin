import { useMutation, useQuery } from '@apollo/client';
import { REVOKE_REFRESH_TOKEN } from 'GraphQl/Mutations/mutations';
import { GET_COMMUNITY_SESSION_TIMEOUT_DATA } from 'GraphQl/Queries/Queries';
import { t } from 'i18next';
import { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { errorHandler } from 'utils/errorHandler';

type UseSessionReturnType = {
  startSession: () => void;
  endSession: () => void;
  handleLogout: () => void;
  extendSession: () => void; //for when logged in already, simply extend session
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

  let startTime: number;
  let timeoutDuration: number;
  const [sessionTimeout, setSessionTimeout] = useState<number>(30);
  // const sessionTimeout = 30;
  const sessionTimerRef = useRef<NodeJS.Timeout | null>(null);
  const warningTimerRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

  const [revokeRefreshToken] = useMutation(REVOKE_REFRESH_TOKEN);
  const { data, error: queryError } = useQuery(
    GET_COMMUNITY_SESSION_TIMEOUT_DATA,
  );

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

  const resetTimers = (): void => {
    if (sessionTimerRef.current) clearTimeout(sessionTimerRef.current);
    if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
  };

  const endSession = (): void => {
    resetTimers();
    window.removeEventListener('mousemove', extendSession);
    window.removeEventListener('keydown', extendSession);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  };

  const handleLogout = async (): Promise<void> => {
    try {
      await revokeRefreshToken();
    } catch (error) {
      console.error('Error revoking refresh token:', error);
      // toast.error('Failed to revoke session. Please try again.');
    }
    localStorage.clear();
    endSession();
    navigate('/');
    toast.warning(tCommon('sessionLogout'), { autoClose: false });
  };

  const initializeTimers = (
    timeLeft?: number,
    warningTimeLeft?: number,
  ): void => {
    const warningTime = warningTimeLeft ?? sessionTimeout / 2;
    const sessionTimeoutInMilliseconds =
      (timeLeft || sessionTimeout) * 60 * 1000;
    const warningTimeInMilliseconds = warningTime * 60 * 1000;

    timeoutDuration = sessionTimeoutInMilliseconds;
    startTime = Date.now();

    warningTimerRef.current = setTimeout(() => {
      toast.warning(tCommon('sessionWarning'));
    }, warningTimeInMilliseconds);

    sessionTimerRef.current = setTimeout(async () => {
      await handleLogout();
    }, sessionTimeoutInMilliseconds);
  };

  const extendSession = (): void => {
    resetTimers();
    initializeTimers();
  };

  const startSession = (): void => {
    resetTimers();
    initializeTimers();
    window.removeEventListener('mousemove', extendSession);
    window.removeEventListener('keydown', extendSession);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('mousemove', extendSession);
    window.addEventListener('keydown', extendSession);
    document.addEventListener('visibilitychange', handleVisibilityChange);
  };

  const handleVisibilityChange = async (): Promise<void> => {
    if (document.visibilityState === 'hidden') {
      window.removeEventListener('mousemove', extendSession);
      window.removeEventListener('keydown', extendSession);
      resetTimers(); // Optionally reset timers to prevent them from running in the background
    } else if (document.visibilityState === 'visible') {
      window.removeEventListener('mousemove', extendSession);
      window.removeEventListener('keydown', extendSession); // Ensure no duplicates
      window.addEventListener('mousemove', extendSession);
      window.addEventListener('keydown', extendSession);

      // Calculate remaining time now that the tab is active again
      const elapsedTime = Date.now() - startTime;
      const remainingTime = timeoutDuration - elapsedTime;

      const remainingSessionTime = Math.max(remainingTime, 0); // Ensures the remaining time is non-negative and measured in ms;

      if (remainingSessionTime > 0) {
        // Calculate remaining warning time only if session time is positive
        const remainingWarningTime = Math.max(remainingSessionTime / 2, 0);
        initializeTimers(
          remainingSessionTime / 60 / 1000,
          remainingWarningTime / 60 / 1000,
        );
      } else {
        // Handle session expiration immediately if time has run out
        await handleLogout();
      }
    }
  };

  useEffect(() => {
    return () => {
      endSession();
    };
  }, []);

  return {
    startSession,
    endSession,
    handleLogout,
    extendSession,
  };
};

export default useSession;
