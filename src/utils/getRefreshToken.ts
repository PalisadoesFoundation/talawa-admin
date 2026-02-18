import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { BACKEND_URL } from 'Constant/constant';
import { REFRESH_TOKEN_MUTATION } from 'GraphQl/Mutations/mutations';
import useLocalStorage from './useLocalstorage';

/**
 * Refreshes the access token using HTTP-Only cookies.
 * The refresh token is automatically sent via cookies by the browser.
 * This function is called when the current access token expires.
 *
 * @returns Returns true if token refresh was successful, false otherwise
 */
export async function refreshToken(): Promise<boolean> {
  const client = new ApolloClient({
    link: new HttpLink({
      uri: BACKEND_URL,
      credentials: 'include', // Required for HTTP-Only cookies
    }),
    cache: new InMemoryCache(),
  });

  try {
    // No need to pass refreshToken variable - API reads from HTTP-Only cookie
    const { data } = await client.mutate({
      mutation: REFRESH_TOKEN_MUTATION,
    });

    if (data?.refreshToken) {
      // Tokens are now set via HTTP-Only cookies by the API
      // No need to store in localStorage
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
  const { clearAllItems } = useLocalStorage();
  const success = await refreshToken();

  if (success) {
    window.location.reload();
  } else {
    // Clear all storage and redirect to login
    clearAllItems();
    window.location.href = '/';
  }
}
