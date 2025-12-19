import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { BACKEND_URL } from 'Constant/constant';
import { REFRESH_TOKEN_MUTATION } from 'GraphQl/Mutations/mutations';
import useLocalStorage from './useLocalstorage';

/**
 * Refreshes the access token using the stored refresh token.
 * This function is called when the current access token expires.
 *
 * @returns Returns true if token refresh was successful, false otherwise
 */
export async function refreshToken(): Promise<boolean> {
  const client = new ApolloClient({
    link: new HttpLink({
      uri: BACKEND_URL,
    }),
    cache: new InMemoryCache(),
  });

  const { getItem, setItem } = useLocalStorage();

  const storedRefreshToken = getItem('refreshToken');

  if (!storedRefreshToken) {
    console.error('No refresh token available');
    return false;
  }

  try {
    const { data } = await client.mutate({
      mutation: REFRESH_TOKEN_MUTATION,
      variables: {
        refreshToken: storedRefreshToken,
      },
    });

    if (data?.refreshToken) {
      setItem('token', data.refreshToken.authenticationToken);
      setItem('refreshToken', data.refreshToken.refreshToken);
      return true;
    }

    return false;
  } catch (error) {
    console.error('Failed to refresh token', error);
    return false;
  }
}

/**
 * Attempts to refresh the token and reload the page if successful.
 * Falls back to clearing storage and redirecting to login if refresh fails.
 */
export async function handleTokenRefresh(): Promise<void> {
  const success = await refreshToken();

  if (success) {
    window.location.reload();
  } else {
    // Clear all storage and redirect to login
    localStorage.clear();
    window.location.href = '/';
  }
}
