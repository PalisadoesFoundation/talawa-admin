/**
 * Custom hook for managing ProfileForm GraphQL operations
 * Handles queries, mutations, and data synchronization
 */

import { useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import {
  UPDATE_CURRENT_USER_MUTATION,
  UPDATE_USER_MUTATION,
} from 'GraphQl/Mutations/mutations';
import { USER_DETAILS } from 'GraphQl/Queries/Queries';

interface UseProfileDataProps {
  userId: string;
  isUser: boolean;
  isAdmin: boolean;
  onDataLoaded?: (data: any) => void;
}

export const useProfileData = ({
  userId,
  isUser,
  isAdmin,
  onDataLoaded,
}: UseProfileDataProps) => {
  const { data: userData, loading } = useQuery(USER_DETAILS, {
    variables: {
      input: {
        id: userId,
      },
    },
  });

  const [updateUser] = useMutation(UPDATE_USER_MUTATION);
  const [updateCurrentUser] = useMutation(UPDATE_CURRENT_USER_MUTATION);

  useEffect(() => {
    if (userData && onDataLoaded) {
      onDataLoaded(userData);
    }
  }, [userData, onDataLoaded]);

  const executeUpdate = async (input: any) => {
    if (isUser || isAdmin) {
      return await updateCurrentUser({ variables: { input } });
    } else {
      return await updateUser({ variables: { input } });
    }
  };

  return {
    userData,
    loading,
    executeUpdate,
  };
};
