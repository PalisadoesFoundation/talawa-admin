export const validatePassword = (password: string): string | null => {
  if (password.length < 8) {
    return 'passwordValidation.minLength';
  }
  if (!/[A-Z]/.test(password)) {
    return 'passwordValidation.uppercaseRequired';
  }
  if (!/[a-z]/.test(password)) {
    return 'passwordValidation.lowercaseRequired';
  }
  if (!/\d/.test(password)) {
    return 'passwordValidation.numberRequired';
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return 'passwordValidation.specialCharRequired';
  }

  return null;
};
