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

const useSession = (): UseSessionReturnType => {
  const [sessionTimeout, setSessionTimeout] = useState<number>(30);
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
  };

  const handleLogout = async (): Promise<void> => {
    try {
      await revokeRefreshToken();
    } catch (error) {
      console.error('Error revoking refresh token:', error);
    }
    localStorage.clear();
    endSession();
    navigate('/');
    toast.warning(
      'Your session has expired due to inactivity. Please log in again to continue.',
      { autoClose: false },
    );
  };

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

  const extendSession = (): void => {
    resetTimers();
    initializeTimers();
  };

  const startSession = (): void => {
    resetTimers();
    initializeTimers();
    window.addEventListener('mousemove', extendSession);
    window.addEventListener('keydown', extendSession);
  };

  useEffect(() => {
    return () => endSession();
  }, []);

  return { startSession, endSession, handleLogout };
};

export default useSession;
