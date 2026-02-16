import { useMutation, useQuery } from '@apollo/client';
import { LOGOUT_MUTATION } from 'GraphQl/Mutations/mutations';
import { GET_COMMUNITY_SESSION_TIMEOUT_DATA_PG } from 'GraphQl/Queries/Queries';
import { t } from 'i18next';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { NotificationToast } from 'shared-components/NotificationToast/NotificationToast';
import { errorHandler } from 'utils/errorHandler';
import useLocalStorage from 'utils/useLocalstorage';

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

  const startTimeRef = useRef<number>(0);
  const timeoutDurationRef = useRef<number>(0);
  const [sessionTimeout, setSessionTimeout] = useState<number>(30);
  const sessionTimerRef = useRef<NodeJS.Timeout | null>(null);
  const warningTimerRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

  const [logout] = useMutation(LOGOUT_MUTATION);
  const { data, error: queryError } = useQuery(
    GET_COMMUNITY_SESSION_TIMEOUT_DATA_PG,
  );

  const { clearAllItems } = useLocalStorage();

  useEffect(() => {
    if (queryError) {
      errorHandler(t, queryError as Error);
    } else {
      const sessionTimeoutData = data?.community;
      if (sessionTimeoutData) {
        setSessionTimeout(sessionTimeoutData.inactivityTimeoutDuration);
      }
    }
  }, [data, queryError]);

  const resetTimers = (): void => {
    if (sessionTimerRef.current) clearTimeout(sessionTimerRef.current);
    if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
  };

  /*
   * Refs used to create stable event listener callbacks.
   * This ensures that addEventListener and removeEventListener always refer
   * to the same function identity, preventing stale closure issues or
   * failure to remove listeners.
   */
  const extendSessionRef = useRef<() => void>(() => {});
  const handleVisibilityChangeRef = useRef<() => Promise<void>>(async () => {});
  const mountedRef = useRef(true);
  const throttledExtendSessionRef = useRef<NodeJS.Timeout | null>(null);

  const initializeTimers = (
    timeLeft?: number,
    warningTimeLeft?: number,
  ): void => {
    const warningTime = warningTimeLeft ?? sessionTimeout / 2;
    const sessionTimeoutInMilliseconds =
      (timeLeft || sessionTimeout) * 60 * 1000;
    const warningTimeInMilliseconds = warningTime * 60 * 1000;

    timeoutDurationRef.current = sessionTimeoutInMilliseconds;
    startTimeRef.current = Date.now();

    warningTimerRef.current = setTimeout(() => {
      NotificationToast.warning(tCommon('sessionWarning'));
    }, warningTimeInMilliseconds);

    sessionTimerRef.current = setTimeout(async () => {
      await handleLogout();
    }, sessionTimeoutInMilliseconds);
  };

  const extendSession = (): void => {
    resetTimers();
    initializeTimers();
  };

  const handleVisibilityChange = async (): Promise<void> => {
    if (document.visibilityState === 'hidden') {
      window.removeEventListener('mousemove', stableExtendSession);
      window.removeEventListener('keydown', stableExtendSession);
      resetTimers(); // Optionally reset timers to prevent them from running in the background
    } else if (document.visibilityState === 'visible') {
      window.removeEventListener('mousemove', stableExtendSession);
      window.removeEventListener('keydown', stableExtendSession); // Ensure no duplicates
      window.addEventListener('mousemove', stableExtendSession);
      window.addEventListener('keydown', stableExtendSession);

      // Calculate remaining time now that the tab is active again
      const elapsedTime = Date.now() - startTimeRef.current;
      const remainingTime = timeoutDurationRef.current - elapsedTime;

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

  /**
   * This useEffect intentionally has no dependency array.
   * It must run after every render to keep the refs pointing to the latest
   * versions of extendSession and handleVisibilityChange, implementing the
   * "latest ref" pattern. This ensures event listeners always call the most
   * recent function versions without needing to re-register listeners.
   * Do NOT add a dependency array (e.g. []).
   */
  useEffect(() => {
    extendSessionRef.current = extendSession;
    handleVisibilityChangeRef.current = handleVisibilityChange;
  });

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (throttledExtendSessionRef.current) {
        clearTimeout(throttledExtendSessionRef.current);
      }
    };
  }, []);

  const throttledExtendSession = useCallback(() => {
    if (!throttledExtendSessionRef.current) {
      extendSessionRef.current?.();
      throttledExtendSessionRef.current = setTimeout(() => {
        throttledExtendSessionRef.current = null;
      }, 5000); // 5 seconds throttle
    }
  }, []);

  const stableExtendSession = useCallback(() => {
    // We utilize the throttled version for event listeners
    throttledExtendSession();
  }, [throttledExtendSession]);

  const stableVisibilityChange = useCallback(() => {
    handleVisibilityChangeRef.current?.();
  }, []);

  const endSession = useCallback((): void => {
    resetTimers();
    if (throttledExtendSessionRef.current) {
      clearTimeout(throttledExtendSessionRef.current);
      throttledExtendSessionRef.current = null;
    }
    window.removeEventListener('mousemove', stableExtendSession);
    window.removeEventListener('keydown', stableExtendSession);
    document.removeEventListener('visibilitychange', stableVisibilityChange);
  }, [stableExtendSession, stableVisibilityChange]);

  const handleLogout = async (): Promise<void> => {
    try {
      await logout();
    } catch (error) {
      console.error('Error during logout:', error);
      NotificationToast.error(tCommon('errorOccurred'));
      return;
    }

    if (!mountedRef.current) return;

    clearAllItems();
    endSession();
    navigate('/');
    NotificationToast.warning(tCommon('sessionLogOut'), { autoClose: false });
  };

  const startSession = (): void => {
    resetTimers();
    initializeTimers();
    window.removeEventListener('mousemove', stableExtendSession);
    window.removeEventListener('keydown', stableExtendSession);
    document.removeEventListener('visibilitychange', stableVisibilityChange);
    window.addEventListener('mousemove', stableExtendSession);
    window.addEventListener('keydown', stableExtendSession);
    document.addEventListener('visibilitychange', stableVisibilityChange);
  };

  useEffect(() => {
    return () => {
      endSession();
    };
  }, [endSession]);

  return {
    startSession,
    endSession,
    handleLogout,
    extendSession,
  };
};

export default useSession;
