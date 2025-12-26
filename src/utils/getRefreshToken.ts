import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { BACKEND_URL } from 'Constant/constant';
import { REFRESH_TOKEN_MUTATION } from 'GraphQl/Mutations/mutations';

/**
 * Refreshes the access token using the HTTP-Only cookie refresh token.
 * This function is called when the current access token expires.
 * The refresh token is stored in an HTTP-Only cookie and is sent automatically
 * by the browser with the request.
 *
 * @returns Returns the new access token if successful, null otherwise
 */
export async function refreshToken(): Promise<string | null> {
  const client = new ApolloClient({
    link: new HttpLink({
      uri: BACKEND_URL,
      credentials: 'include', // Send HTTP-Only cookies with request
    }),
    cache: new InMemoryCache(),
  });

  try {
    // No need to pass refreshToken variable - API reads it from HTTP-Only cookie
    const { data } = await client.mutate({
      mutation: REFRESH_TOKEN_MUTATION,
    });

    if (data?.refreshToken?.authenticationToken) {
      // Tokens are now set via HTTP-Only cookies by the API
      // No need to store them in localStorage
      return data.refreshToken.authenticationToken;
    }

    return null;
  } catch (error) {
    console.error('Failed to refresh token', error);
    return null;
  }
}

/**
 * Attempts to refresh the token and reload the page if successful.
 * Falls back to clearing storage and redirecting to login if refresh fails.
 */
export async function handleTokenRefresh(): Promise<void> {
  // Import useLocalStorage dynamically to avoid circular dependency issues
  const useLocalStorage = (await import('./useLocalstorage')).default;
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
