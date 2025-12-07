export const validatePassword = (password: string): boolean => {
  const minLength = 8;
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  return (
    password.length >= minLength &&
    hasSpecialChar &&
    hasNumber &&
    hasUpperCase &&
    hasLowerCase
  );
};

export const getPasswordValidationRules = (password: string) => ({
  lowercaseChar: /[a-z]/.test(password),
  uppercaseChar: /[A-Z]/.test(password),
  numericValue: /\d/.test(password),
  specialChar: /[!@#$%^&*()_+{}[\]:;<>,.?~\\/-]/.test(password),
});
