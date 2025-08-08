export function validateRecaptcha(string: string): boolean {
  const pattern = /^[a-zA-Z0-9_-]{40}$/;
  return pattern.test(string);
}
