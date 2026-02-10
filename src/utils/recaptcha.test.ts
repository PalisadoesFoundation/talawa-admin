import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

type RecaptchaModule = typeof import('./recaptcha');

type MockGrecaptcha = {
  ready: ReturnType<typeof vi.fn>;
  execute: ReturnType<typeof vi.fn>;
};

describe('reCAPTCHA', () => {
  const siteKey = 'test-site-key';
  const action = 'submit';

  let recaptchaModule: RecaptchaModule;
  let grecaptchaMock: MockGrecaptcha;
  let mockScript: HTMLScriptElement;

  const triggerLoad = () => mockScript.onload?.(new Event('load'));

  const triggerError = () => mockScript.onerror?.(new Event('error'));

  beforeEach(async () => {
    vi.resetModules();

    grecaptchaMock = {
      ready: vi.fn(),
      execute: vi.fn(),
    };

    Object.defineProperty(globalThis, 'window', {
      value: { grecaptcha: grecaptchaMock },
      writable: true,
    });

    mockScript = {
      src: '',
      async: false,
      defer: false,
      onload: null,
      onerror: null,
      remove: vi.fn(),
    } as unknown as HTMLScriptElement;

    const mockStyle = {
      setAttribute: vi.fn(),
      textContent: '',
    } as unknown as HTMLStyleElement;

    const originalCreateElement = document.createElement.bind(document);
    vi.spyOn(document, 'createElement').mockImplementation(
      (tagName: string) => {
        if (tagName === 'script') {
          return mockScript;
        }
        if (tagName === 'style') {
          return mockStyle;
        }
        // Delegate to real createElement for other elements
        return originalCreateElement(tagName);
      },
    );
    vi.spyOn(document.head, 'appendChild').mockImplementation(() => mockScript);
    vi.spyOn(document, 'querySelector').mockReturnValue(null);

    recaptchaModule = await import('./recaptcha');
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  // ---------------- loadRecaptchaScript FUNCTION ----------------

  it('loads script successfully', async () => {
    const p = recaptchaModule.loadRecaptchaScript(siteKey);

    triggerLoad();

    await expect(p).resolves.toBeUndefined();

    expect(mockScript.src).toContain(siteKey);
    expect(mockScript.async).toBe(true);
    expect(mockScript.defer).toBe(true);
  });

  it('rejects when script fails', async () => {
    const p = recaptchaModule.loadRecaptchaScript(siteKey);

    triggerError();

    await expect(p).rejects.toThrow('Failed to load reCAPTCHA script');
  });

  it('resets state after failure allowing retry', async () => {
    const p1 = recaptchaModule.loadRecaptchaScript(siteKey);
    triggerError();
    await expect(p1).rejects.toThrow();

    const p2 = recaptchaModule.loadRecaptchaScript(siteKey);
    triggerLoad();
    await expect(p2).resolves.toBeUndefined();
  });

  it('uses existing script in DOM', async () => {
    const existing = document.createElement('script');
    existing.src = 'https://www.google.com/recaptcha/api.js';

    vi.spyOn(document, 'querySelector').mockReturnValue(existing);

    const p = recaptchaModule.loadRecaptchaScript(siteKey);

    await expect(p).resolves.toBeUndefined();
  });

  it('handles missing badge safely', async () => {
    const p = recaptchaModule.loadRecaptchaScript(siteKey);

    triggerLoad();

    await expect(p).resolves.toBeUndefined();
  });

  it('returns early when script is already loading', async () => {
    const p1 = recaptchaModule.loadRecaptchaScript(siteKey);
    const p2 = recaptchaModule.loadRecaptchaScript(siteKey);

    triggerLoad();

    await expect(p1).resolves.toBeUndefined();
    await expect(p2).resolves.toBeUndefined();
  });

  // ---------------- getRecaptchaToken FUNCTION ----------------

  it('returns token successfully', async () => {
    grecaptchaMock.ready.mockImplementation((cb) => cb());
    grecaptchaMock.execute.mockResolvedValue('token123');

    const loadPromise = recaptchaModule.loadRecaptchaScript(siteKey);
    triggerLoad();
    await loadPromise;

    const token = await recaptchaModule.getRecaptchaToken(siteKey, action);
    expect(token).toBe('token123');
  });

  it('rejects if execute fails', async () => {
    grecaptchaMock.ready.mockImplementation((cb) => cb());
    grecaptchaMock.execute.mockRejectedValue(new Error('exec fail'));

    const loadPromise = recaptchaModule.loadRecaptchaScript(siteKey);
    triggerLoad();
    await loadPromise;

    await expect(
      recaptchaModule.getRecaptchaToken(siteKey, action),
    ).rejects.toThrow('exec fail');
  });

  it('rejects if grecaptcha is not available', async () => {
    Object.defineProperty(globalThis, 'window', {
      value: { grecaptcha: undefined },
      writable: true,
    });

    const loadPromise = recaptchaModule.loadRecaptchaScript(siteKey);
    triggerLoad();
    await loadPromise;

    await expect(
      recaptchaModule.getRecaptchaToken(siteKey, action),
    ).rejects.toThrow('reCAPTCHA not loaded');
  });

  it('propagates errors when loadRecaptchaScript rejects', async () => {
    // Make loadRecaptchaScript fail by triggering script error
    const promise = recaptchaModule.getRecaptchaToken(siteKey, action);

    // Trigger error on the script to make loadRecaptchaScript reject
    triggerError();

    await expect(promise).rejects.toThrow('Failed to load reCAPTCHA script');
  });
});
