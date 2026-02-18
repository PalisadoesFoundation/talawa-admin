import { afterEach, vi } from 'vitest';

import {
  AUTH_TOKEN,
  BACKEND_URL,
  RECAPTCHA_SITE_KEY,
  REACT_APP_USE_RECAPTCHA,
  deriveBackendWebsocketUrl,
  BACKEND_WEBSOCKET_URL,
} from './constant';

describe('constants', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('AUTH_TOKEN should be an empty string', () => {
    expect(typeof AUTH_TOKEN).toEqual('string');
    expect(AUTH_TOKEN).toEqual('');
  });

  it('BACKEND_URL should be equal to REACT_APP_TALAWA_URL environment variable', () => {
    expect(BACKEND_URL).toEqual(process.env.REACT_APP_TALAWA_URL);
  });

  it('RECAPTCHA_SITE_KEY should be equal to REACT_APP_RECAPTCHA_SITE_KEY environment variable', () => {
    expect(RECAPTCHA_SITE_KEY).toEqual(
      process.env.REACT_APP_RECAPTCHA_SITE_KEY,
    );
  });

  it('REACT_APP_USE_RECAPTCHA should be equal to REACT_APP_USE_RECAPTCHA environment variable', () => {
    expect(REACT_APP_USE_RECAPTCHA).toEqual(
      process.env.REACT_APP_USE_RECAPTCHA,
    );
  });

  describe('deriveBackendWebsocketUrl', () => {
    it('should convert https to wss', () => {
      expect(deriveBackendWebsocketUrl('https://example.com/graphql')).toBe(
        'wss://example.com/graphql',
      );
    });

    it('should convert http to ws', () => {
      expect(deriveBackendWebsocketUrl('http://example.com/graphql')).toBe(
        'ws://example.com/graphql',
      );
    });

    it('should preserve port numbers', () => {
      expect(
        deriveBackendWebsocketUrl('https://example.com:8443/graphql'),
      ).toBe('wss://example.com:8443/graphql');
      expect(deriveBackendWebsocketUrl('http://localhost:4000/graphql')).toBe(
        'ws://localhost:4000/graphql',
      );
    });

    it('should preserve query parameters', () => {
      expect(
        deriveBackendWebsocketUrl(
          'http://localhost:4000/graphql?key=value&foo=bar',
        ),
      ).toBe('ws://localhost:4000/graphql?key=value&foo=bar');
    });

    it('should preserve pathname with trailing slash', () => {
      expect(deriveBackendWebsocketUrl('https://example.com/graphql/')).toBe(
        'wss://example.com/graphql/',
      );
    });

    it('should return empty string for null', () => {
      expect(deriveBackendWebsocketUrl(null)).toBe('');
    });

    it('should return empty string for undefined', () => {
      expect(deriveBackendWebsocketUrl(undefined)).toBe('');
    });

    it('should return empty string for empty string', () => {
      expect(deriveBackendWebsocketUrl('')).toBe('');
    });

    it('should return empty string for invalid URL', () => {
      expect(deriveBackendWebsocketUrl('not-a-valid-url')).toBe('');
    });

    it('should return empty string for non-http(s) protocols', () => {
      expect(deriveBackendWebsocketUrl('ftp://example.com/graphql')).toBe('');
      expect(deriveBackendWebsocketUrl('ws://example.com/graphql')).toBe('');
      expect(deriveBackendWebsocketUrl('wss://example.com/graphql')).toBe('');
    });

    it('should strip hash fragments (per RFC 6455)', () => {
      expect(
        deriveBackendWebsocketUrl('http://example.com/graphql#fragment'),
      ).toBe('ws://example.com/graphql');
    });
  });

  describe('BACKEND_WEBSOCKET_URL', () => {
    it('should be derived from BACKEND_URL', () => {
      expect(BACKEND_WEBSOCKET_URL).toBe(
        deriveBackendWebsocketUrl(BACKEND_URL),
      );
    });

    it('should be a string', () => {
      expect(typeof BACKEND_WEBSOCKET_URL).toBe('string');
    });
  });
});
