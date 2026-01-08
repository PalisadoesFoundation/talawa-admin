/**
 * ProfileForm Component - Unified Profile Management
 *
 * This component provides a comprehensive profile management interface that handles
 * three distinct use cases:
 * - **User Profile**: When users view/edit their own profile (/user/settings)
 * - **Member Profile**: When admins view/edit organization member profiles (/member/:orgId/:userId)
 * - **Admin Profile**: When super admins view/edit admin profiles (/adminprofile/settings)
 *
 * The component intelligently adapts its behavior and UI based on the context:
 * - Uses different GraphQL mutations (UPDATE_CURRENT_USER vs UPDATE_USER_MUTATION)
 * - Conditionally renders UserSidebar for user profile views via ProfileFormWrapper
 * - Handles localStorage updates for current user profile changes
 * - Provides role-specific form validation and field accessibility
 *
 * @param props - The component props
 * @param id - Optional member ID for admin viewing member profiles
 *
 * @returns The rendered ProfileForm component with context-appropriate layout
 *
 * @remarks
 * **Features:**
 * - **Avatar Management**: Upload, preview, and update profile pictures with validation
 * - **Form Validation**: Email, password, file type/size, and required field validation
 * - **Dynamic Dropdowns**: Country selection, education grade, employment status, marital status, gender
 * - **Internationalization**: Full i18n support with react-i18next
 * - **Responsive Design**: Adaptive layout for different screen sizes and contexts
 * - **Real-time Updates**: Immediate form state management and change tracking
 * - **Events Integration**: Display attended events for organization members
 * - **Tag Management**: Show assigned tags for organization members
 *
 *
 * **Context Behavior:**
 *
 * **User Profile Context** (`/user/settings`):
 * - Uses UPDATE_CURRENT_USER_MUTATION
 * - Updates localStorage on successful save
 * - Wrapped with UserSidebar via ProfileFormWrapper
 * - Triggers window.location.reload after save
 *
 * **Admin/Member Context** (`/member/:orgId/:userId`, `/adminprofile/settings`):
 * - Uses UPDATE_USER_MUTATION mutation
 * - No localStorage updates
 * - Direct rendering without sidebar wrapper
 * - Standard success notification
 *
 *
 * **Validation Rules:**
 * - **Avatar**: JPEG/PNG/GIF only, max 5MB
 * - **Password**: Minimum 8 characters if provided
 * - **Email**: Valid email format required
 * - **Birth Date**: Cannot be in the future
 * - **Phone Numbers**: Accepts international format
 *
 * @example
 * ```tsx
 * // User profile (with sidebar)
 * <ProfileForm />
 *
 * // Admin viewing member profile
 * <ProfileForm id="member-user-id" />
 *
 * // Super admin profile
 * <ProfileForm />
 * ```
 *
 *
 * **Dependencies:**
 * - `\@apollo/client` - GraphQL queries and mutations
 * - `react-bootstrap` - UI components and layout
 * - `@mui/x-date-pickers` - Date/time picker components
 * - `react-i18next` - Internationalization
 * - `ProfileFormWrapper` - Conditional sidebar wrapper for user context
 * - `NotificationToast` - Success/error notifications
 * - `dayjs` - Date manipulation and formatting
 */
