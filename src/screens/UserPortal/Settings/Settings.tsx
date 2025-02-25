import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from '../../../style/app-fixed.module.css';
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
import SidebarToggle from './SideToggle/SideToggle';
import ProfileHeader from './ProfileHeader/ProfileHeader';
import ProfileImageSection from './ProfileImageSection/ProfileImageSection';
import UserDetailsForm from './UserDetails/UserDetails';
import { validatePassword } from 'utils/passwordValidator';

/**
 * The Settings component allows users to view and update their profile settings.
 * It includes functionality to handle image uploads, reset changes, and save updated user details.
 *
 * @returns The Settings component.
 */
export default function Settings(): JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'settings' });
  const { t: tCommon } = useTranslation('common');
  const [isUpdated, setIsUpdated] = useState<boolean>(false);
  const [hideDrawer, setHideDrawer] = useState<boolean | null>(null);
  const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null);
  const originalImageState = React.useRef<string>('');
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { setItem } = useLocalStorage();

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
      setHideDrawer(window.innerWidth <= 820);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

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
      const { data: updateData } = await updateUser({
        variables: { input },
      });

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
    // check if the birth date is not in the future
    if (fieldName === 'birthDate') {
      const today = new Date();
      const selectedDate = new Date(value);
      if (selectedDate > today) {
        toast.error('Future dates are not allowed for birth date.');
        return;
      }
    }

    // check if the password is strong or not
    if (fieldName === 'password' && value) {
      if (!validatePassword(value)) {
        toast.error('Password must be at least 8 characters long.');
        return;
      }
    }

    setIsUpdated(true);
    setUserDetails((prevState) => ({
      ...prevState,
      [fieldName]: value,
    }));
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
      setUserDetails((prevState) => ({
        ...prevState,
        avatar: file,
      }));
      setSelectedAvatar(file); // to show the image to the user before updating the avatar
      setIsUpdated(true);
    }
  };

  // Reset the changes of form fields
  const handleResetChanges = (): void => {
    setIsUpdated(false);
    setSelectedAvatar(null);
    if (data?.currentUser) {
      setUserDetails({
        ...data.currentUser,
        avatar: originalImageState.current,
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <>
      <SidebarToggle hideDrawer={hideDrawer} setHideDrawer={setHideDrawer} />
      <UserSidebar hideDrawer={hideDrawer} setHideDrawer={setHideDrawer} />
      <div
        className={`d-flex flex-row ${styles.containerHeight} ${
          hideDrawer === null
            ? ''
            : hideDrawer
              ? styles.expand
              : styles.contract
        }`}
      >
        <div className={styles.mainContainer}>
          <ProfileHeader title={tCommon('settings')} />
          <Row>
            <Col lg={7}>
              <Card border="0" className="rounded-4 mb-4">
                <div className={styles.cardHeader}>
                  <div className={styles.cardTitle}>{t('profileSettings')}</div>
                </div>
                <Card.Body className={styles.cardBody}>
                  <ProfileImageSection
                    userDetails={userDetails}
                    selectedAvatar={selectedAvatar}
                    fileInputRef={fileInputRef}
                    handleFileUpload={handleFileUpload}
                  />
                  <UserDetailsForm
                    userDetails={userDetails}
                    handleFieldChange={handleFieldChange}
                    isUpdated={isUpdated}
                    handleResetChanges={handleResetChanges}
                    handleUpdateUserDetails={handleUpdateUserDetails}
                    t={t}
                    tCommon={tCommon}
                  />
                </Card.Body>
              </Card>
            </Col>
            <Col lg={5}>
              <OtherSettings />
            </Col>
          </Row>
          {/* EventsAttendedByUser component can be added once events queries start working */}
          {/* <EventsAttendedByUser userDetails={userDetails} t={t} /> */}
        </div>
      </div>
    </>
  );
}
