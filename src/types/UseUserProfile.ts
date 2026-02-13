/**
 * Return type for the useUserProfile hook.
 *
 * `@remarks`
 * Provides user profile data and actions for rendering profile dropdowns
 * and managing user authentication state across the application.
 *
 * `@example`
 * ```tsx
 * const { displayedName, userImage, handleLogout } = useUserProfile('user');
 * ```
 */
export interface InterfaceUseUserProfileReturn {
  /**
   * Full user name retrieved from localStorage.
   * `@defaultValue` Empty string if not found
   */
  name: string;

  /**
   * Truncated display name (max 20 characters) with ellipsis if needed.
   * Used for UI rendering to prevent layout overflow.
   */
  displayedName: string;

  /**
   * User's role in the system (e.g., 'ADMIN', 'USER', 'SUPERADMIN').
   * `@defaultValue` Empty string if not found
   */
  userRole: string;

  /**
   * Sanitized avatar URL or empty string if unavailable.
   * Handles null, undefined, and string "null" values.
   */
  userImage: string;

  /**
   * Destination path for "View Profile" navigation.
   * Resolved based on user role and portal context.
   */
  profileDestination: string;

  /**
   * Async function to handle user logout.
   *
   * `@remarks`
   * - Invokes logout mutation
   * - Clears localStorage and session data
   * - Navigates to root path
   * - Includes race condition protection
   *
   * `@returns` Promise that resolves when logout completes
   * `@throws` Logs errors but does not reject (fail-safe)
   */
  handleLogout: () => Promise<void>;

  /**
   * Translation function for common strings.
   *
   * `@param` key - Translation key from common namespace
   * `@returns` Translated string in the current locale
   */
  tCommon: (key: string) => string;
}
