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
 * @returns A secure random password string.
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

  const randomArr = new Uint32Array(minLength)
  crypto.getRandomValues(randomArr)

  for (let i = 0; i < charArr.length; i++) {
    password += (charArr[i][randomArr[i]%charArr[i].length]);
  }

  for (let i = password.length; i < minLength; i++) {
    password += (char[randomArr[i]%char.length])
  }


  return shuffleString(password);
};

const shuffleString = (password: string): string => {
  const arr = password.split('');
  const randomValues = new Uint32Array(arr.length);
  crypto.getRandomValues(randomValues);

  for (let i = arr.length - 1; i > 0; i--) {
    const j = randomValues[i] % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr.join('');
};