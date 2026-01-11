import UserSidebar from 'components/UserPortal/UserSidebar/UserSidebar';
import styles from 'style/app-fixed.module.css';
import ProfileHeader from './ProfileHeader';

/**
 * Props interface for the ProfileFormWrapper component.
 */
interface InterfaceProfileFormWrapperProps {
  /** Whether the current user is viewing their own profile (true) or an admin viewing a member profile (false) */
  isUser: boolean;
  /** Controls the visibility state of the sidebar drawer */
  hideDrawer: boolean;
  /** Function to toggle the sidebar drawer visibility */
  setHideDrawer: React.Dispatch<React.SetStateAction<boolean>>;
  /** Translation function for common text strings */
  tCommon: (key: string) => string;
  /** Child components to render within the wrapper */
  children: React.ReactNode;
}

/**
 * ProfileFormWrapper - A conditional wrapper component that provides user-specific UI layout.
 *
 * This wrapper is required because the SecuredRouteForUser component
 * (src/components/UserPortal/SecuredRouteForUser/SecuredRouteForUser.tsx)
 * does not provide any sidebar to the outlet directly. When a user is viewing
 * their own profile, we need to wrap the ProfileForm with the UserSidebar
 * and ProfileHeader to maintain consistent user portal layout.
 *
 * @param props - The component props
 * @param isUser - If true, renders with UserSidebar and ProfileHeader for user profile view.
 *                       If false, renders children directly for admin member view.
 * @param hideDrawer - Controls sidebar visibility state
 * @param setHideDrawer - Function to toggle sidebar visibility
 * @param tCommon - Translation function for internationalized text
 * @param children - The ProfileForm content to be wrapped
 *
 * @returns JSX element with conditional layout based on user context
 *
 * @example
 * ```tsx
 * // For user profile view (includes sidebar and header)
 * <ProfileFormWrapper
 *   isUser={true}
 *   hideDrawer={false}
 *   setHideDrawer={setHideDrawer}
 *   tCommon={t}
 * >
 *   <ProfileFormContent />
 * </ProfileFormWrapper>
 *
 * // For admin member view (no sidebar, just content)
 * <ProfileFormWrapper
 *   isUser={false}
 *   hideDrawer={false}
 *   setHideDrawer={setHideDrawer}
 *   tCommon={t}
 * >
 *   <ProfileFormContent />
 * </ProfileFormWrapper>
 * ```
 */
const ProfileFormWrapper: React.FC<InterfaceProfileFormWrapperProps> = ({
  isUser,
  hideDrawer,
  setHideDrawer,
  tCommon,
  children,
}) => {
  if (!isUser) {
    return <>{children}</>;
  }

  return (
    <>
      <UserSidebar hideDrawer={hideDrawer} setHideDrawer={setHideDrawer} />
      <div
        className={`d-flex flex-row ${styles.containerHeight} ${
          hideDrawer ? styles.expand : styles.contract
        } pt-4`}
      >
        <div className={styles.mainContainer}>
          <ProfileHeader title={tCommon('settings')} />
          {children}
        </div>
      </div>
    </>
  );
};

export default ProfileFormWrapper;
