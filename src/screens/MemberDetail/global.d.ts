export declare global {
  interface Window {
    validatePassword?: (password: string) => boolean;
  }
}
