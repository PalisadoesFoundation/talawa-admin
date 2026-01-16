/**
 * Generates a secure random password that meets the validation requirements.
 *
 * The generated password will:
 * - Be at least 12 characters long (for better security)
 * - Contain at least one uppercase letter
 * - Contain at least one lowercase letter
 * - Contain at least one number
 * - Contain at least one special character
 *
 * @returns {string} A secure random password string.
 *
 * @example
 * ```ts
 * const password = generateSecurePassword();
 * console.log(password); // e.g., "Xy7$kL9mN2pQ!"
 * ```
 */

export const generateSecurePassword = (): string => {
  const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
  const numberChars = '0123456789';
  const specialChars = '!@#$%^&*(),.?":{}|<>';

  const minLength = 12;
  const char = uppercaseChars + lowercaseChars + numberChars + specialChars;
  let password = '';

  const charArr = [uppercaseChars, lowercaseChars, numberChars, specialChars];

  for (let i = 0; i < charArr.length; i++) {
    password += charArr[i][Math.floor(Math.random() * charArr[i].length)];
  }

  for (let i = password.length; i < minLength; i++) {
    password += char[Math.floor(Math.random() * char.length)];
  }

  return shuffleString(password);
};

const shuffleString = (password: string): string => {
  const arrOfPassword = password.split('');
  for (let i = arrOfPassword.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arrOfPassword[i], arrOfPassword[j]] = [arrOfPassword[j], arrOfPassword[i]];
  }

  return arrOfPassword.join('');
};
