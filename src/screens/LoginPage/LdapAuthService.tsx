class LdapLoginService {
  static async loginWithLDAP(email: string, password: string): Promise<any> {
    const ldapAuthEndpoint = 'http://localhost:4000/auth/login';

    try {
      const response = await fetch(ldapAuthEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      /* istanbul ignore next */
      if (response.ok) {
        const data = await response.json();
        return data;
      }
    } catch (error: any) {
      return error;
    }
  }
}

class LdapRegisterService {
  static async registerWithLDAP(
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ): Promise<any> {
    const ldapAuthEndpoint = 'http://localhost:4000/auth/register';

    try {
      const response = await fetch(ldapAuthEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });
      /* istanbul ignore next */
      if (response.ok) {
        const data = await response.json();
        return data;
      }
    } catch (error: any) {
      return error;
    }
  }
}

export { LdapLoginService, LdapRegisterService };
