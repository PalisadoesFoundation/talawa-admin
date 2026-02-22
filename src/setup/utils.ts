/**
 * Environment variable key names used by the setup script
 */
export const ENV_KEYS = {
  USE_RECAPTCHA: 'REACT_APP_USE_RECAPTCHA',
  RECAPTCHA_SITE_KEY: 'REACT_APP_RECAPTCHA_SITE_KEY',
  ALLOW_LOGS: 'ALLOW_LOGS',
  USE_DOCKER: 'USE_DOCKER',
  DOCKER_MODE: 'DOCKER_MODE',
  TALAWA_URL: 'REACT_APP_TALAWA_URL',
  BACKEND_WEBSOCKET_URL: 'REACT_APP_BACKEND_WEBSOCKET_URL',
  GOOGLE_CLIENT_ID: 'VITE_GOOGLE_CLIENT_ID',
  GOOGLE_REDIRECT_URI: 'VITE_GOOGLE_REDIRECT_URI',
  GITHUB_CLIENT_ID: 'VITE_GITHUB_CLIENT_ID',
  GITHUB_REDIRECT_URI: 'VITE_GITHUB_REDIRECT_URI',
} as const;

/**
 * Checks if an error is an ExitPromptError (user cancelled with CTRL+C)
 */
export const isExitPromptError = (error: unknown): boolean =>
  typeof error === 'object' &&
  error !== null &&
  'name' in error &&
  (error as { name: string }).name === 'ExitPromptError';
