import { LdapLoginService, LdapRegisterService } from './LdapAuthService';

const fetchMock = jest.spyOn(global, 'fetch') as jest.Mock;

describe('LdapLoginService', () => {
  afterEach(() => {
    fetchMock.mockReset();
  });

  it('should login with LDAP successfully', async () => {
    const mockData = { success: true };
    const jsonMock = jest.fn().mockResolvedValueOnce(mockData);
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: jsonMock,
    });

    const result = await LdapLoginService.loginWithLDAP(
      'test@email.com',
      'password'
    );

    expect(result).toEqual(mockData);
    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:4000/auth/login',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ email: 'test@email.com', password: 'password' }),
      })
    );

    expect(fetchMock).toHaveBeenCalled();
    expect(fetchMock.mock.calls[0][0]).toEqual(
      'http://localhost:4000/auth/login'
    );
    expect(fetchMock.mock.calls[0][1].method).toEqual('POST');
    expect(fetchMock.mock.calls[0][1].body).toEqual(
      JSON.stringify({ email: 'test@email.com', password: 'password' })
    );

    expect(jsonMock).toHaveBeenCalled();
  });

  it('should handle login failure', async () => {
    fetchMock.mockRejectedValueOnce(new Error('Login failed'));

    const result = await LdapLoginService.loginWithLDAP(
      'test@email.com',
      'password'
    );

    expect(result).toBeInstanceOf(Error);
  });
});

describe('LdapRegisterService', () => {
  afterEach(() => {
    fetchMock.mockReset();
  });

  it('should register with LDAP successfully', async () => {
    const mockData = { success: true };
    const jsonMock = jest.fn().mockResolvedValueOnce(mockData);
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: jsonMock,
    });

    const result = await LdapRegisterService.registerWithLDAP(
      'John',
      'Doe',
      'test@email.com',
      'password'
    );

    expect(result).toEqual(mockData);
    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:4000/auth/register',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          firstName: 'John',
          lastName: 'Doe',
          email: 'test@email.com',
          password: 'password',
        }),
      })
    );

    expect(jsonMock).toHaveBeenCalled();
  });

  it('should handle registration failure', async () => {
    fetchMock.mockRejectedValueOnce(new Error('Registration failed'));

    const result = await LdapRegisterService.registerWithLDAP(
      'John',
      'Doe',
      'test@email.com',
      'password'
    );

    expect(result).toBeInstanceOf(Error);
  });
});
