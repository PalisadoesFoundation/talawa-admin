import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { BACKEND_URL } from 'Constant/constant';
import { REFRESH_TOKEN_MUTATION } from 'GraphQl/Mutations/mutations';
<<<<<<< HEAD
import useLocalStorage from './useLocalstorage';
=======
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1

export async function refreshToken(): Promise<boolean> {
  const client = new ApolloClient({
    link: new HttpLink({
      uri: BACKEND_URL,
    }),
    cache: new InMemoryCache(),
  });

<<<<<<< HEAD
  const { getItem, setItem } = useLocalStorage();

  const refreshToken = getItem('refreshToken');
=======
  const refreshToken = localStorage.getItem('refreshToken');
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
  /* istanbul ignore next */
  try {
    const { data } = await client.mutate({
      mutation: REFRESH_TOKEN_MUTATION,
      variables: {
        refreshToken: refreshToken,
      },
    });

<<<<<<< HEAD
    setItem('token', data.refreshToken.accessToken);
    setItem('refreshToken', data.refreshToken.refreshToken);

=======
    localStorage.setItem('token', data.refreshToken.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken.refreshToken);
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    window.location.reload();
    return true;
  } catch (error) {
    console.error('Failed to refresh token', error);
    return false;
  }
}
