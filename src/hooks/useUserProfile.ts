/**
 * useUserProfile Hook
 *
 * Encapsulates logic for fetching user profile data and handling logout.
 *
 * @returns An object containing user profile data and a logout function.
 */
import { useMutation } from '@apollo/client';
import { LOGOUT_MUTATION } from 'GraphQl/Mutations/mutations';
import { MAX_NAME_LENGTH } from 'Constant/common';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import {
  resolveProfileNavigation,
  type ProfilePortal,
} from 'utils/profileNavigation';
import { sanitizeAvatarURL } from 'utils/sanitizeAvatar';
import useLocalStorage from 'utils/useLocalstorage';
import useSession from 'utils/useSession';
import type { InterfaceUseUserProfileReturn } from 'types/UseUserProfile';
import { useMemo, useState, useRef, useEffect } from 'react';

const useUserProfile = (
  portal: ProfilePortal = 'user',
): InterfaceUseUserProfileReturn => {
  const { endSession } = useSession();
  const { t: tCommon } = useTranslation('common');
  const abortControllerRef = useRef<AbortController | null>(null);
  const [logout] = useMutation(LOGOUT_MUTATION);
  const { getItem, clearAllItems } = useLocalStorage();
  const navigate = useNavigate();

  const [{ userRole, name, userImage }] = useState(() => ({
    userRole: getItem<string>('role') || '',
    name: getItem<string>('name') || '',
    userImage: sanitizeAvatarURL(getItem<string>('UserImage')),
  }));

  const displayedName = useMemo(
    () =>
      name.length > MAX_NAME_LENGTH
        ? name.substring(0, Math.max(MAX_NAME_LENGTH - 3, 0)) + '...'
        : name,
    [name],
  );

  const profileDestination = resolveProfileNavigation({
    portal,
    role: userRole,
  });

  const isLoggingOutRef = useRef(false);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
      isLoggingOutRef.current = false;
    };
  }, []);

  const handleLogout = async (): Promise<void> => {
    // Prevent multiple simultaneous logout calls (race condition guard)
    if (isLoggingOutRef.current) {
      console.warn('Logout already in progress');
      return;
    }

    isLoggingOutRef.current = true;
    abortControllerRef.current = new AbortController();

    // Save abort controller for potential cleanup
    const abortController = abortControllerRef.current;

    try {
      await logout({
        context: {
          fetchOptions: {
            signal: abortController.signal,
          },
        },
      });
    } catch (error) {
      console.error('Error during logout:', error);
    }

    try {
      clearAllItems();
      endSession();
      // Only navigate if not aborted
      if (!abortController.signal.aborted) {
        navigate('/');
      }
    } finally {
      // Reset flag only if this is the same abort controller
      if (abortControllerRef.current === abortController) {
        isLoggingOutRef.current = false;
        abortControllerRef.current = null;
      }
    }
  };

  return {
    name,
    displayedName,
    userRole,
    userImage,
    profileDestination,
    handleLogout,
    tCommon,
  };
};

export default useUserProfile;
