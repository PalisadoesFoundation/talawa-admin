import { createAuthClient } from 'better-auth/react';
export const authClient = createAuthClient({
  baseURL: process.env.BASE_URL_SERVER, // the base url of your auth server
});
