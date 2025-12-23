export const AUTH_TOKEN = '';
export const BACKEND_URL = process.env.REACT_APP_TALAWA_URL;
export const RECAPTCHA_SITE_KEY = process.env.REACT_APP_RECAPTCHA_SITE_KEY;
export const REACT_APP_USE_RECAPTCHA = process.env.REACT_APP_USE_RECAPTCHA;
export const deriveBackendWebsocketUrl = (
  httpUrl: string | undefined | null,
): string => {
  if (!httpUrl) {
    return '';
  }

  try {
    const url = new URL(httpUrl);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return '';
    }

    const protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
    return `${protocol}//${url.host}${url.pathname}${url.search}`;
  } catch {
    return '';
  }
};

export const BACKEND_WEBSOCKET_URL = deriveBackendWebsocketUrl(BACKEND_URL);
