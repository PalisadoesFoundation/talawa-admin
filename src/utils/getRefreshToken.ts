import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { BACKEND_URL } from 'Constant/constant';
import { REFRESH_TOKEN_MUTATION } from 'GraphQl/Mutations/mutations';

export async function refreshToken(): Promise<boolean> {
  const client = new ApolloClient({
    link: new HttpLink({
      uri: BACKEND_URL,
    }),
    cache: new InMemoryCache(),
  });

  const refreshToken = localStorage.getItem('refreshToken');
  /* istanbul ignore next */
  try {
    const { data } = await client.mutate({
      mutation: REFRESH_TOKEN_MUTATION,
      variables: {
        refreshToken: refreshToken,
      },
    });

    localStorage.setItem('token', data.refreshToken.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken.refreshToken);
    window.location.reload();
    return true;
  } catch (error) {
    console.error('Failed to refresh token', error);
    return false;
  }
}
