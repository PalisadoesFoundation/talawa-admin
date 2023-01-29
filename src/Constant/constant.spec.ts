import { AUTH_TOKEN, BACKEND_URL } from './constant';

describe('constants', () => {
  it('AUTH_TOKEN should be an empty string', () => {
    expect(typeof AUTH_TOKEN).toEqual('string');
    expect(AUTH_TOKEN).toEqual('');
  });

  it('BACKEND_URL should be equal to REACT_APP_TALAWA_URL environment variable', () => {
    expect(BACKEND_URL).toEqual(process.env.REACT_APP_TALAWA_URL);
  });
});
