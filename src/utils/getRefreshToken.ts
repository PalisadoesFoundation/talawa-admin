import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { BACKEND_URL } from 'Constant/constant';
import { REFRESH_TOKEN_MUTATION } from 'GraphQl/Mutations/mutations';
import useLocalStorage from './useLocalstorage';

export async function refreshToken(): Promise<boolean> {
  const client = new ApolloClient({
    link: new HttpLink({
      uri: BACKEND_URL,
    }),
    cache: new InMemoryCache(),
  });

  const { getItem, setItem } = useLocalStorage();

  const refreshToken = getItem('refreshToken');

  try {
    const { data } = await client.mutate({
      mutation: REFRESH_TOKEN_MUTATION,
      variables: {
        refreshToken: refreshToken,
      },
    });

    setItem('token', data.refreshToken.accessToken);
    setItem('refreshToken', data.refreshToken.refreshToken);

    window.location.reload();
    return true;
  } catch (error) {
    console.error('Failed to refresh token', error);
    return false;
  }
}
