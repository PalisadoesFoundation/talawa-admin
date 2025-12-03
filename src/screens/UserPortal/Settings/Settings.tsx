/**
 * The `Settings` component is a user profile settings page that allows users to
 * view and update their personal information, including profile picture, contact
 * details, and other settings. It also includes responsive behavior for different
 * screen sizes.
 *
 * @remarks
 * - Utilizes Apollo Client for GraphQL queries and mutations.
 * - Includes form validation for fields like password strength and file upload restrictions.
 * - Provides a responsive layout with a collapsible sidebar.
 * - Displays toast notifications for success and error messages.
 *
 * ### Requirements
 * - `react`, `react-i18next` for translations.
 * - `react-bootstrap` for UI components.
 * - `@apollo/client` for GraphQL integration.
 * - `react-toastify` for toast notifications.
 * - Custom utilities like `useLocalStorage`, `urlToFile`, and `validatePassword`.
 *
 * ### Internal Details
 * - Handles window resize events to toggle the sidebar visibility.
 * - Fetches current user data using the `CURRENT_USER` query.
 * - Updates user details using the `UPDATE_CURRENT_USER_MUTATION` mutation.
 * - TODO: Integrate `EventsAttendedByUser` component once event queries are functional.
 *
 * @returns A JSX.Element representing the rendered settings page.
 *
 * @example
 * ```tsx
 * <Settings />
 * ```
 */
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from 'style/app-fixed.module.css';
import { Card, Col, Row } from 'react-bootstrap';
import { UPDATE_CURRENT_USER_MUTATION } from 'GraphQl/Mutations/mutations';
import { useMutation, useQuery } from '@apollo/client';
import { errorHandler } from 'utils/errorHandler';
import { toast } from 'react-toastify';
import { CURRENT_USER } from 'GraphQl/Queries/Queries';
import useLocalStorage from 'utils/useLocalstorage';
import OtherSettings from 'components/UserProfileSettings/OtherSetting/OtherSettings';
import UserSidebar from 'components/UserPortal/UserSidebar/UserSidebar';
import { urlToFile } from 'utils/urlToFile';
import ProfileHeader from './ProfileHeader/ProfileHeader';
import ProfileImageSection from './ProfileImageSection/ProfileImageSection';
import UserDetailsForm from './UserDetails/UserDetails';
import { validatePassword } from 'utils/passwordValidator';
import EventsAttendedByUser from 'components/UserPortal/UserProfile/EventsAttendedByUser';

