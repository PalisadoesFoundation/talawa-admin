import {
  AUTH_TOKEN,
  BACKEND_URL,
  RECAPTCHA_SITE_KEY,
  REACT_APP_USE_RECAPTCHA,
} from './constant';

describe('constants', () => {
  it('AUTH_TOKEN should be an empty string', () => {
    expect(typeof AUTH_TOKEN).toEqual('string');
    expect(AUTH_TOKEN).toEqual('');
  });

  it('BACKEND_URL should be equal to REACT_APP_TALAWA_URL environment variable', () => {
    expect(BACKEND_URL).toEqual(process.env.REACT_APP_TALAWA_URL);
  });

  it('RECAPTCHA_SITE_KEY should be equal to REACT_APP_RECAPTCHA_SITE_KEY environment variable', () => {
    expect(RECAPTCHA_SITE_KEY).toEqual(
<<<<<<< HEAD
      process.env.REACT_APP_RECAPTCHA_SITE_KEY,
=======
      process.env.REACT_APP_RECAPTCHA_SITE_KEY
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    );
  });

  it('REACT_APP_USE_RECAPTCHA should be equal to REACT_APP_USE_RECAPTCHA environment variable', () => {
    expect(REACT_APP_USE_RECAPTCHA).toEqual(
<<<<<<< HEAD
      process.env.REACT_APP_USE_RECAPTCHA,
=======
      process.env.REACT_APP_USE_RECAPTCHA
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    );
  });
});
