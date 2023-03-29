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
      process.env.REACT_APP_RECAPTCHA_SITE_KEY
    );
  });

  it('REACT_APP_USE_RECAPTCHA should be equal to REACT_APP_USE_RECAPTCHA environment variable', () => {
    expect(REACT_APP_USE_RECAPTCHA).toEqual(
      process.env.REACT_APP_USE_RECAPTCHA
    );
  });
});
