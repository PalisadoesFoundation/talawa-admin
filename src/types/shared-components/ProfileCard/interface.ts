/**
 * ProfileCard component displays user profile information in a card format.
 * It includes the user's name, role, and profile image. The component also provides
 * navigation functionality based on the user's role and the specified portal.
 */
export interface InterfaceProfileCardProps {
  /**
   * The portal for which the profile card is being rendered. This determines the navigation
   * behavior when the user clicks on the profile card. The default value is 'admin'.
   * - 'admin': Navigates to the admin dashboard or relevant admin pages.
   * - 'user': Navigates to the user dashboard or relevant user pages.
   * @defaultValue 'admin'
   */
  portal?: 'admin' | 'user';
}