import React, { useEffect, useRef, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import Button from 'react-bootstrap/Button';
import { useTranslation } from 'react-i18next';
import { useLocation, useParams } from 'react-router';
import styles from 'style/app-fixed.module.css';
import memberDetailStyles from './MemberDetail.module.css';
import {
  UPDATE_CURRENT_USER_MUTATION,
  UPDATE_USER_MUTATION,
} from 'GraphQl/Mutations/mutations';
import { USER_DETAILS } from 'GraphQl/Queries/Queries';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import { languages } from 'utils/languages';
import { errorHandler } from 'utils/errorHandler';
import { Card, Row, Col } from 'react-bootstrap';
import LoadingState from 'shared-components/LoadingState/LoadingState';
import useLocalStorage from 'utils/useLocalstorage';
import EventsAttendedByMember from 'components/MemberActivity/EventsAttendedByMember';
import MemberAttendedEventsModal from 'components/MemberActivity/Modal/EventsAttendedMemberModal';
import { urlToFile } from 'utils/urlToFile';
import { validatePassword } from 'utils/passwordValidator';
import type { IEvent } from 'types/Event/interface';
import ProfileFormWrapper from './ProfileFormWrapper';
import { removeEmptyFields, validateImageFile } from 'utils/userUpdateUtils';
import ProfilePersonalDetails from './ProfilePersonalDetails';
import ProfileContactInfo from './ProfileContactInfo';
import { IProfileFormState } from './types';

const MemberDetail: React.FC = (): JSX.Element => {
  const { t } = useTranslation('translation', { keyPrefix: 'memberDetail' });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t: tCommon } = useTranslation('common');
  const location = useLocation();
  const params = useParams();
  const { getItem, setItem } = useLocalStorage();
  const [show, setShow] = useState(false);
  const [isUpdated, setisUpdated] = useState(false);
  const originalImageState = React.useRef<string>('');
  const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null);
  const [hideDrawer, setHideDrawer] = useState<boolean>(() => {
    const stored = getItem('sidebar');
    return stored === 'true';
  });
  // isUser determines weather the profile being viewed is of the logged-in user or another member
  const isUser = location.pathname.split('/')[1] === 'user';
  const isAdmin = location.pathname.split('/')[1] === 'admin';
  const userId: string =
    (!(isUser || isAdmin)
      ? params.userId
      : getItem('userId') || getItem('id')) || '';
  useEffect(() => {
    document.title = t('title');
  }, [t]);

  const [formState, setFormState] = useState<IProfileFormState>({
    addressLine1: '',
    addressLine2: '',
    birthDate: null,
    emailAddress: '',
    city: '',
    avatar: selectedAvatar,
    avatarURL: '',
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

  // Mutation to update the user details
  const [updateUser] = useMutation(UPDATE_USER_MUTATION);
  const [updateCurrentUser] = useMutation(UPDATE_CURRENT_USER_MUTATION);
  const { data: userData, loading } = useQuery(USER_DETAILS, {
    variables: {
      input: {
        id: userId,
      },
    },
  });

  useEffect(() => {
    if (userData?.user) {
      setFormState(userData.user);
      originalImageState.current = userData.user?.avatarURL || '';
    }
  }, [userData]);

  // Function to handle the click on the edit icon
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>): void => {
    // Use currentTarget for type safety - guaranteed to be HTMLInputElement
    const { files } = e.currentTarget;

    if (!files || files.length === 0) {
      return;
    }

    const file = files[0];

    const isValid = validateImageFile(file, tCommon);
    if (!isValid || !file) {
      return;
    }
    // Update all states properly
    setFormState((prevState) => ({ ...prevState, avatar: file }));
    setSelectedAvatar(file); // to show the image to the user before updating the avatar
    setisUpdated(true);
  };

  // to handle the change in the form fields
  const handleFieldChange = (
    fieldName: keyof IProfileFormState,
    value: string | File | null,
  ): void => {
    // future birthdates are not possible to select.

    // password validation
    if (fieldName === 'password' && typeof value === 'string' && value) {
      if (!validatePassword(value)) {
        NotificationToast.error(
          tCommon('passwordLengthRequirement', { length: 8 }) as string,
        );
        return;
      }
    }

    setisUpdated(true);
    setFormState((prevState) => ({ ...prevState, [fieldName]: value }));
  };

  // Function to handle the update of the user details
  const handleUserUpdate = async (): Promise<void> => {
    // If no new avatar is selected but there's an avatar URL, convert it to File
    let avatarFile: File | null = null;
    if (!selectedAvatar && formState.avatarURL) {
      try {
        avatarFile = await urlToFile(formState.avatarURL);
      } catch {
        NotificationToast.error(tCommon('profilePictureUploadError') as string);
        return;
      }
    }

    const data: Omit<typeof formState, 'avatarURL' | 'emailAddress'> & {
      id?: string;
    } = {
      addressLine1: formState.addressLine1,
      addressLine2: formState.addressLine2,
      birthDate: formState.birthDate,
      city: formState.city,
      countryCode: formState.countryCode,
      description: formState.description,
      educationGrade: formState.educationGrade,
      employmentStatus: formState.employmentStatus,
      homePhoneNumber: formState.homePhoneNumber,
      maritalStatus: formState.maritalStatus,
      mobilePhoneNumber: formState.mobilePhoneNumber,
      name: formState.name,
      natalSex: formState.natalSex,
      naturalLanguageCode: formState.naturalLanguageCode,
      password: formState.password,
      postalCode: formState.postalCode,
      state: formState.state,
      workPhoneNumber: formState.workPhoneNumber,
      avatar: selectedAvatar ? selectedAvatar : avatarFile,
      ...(!isUser && !isAdmin ? { id: userId } : {}),
    };

    const input = removeEmptyFields(data);

    // Update the user details
    try {
      const { data: updateData } =
        isUser || isAdmin
          ? await updateCurrentUser({ variables: { input } })
          : await updateUser({ variables: { input } });
      if (updateData) {
        NotificationToast.success(
          tCommon('updatedSuccessfully', { item: 'Profile' }) as string,
        );
        if (isUser || isAdmin) {
          setItem('UserImage', updateData.updateCurrentUser.avatarURL);
          setItem('name', updateData.updateCurrentUser.name);
          setItem('email', updateData.updateCurrentUser.emailAddress);
          setItem('id', updateData.updateCurrentUser.id);
          setItem('role', updateData.updateCurrentUser.role);
        }
        setSelectedAvatar(null);

        setisUpdated(false);
      }
    } catch (error: unknown) {
      errorHandler(t, error);
    }
  };

  const handleEventsAttendedModal = (): void => {
    setShow(!show);
  };

  const resetChanges = (): void => {
    setisUpdated(false);
    if (userData?.user) {
      setFormState({
        ...userData.user,
        avatar: originalImageState.current,
      });
    }
  };

  return (
    <LoadingState isLoading={loading} variant="spinner">
      {show && (
        <MemberAttendedEventsModal
          eventsAttended={userData?.user?.eventsAttended}
          show={show}
          setShow={setShow}
        />
      )}
      <ProfileFormWrapper
        isUser={isUser}
        hideDrawer={hideDrawer}
        setHideDrawer={setHideDrawer}
        tCommon={tCommon}
      >
        <Row className="g-4 mt-1">
          <Col md={6}>
            <ProfilePersonalDetails
              formState={formState}
              setFormState={setFormState}
              handleFieldChange={handleFieldChange}
              selectedAvatar={selectedAvatar}
              fileInputRef={fileInputRef}
              handleFileUpload={handleFileUpload}
              userRole={userData?.user?.role}
            />
            <Col>
              <Card className={`${styles.contact} ${styles.allRound} mt-3`}>
                <Card.Header
                  className={`d-flex justify-content-between align-items-center py-3 px-4 ${styles.topRadius} ${memberDetailStyles.member_details_style}`}
                >
                  <h3 className="m-0" data-testid="eventsAttended-title">
                    {t('eventsAttended')}
                  </h3>
                  <Button
                    className={memberDetailStyles.contact_btn}
                    size="sm"
                    variant="light"
                    data-testid="viewAllEvents"
                    onClick={handleEventsAttendedModal}
                  >
                    {t('viewAll')}
                  </Button>
                </Card.Header>
                <Card.Body
                  className={`${styles.cardBody} px-4 ${styles.scrollableCardBody}`}
                >
                  {!userData?.user?.eventsAttended?.length ? (
                    <div
                      className={`${styles.emptyContainer} w-100 h-100 d-flex justify-content-center align-items-center fw-semibold text-secondary`}
                    >
                      {t('noeventsAttended')}
                    </div>
                  ) : (
                    userData.user.eventsAttended.map(
                      (event: IEvent, index: number) => (
                        <span data-testid="membereventsCard" key={index}>
                          <EventsAttendedByMember
                            eventsId={event.id}
                            key={index}
                          />
                        </span>
                      ),
                    )
                  )}
                </Card.Body>
              </Card>
            </Col>
            <Card className={`${styles.contact} ${styles.allRound} mt-3`}>
              <Card.Header
                className={`d-flex justify-content-between align-items-center py-3 px-4 ${styles.topRadius} ${memberDetailStyles.member_details_style}`}
              >
                <h3 className="m-0" data-testid="tagsAssigned-title">
                  {t('tagsAssigned')}
                </h3>
              </Card.Header>
              <Card.Body
                id="tagsAssignedScrollableDiv"
                data-testid="tagsAssignedScrollableDiv"
                className={`${styles.cardBody} pe-0`}
              ></Card.Body>
            </Card>
          </Col>

          <Col md={6}>
            <ProfileContactInfo
              formState={formState}
              userEmail={userData?.user?.emailAddress}
              handleFieldChange={handleFieldChange}
            />
          </Col>

          {isUpdated && (
            <Col md={12}>
              <Card.Footer className=" border-top-0 d-flex justify-content-end gap-2 py-3 px-2">
                <Button
                  variant="outline-secondary"
                  onClick={resetChanges}
                  data-testid="resetChangesBtn"
                >
                  {tCommon('resetChanges')}
                </Button>
                <Button
                  variant="outline"
                  className={memberDetailStyles.member_details_style}
                  onClick={handleUserUpdate}
                  data-testid="saveChangesBtn"
                >
                  {tCommon('saveChanges')}
                </Button>
              </Card.Footer>
            </Col>
          )}
        </Row>
      </ProfileFormWrapper>
    </LoadingState>
  );
};

export const getLanguageName = (code: string): string | null => {
  const found = languages.find((data) => data.code === code);
  return found?.name ?? null;
};

export default MemberDetail;
