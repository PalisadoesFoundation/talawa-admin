interface InterfaceGrecaptcha {
  ready(callback: () => void): void;
  execute(siteKey: string, options: { action: string }): Promise<string>;
}

declare global {
  interface InterfaceWindow {
    grecaptcha?: InterfaceGrecaptcha;
  }
}

// Global flag to track if script is already loaded
let isScriptLoaded = false;
let scriptPromise: Promise<void> | null = null;

/**
 * Load the reCAPTCHA script if not already loaded
 * @param siteKey - The reCAPTCHA site key
 * @returns Promise that resolves when script is loaded
 */
export const loadRecaptchaScript = async (siteKey: string): Promise<void> => {
  // If loading already in progress → reuse promise
  if (scriptPromise) return scriptPromise;

  // If already loaded → resolve instantly
  if (isScriptLoaded) return Promise.resolve();

  // If script already exists in DOM → mark loaded
  const existingScript = document.querySelector(
    `script[src*="recaptcha/api.js"]`,
  );

  if (existingScript) {
    if ((window as InterfaceWindow).grecaptcha?.ready) {
      isScriptLoaded = true;
      return Promise.resolve();
    }
    return new Promise<void>((resolve, reject) => {
      const onLoad = () => {
        isScriptLoaded = true;
        resolve();
      };
      const onError = () => {
        existingScript.remove();
        reject(new Error('Failed to load reCAPTCHA script'));
      };
      existingScript.addEventListener('load', onLoad, { once: true });
      existingScript.addEventListener('error', onError, { once: true });
    });
  }

  // Create loading promise
  scriptPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      isScriptLoaded = true;

      // Hide reCAPTCHA badge with CSS injection
      if (!document.querySelector('style[data-recaptcha-hide]')) {
        const style = document.createElement('style');
        style.setAttribute('data-recaptcha-hide', '');
        style.textContent = '.grecaptcha-badge { display: none !important; }';
        document.head.appendChild(style);
      }

      resolve();
    };

    script.onerror = () => {
      script.remove();
      reject(new Error('Failed to load reCAPTCHA script'));
    };

    document.head.appendChild(script);
  }).catch((err: unknown) => {
    // Reset state on failure so retries work
    scriptPromise = null;
    throw err;
  });

  return scriptPromise;
};

/**
 * Get a reCAPTCHA token for the specified action
 * @param siteKey - The reCAPTCHA site key
 * @param action - The action name for this reCAPTCHA request
 * @returns Promise that resolves to the reCAPTCHA token
 */
export const getRecaptchaToken = async (
  siteKey: string,
  action: string,
): Promise<string> => {
  // Ensure script is loaded before using grecaptcha
  await loadRecaptchaScript(siteKey);

  const grecaptcha = (window as InterfaceWindow).grecaptcha;
  if (!grecaptcha?.ready) {
    throw new Error('reCAPTCHA not loaded');
  }

  await new Promise<void>((resolve) => grecaptcha.ready(resolve));
  const token = await grecaptcha.execute(siteKey, { action });

  const badge = document.querySelector('.grecaptcha-badge');
  if (badge instanceof HTMLElement) {
    badge.style.display = 'none';
  }

  return token;
};
