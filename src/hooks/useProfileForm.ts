import { useCallback, useMemo, useState } from 'react';
import { validatePassword } from 'utils/passwordValidator';

/**
 * User profile data structure containing personal, contact, and account information
 */
export type UserProfile = {
  name: string;
  natalSex: string;
  password?: string;
  emailAddress: string;
  mobilePhoneNumber: string;
  homePhoneNumber: string;
  workPhoneNumber: string;
  birthDate: string | null;
  educationGrade: string;
  employmentStatus: string;
  maritalStatus: string;
  description: string;
  addressLine1: string;
  addressLine2: string;
  state: string;
  countryCode: string;
  city: string;
  postalCode: string;
  avatarURL?: string;
};

/**
 * Validation errors for profile fields
 */
export type ProfileErrors = Partial<Record<keyof UserProfile, string>>;

/**
 * Custom hook for managing profile form state, validation, and change tracking
 *
 * @param initial - Initial user profile data
 * @returns Object containing form state, validation methods, and change tracking
 *
 * @example
 * ```tsx
 * const { form, errors, isUpdated, setField, validate, reset } = useProfileForm(initialProfile);
 *
 * // Update a field
 * setField('name', 'John Doe');
 *
 * // Validate form
 * if (validate()) {
 *   // Submit form
 * }
 *
 * // Reset to initial state
 * reset();
 * ```
 */
export function useProfileForm(initial: UserProfile) {
  const [form, setForm] = useState<UserProfile>(initial);
  const [errors, setErrors] = useState<ProfileErrors>({});
  const [dirty, setDirty] = useState(false);

  /**
   * Updates a single field in the form
   */
  const setField = useCallback(
    <K extends keyof UserProfile>(key: K, value: UserProfile[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
      setDirty(true);
    },
    [],
  );

  /**
   * Validates the form and returns true if valid
   * Sets error messages for invalid fields
   * 
   * Note: Per issue #6110 requirements, this validates:
   * - name: required and non-empty
   * - emailAddress: required and non-empty (format validation not required per spec)
   * - password: optional, but if provided must meet complexity requirements
   */
  const validate = useCallback(() => {
    const next: ProfileErrors = {};
    if (!form.name?.trim()) next.name = 'Name is required';
    if (form.password && form.password.trim() !== '' && !validatePassword(form.password)) {
      next.password = 'Password does not meet policy';
    }
    if (!form.emailAddress?.trim()) next.emailAddress = 'Email is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  }, [form]);

  /**
   * Resets form to initial state and clears all errors
   */
  const reset = useCallback(() => {
    setForm(initial);
    setErrors({});
    setDirty(false);
  }, [initial]);

  /**
   * Tracks if form has been modified from initial state
   * Note: Uses JSON.stringify for deep equality as specified in starter code.
   * This is acceptable for this use case as UserProfile objects are small.
   */
  const changed = useMemo(
    () => JSON.stringify(form) !== JSON.stringify(initial),
    [form, initial],
  );

  return {
    form,
    errors,
    isUpdated: dirty || changed,
    setField,
    validate,
    reset,
  };
}