export default function Settings(): React.JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'settings' });
  const { t: tCommon } = useTranslation('common');
  const [isUpdated, setIsUpdated] = useState<boolean>(false);
  const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null);
  const originalImageState = React.useRef<string>('');
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const { getItem, setItem } = useLocalStorage();
  const [hideDrawer, setHideDrawer] = useState<boolean>(() => {
    const stored = getItem('sidebar');
    return stored === 'true';
  });

  const [userDetails, setUserDetails] = useState({
    addressLine1: '',
    addressLine2: '',
    emailAddress: '',
    birthDate: null,
    city: '',
    avatarURL: '',
    avatar: selectedAvatar,
    countryCode: '',
    description: '',
    educationGrade: '',
    employmentStatus: '',
    homePhoneNumber: '',
    maritalStatus: '',
    mobilePhoneNumber: '',
    name: '',
    natalSex: '',
    naturalLanguageCode: '',
    password: '',
    postalCode: '',
    state: '',
    workPhoneNumber: '',
  });

  // Handle window resize
  useEffect(() => {
    const handleResize = (): void => {
      if (window.innerWidth <= 820) {
        setHideDrawer(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Sync hideDrawer state changes to localStorage using the hook
  useEffect(() => {
    setItem('sidebar', hideDrawer.toString());
  }, [hideDrawer, setItem]);

  // Query and mutation setup
  const { data, loading, error } = useQuery(CURRENT_USER);
  const [updateUser] = useMutation(UPDATE_CURRENT_USER_MUTATION);

  // set the initial data
  useEffect(() => {
    if (data?.currentUser) {
      setUserDetails(data.currentUser);
      originalImageState.current = data.currentUser.avatar || '';
    }
  }, [data]);

  // wait for the query to complete
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const handleUpdateUserDetails = async (): Promise<void> => {
    // Function to remove empty fields from the object
    function removeEmptyFields<T extends Record<string, string | File | null>>(
      obj: T,
    ): Partial<T> {
      return Object.fromEntries(
        Object.entries(obj).filter(
          ([, value]) =>
            value !== null &&
            value !== undefined &&
            (typeof value !== 'string' || value.trim() !== ''),
        ),
      ) as Partial<T>;
    }

    // If no new avatar is selected but there's an avatar URL, convert it to File
    let avatarFile: File | null = null;
    if (!selectedAvatar && userDetails.avatarURL) {
      try {
        avatarFile = await urlToFile(userDetails.avatarURL);
      } catch (error) {
        console.log(error);
        toast.error(
          'Failed to process profile picture. Please try uploading again.',
        );
        return;
      }
    }

    const data: Omit<typeof userDetails, 'avatarURL' | 'emailAddress'> = {
      addressLine1: userDetails.addressLine1,
      addressLine2: userDetails.addressLine2,
      birthDate: userDetails.birthDate,
      city: userDetails.city,
      countryCode: userDetails.countryCode,
      description: userDetails.description,
      educationGrade: userDetails.educationGrade,
      employmentStatus: userDetails.employmentStatus,
      homePhoneNumber: userDetails.homePhoneNumber,
      maritalStatus: userDetails.maritalStatus,
      mobilePhoneNumber: userDetails.mobilePhoneNumber,
      name: userDetails.name,
      natalSex: userDetails.natalSex,
      naturalLanguageCode: userDetails.naturalLanguageCode,
      password: userDetails.password,
      postalCode: userDetails.postalCode,
      state: userDetails.state,
      workPhoneNumber: userDetails.workPhoneNumber,
      avatar: selectedAvatar ? selectedAvatar : avatarFile,
    };

    // Clean the data by removing empty fields
    const input = removeEmptyFields(data);

    // Update the user details
    try {
      const { data: updateData } = await updateUser({ variables: { input } });

      if (updateData) {
        toast.success(
          tCommon('updatedSuccessfully', { item: 'Profile' }) as string,
        );
        setItem('UserImage', updateData.updateCurrentUser.avatarURL);
        setItem('name', updateData.updateCurrentUser.name);
        setItem('email', updateData.updateCurrentUser.emailAddress);
        setItem('id', updateData.updateCurrentUser.id);
        setItem('role', updateData.updateCurrentUser.role);
        setSelectedAvatar(null);

        // wait for the toast to complete
        await new Promise((resolve) => setTimeout(resolve, 2000));

        window.location.reload();
      }
    } catch (error: unknown) {
      errorHandler(t, error);
    }
  };

  const handleFieldChange = (fieldName: string, value: string): void => {
    // check if the password is strong or not
    if (fieldName === 'password' && value) {
      if (!validatePassword(value)) {
        toast.error('Password must be at least 8 characters long.');
        return;
      }
    }

    setIsUpdated(true);
    setUserDetails((prevState) => ({ ...prevState, [fieldName]: value }));
  };

  // Handle avatar upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target?.files?.[0];

    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(file.type)) {
        toast.error('Invalid file type. Please upload a JPEG, PNG, or GIF.');
        return;
      }

      if (file.size > maxSize) {
        toast.error('File is too large. Maximum size is 5MB.');
        return;
      }

      // Update all states properly
      setUserDetails((prevState) => ({ ...prevState, avatar: file }));
      setSelectedAvatar(file); // to show the image to the user before updating the avatar
      setIsUpdated(true);
    }
  };

  // Reset the changes of form fields
  // Note: This function is only called from the rendered form, so data.currentUser
  // and fileInputRef.current are guaranteed to exist at this point
  const handleResetChanges = (): void => {
    setIsUpdated(false);
    setSelectedAvatar(null);
    setUserDetails({
      ...(data?.currentUser as NonNullable<typeof data.currentUser>),
      avatar: originalImageState.current,
    });
    (fileInputRef.current as HTMLInputElement).value = '';
  };

  return (
    <>
      <UserSidebar hideDrawer={hideDrawer} setHideDrawer={setHideDrawer} />
      <div
        className={`d-flex flex-row ${styles.containerHeight} ${
          hideDrawer ? styles.expand : styles.contract
        }`}
        style={{
          marginLeft: hideDrawer ? '100px' : '20px',
          paddingTop: '20px',
        }}
      >
        <div className={styles.mainContainer}>
          <ProfileHeader title={tCommon('settings')} />
          <Row>
            <Col lg={7}>
              <Card border="0" className="rounded-4 mb-4">
                <div className={styles.cardHeader}>
                  <div className={styles.cardTitle}>{t('profileSettings')}</div>
                </div>

                <Card.Body className={styles.userCardBody}>
                  <div>
                    <ProfileImageSection
                      userDetails={userDetails}
                      selectedAvatar={selectedAvatar}
                      fileInputRef={fileInputRef}
                      handleFileUpload={handleFileUpload}
                    />
                  </div>
                  <div>
                    <UserDetailsForm
                      userDetails={userDetails}
                      handleFieldChange={handleFieldChange}
                      isUpdated={isUpdated}
                      handleResetChanges={handleResetChanges}
                      handleUpdateUserDetails={handleUpdateUserDetails}
                      t={t}
                      tCommon={tCommon}
                    />
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={5}>
              <OtherSettings />
              <Card border="0" className="rounded-4 mb-4"></Card>
              <EventsAttendedByUser userDetails={userDetails} t={t} />
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
}
