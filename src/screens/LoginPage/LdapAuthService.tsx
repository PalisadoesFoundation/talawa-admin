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

      if (!response.ok) {
        throw new Error('LDAP Authentication Failed');
      }

      const data = await response.json();
      console.log('Login Success:', data);
      return data;
    } catch (error: any) {
      console.error('Login Error:', error.message);
      throw error; // Rethrow the error to handle it at a higher level if needed
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

      if (!response.ok) {
        throw new Error('LDAP Registration Failed');
      }

      const data = await response.json();
      console.log('Registration Success:', data);
      return data;
    } catch (error: any) {
      console.error('Registration Error:', error.message);
      throw error; // Rethrow the error to handle it at a higher level if needed
    }
  }
}

export { LdapLoginService, LdapRegisterService };
