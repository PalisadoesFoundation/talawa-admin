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
import { useTranslation } from 'react-i18next';
import { useLocation, useParams } from 'react-router';
import styles from './ProfileForm.module.css';
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
import Avatar from 'shared-components/Avatar/Avatar';
import EventsAttendedByMember from 'components/MemberActivity/EventsAttendedByMember';
import MemberAttendedEventsModal from 'components/MemberActivity/Modal/EventsAttendedMemberModal';
import {
  countryOptions,
  educationGradeEnum,
  maritalStatusEnum,
  genderEnum,
  employmentStatusEnum,
} from 'utils/formEnumFields';
import dayjs from 'dayjs';
import DynamicDropDown from 'components/DynamicDropDown/DynamicDropDown';
import { urlToFile } from 'utils/urlToFile';
import { validatePassword } from 'utils/passwordValidator';
import { sanitizeAvatars } from 'utils/sanitizeAvatar';
import type { IEvent } from 'types/Event/interface';
import ProfileFormWrapper from './ProfileFormWrapper';
import DatePicker from 'shared-components/DatePicker';
import { removeEmptyFields, validateImageFile } from 'utils/userUpdateUtils';
import Button from 'shared-components/Button';
import { FormTextField } from 'shared-components/FormFieldGroup/FormTextField';
import { FormFieldGroup } from 'shared-components/FormFieldGroup/FormFieldGroup';

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

  const [formState, setFormState] = useState({
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
    const file = e.target?.files?.[0];

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
  const handleFieldChange = (fieldName: string, value: string): void => {
    // future birthdates are not possible to select.

    // password validation
    if (fieldName === 'password' && value) {
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
            {/* Personal Details Card */}
            <Card className={`${styles.allRound}`}>
              <Card.Header
                className={`py-3 px-4 d-flex justify-content-between align-items-center ${styles.topRadius} ${styles.personalDetailsHeader}`}
              >
                <h3 className="m-0">{t('personalDetailsHeading')}</h3>
                <Button
                  variant="light"
                  size="sm"
                  disabled
                  className="rounded-pill fw-bolder"
                >
                  {userData?.user?.role === 'administrator'
                    ? tCommon('Admin')
                    : tCommon('User')}
                </Button>
              </Card.Header>
              <Card.Body className="py-3 px-3">
                <Col lg={12} className="mb-2">
                  <div className="text-center mb-3">
                    <div className="position-relative d-inline-block">
                      {formState?.avatarURL ? (
                        <img
                          className={`rounded-circle ${styles.profileImage}`}
                          src={sanitizeAvatars(
                            selectedAvatar,
                            formState.avatarURL,
                          )}
                          alt={tCommon('user')}
                          data-testid="profile-picture"
                          crossOrigin="anonymous" // to avoid Cors
                        />
                      ) : (
                        <Avatar
                          name={formState.name}
                          alt={tCommon('displayImage')}
                          size={60}
                          dataTestId="profile-picture"
                          radius={150}
                        />
                      )}
                      <button
                        type="button"
                        className={`fas fa-edit position-absolute border-0 bottom-0 right-0 p-2 bg-white rounded-circle ${styles.editProfileIcon}`}
                        onClick={() => fileInputRef.current?.click()}
                        data-testid="uploadImageBtn"
                        title={`${tCommon('edit')} ${tCommon('profilePicture')}`}
                        aria-label={`${tCommon('edit')} ${tCommon('profilePicture')}`}
                        tabIndex={0}
                        onKeyDown={(e) =>
                          e.key === 'Enter' && fileInputRef.current?.click()
                        }
                      />
                    </div>
                  </div>
                  <input
                    accept="image/*"
                    id="postphoto"
                    name="photo"
                    type="file"
                    className={`${styles.cardControl} ${styles.hiddenFileInput}`}
                    data-testid="fileInput"
                    multiple={false}
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                  />
                </Col>
                <Row className="g-3">
                  <Col md={6}>
                    <FormTextField
                      name="name"
                      label={tCommon('name')}
                      value={formState.name}
                      className={styles.inputColor}
                      data-testid="inputName"
                      onChange={(value) => handleFieldChange('name', value)}
                      required
                      placeholder={tCommon('name')}
                    />
                  </Col>
                  <Col md={6} data-testid="gender">
                    <label htmlFor="gender" className="form-label">
                      {t('gender')}
                    </label>
                    <DynamicDropDown
                      formState={formState}
                      setFormState={setFormState}
                      fieldOptions={genderEnum}
                      fieldName="natalSex"
                      handleChange={(e) =>
                        handleFieldChange('natalSex', e.target.value)
                      }
                    />
                  </Col>
                  <Col md={6}>
                    <label htmlFor="birthDate" className="form-label">
                      {t('birthDate')}
                    </label>
                    <DatePicker
                      className="w-100"
                      value={
                        formState.birthDate ? dayjs(formState.birthDate) : null
                      }
                      maxDate={dayjs()}
                      onChange={(date) => {
                        if (!date || !dayjs(date).isValid()) {
                          handleFieldChange('birthDate', '');
                          return;
                        }
                        const picked = dayjs(date);
                        handleFieldChange(
                          'birthDate',
                          picked.format('YYYY-MM-DD'),
                        );
                      }}
                      data-testid="birthDate"
                      slotProps={{
                        textField: {
                          'aria-label': t('birthDate'),
                        },
                      }}
                    />
                  </Col>
                  <Col md={6}>
                    <label htmlFor="grade" className="form-label">
                      {t('educationGrade')}
                    </label>
                    <DynamicDropDown
                      formState={formState}
                      setFormState={setFormState}
                      fieldOptions={educationGradeEnum}
                      fieldName="educationGrade"
                      handleChange={(e) =>
                        handleFieldChange('educationGrade', e.target.value)
                      }
                    />
                  </Col>
                  <Col md={6}>
                    <label htmlFor="empStatus" className="form-label">
                      {t('employmentStatus')}
                    </label>
                    <DynamicDropDown
                      formState={formState}
                      setFormState={setFormState}
                      fieldOptions={employmentStatusEnum}
                      fieldName="employmentStatus"
                      handleChange={(e) =>
                        handleFieldChange('employmentStatus', e.target.value)
                      }
                    />
                  </Col>
                  <Col md={6}>
                    <label htmlFor="maritalStatus" className="form-label">
                      {t('maritalStatus')}
                    </label>
                    <DynamicDropDown
                      formState={formState}
                      setFormState={setFormState}
                      fieldOptions={maritalStatusEnum}
                      fieldName="maritalStatus"
                      handleChange={(e) =>
                        handleFieldChange('maritalStatus', e.target.value)
                      }
                    />
                  </Col>
                  <Col md={12}>
                    <FormTextField
                      name="password"
                      label={tCommon('password')}
                      value={formState.password}
                      className={styles.inputColor}
                      type="password"
                      onChange={(value) => handleFieldChange('password', value)}
                      data-testid="inputPassword"
                      placeholder="* * * * * * * *"
                    />
                  </Col>
                  <Col md={12}>
                    <FormTextField
                      name="description"
                      label={tCommon('description')}
                      value={formState.description}
                      className={styles.inputColor}
                      type="text"
                      data-testid="inputDescription"
                      onChange={(value) =>
                        handleFieldChange('description', value)
                      }
                      required
                      placeholder={tCommon('enterDescription')}
                    />
                  </Col>
                </Row>
              </Card.Body>
            </Card>
            <Col>
              <Card className={`${styles.contact} ${styles.allRound} mt-3`}>
                <Card.Header
                  className={`d-flex justify-content-between align-items-center py-3 px-4 ${styles.topRadius} ${styles.member_details_style}`}
                >
                  <h3 className="m-0" data-testid="eventsAttended-title">
                    {t('eventsAttended')}
                  </h3>
                  <Button
                    className={styles.contact_btn}
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
                className={`d-flex justify-content-between align-items-center py-3 px-4 ${styles.topRadius} ${styles.member_details_style}`}
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
            <Card className={`${styles.allRound}`}>
              <Card.Header
                className={`py-3 px-4 ${styles.topRadius} ${styles.member_details_style}`}
              >
                <h3 className="m-0">{t('contactInfoHeading')}</h3>
              </Card.Header>
              <Card.Body className="py-3 px-3">
                <Row className="g-3">
                  <Col md={12}>
                    <FormTextField
                      name="email"
                      label={tCommon('email')}
                      value={userData?.user?.emailAddress ?? ''}
                      className={styles.inputColor}
                      type="email"
                      data-testid="inputEmail"
                      disabled
                      placeholder={tCommon('email')}
                      onChange={() => undefined}
                    />
                  </Col>
                  <Col md={12}>
                    <FormTextField
                      name="mobilePhoneNumber"
                      label={t('mobilePhoneNumber')}
                      value={formState.mobilePhoneNumber}
                      className={styles.inputColor}
                      type="tel"
                      data-testid="inputMobilePhoneNumber"
                      onChange={(value) =>
                        handleFieldChange('mobilePhoneNumber', value)
                      }
                      placeholder={
                        tCommon('example', { example: '+1234567890' }) as string
                      }
                    />
                  </Col>
                  <Col md={12}>
                    <FormTextField
                      name="workPhoneNumber"
                      label={t('workPhoneNumber')}
                      value={formState.workPhoneNumber}
                      className={styles.inputColor}
                      type="tel"
                      data-testid="inputWorkPhoneNumber"
                      onChange={(value) =>
                        handleFieldChange('workPhoneNumber', value)
                      }
                      placeholder={
                        tCommon('example', { example: '+1234567890' }) as string
                      }
                    />
                  </Col>
                  <Col md={12}>
                    <FormTextField
                      name="homePhoneNumber"
                      label={t('homePhoneNumber')}
                      value={formState.homePhoneNumber}
                      className={styles.inputColor}
                      type="tel"
                      data-testid="inputHomePhoneNumber"
                      onChange={(value) =>
                        handleFieldChange('homePhoneNumber', value)
                      }
                      placeholder={
                        tCommon('example', { example: '+1234567890' }) as string
                      }
                    />
                  </Col>
                  <Col md={12}>
                    <FormTextField
                      name="addressLine1"
                      label={t('addressLine1')}
                      value={formState.addressLine1}
                      className={styles.inputColor}
                      type="text"
                      data-testid="addressLine1"
                      onChange={(value) =>
                        handleFieldChange('addressLine1', value)
                      }
                      placeholder={
                        tCommon('example', { example: 'Lane 1' }) as string
                      }
                    />
                  </Col>
                  <Col md={12}>
                    <FormTextField
                      name="addressLine2"
                      label={t('addressLine2')}
                      value={formState.addressLine2}
                      className={styles.inputColor}
                      type="text"
                      data-testid="addressLine2"
                      onChange={(value) =>
                        handleFieldChange('addressLine2', value)
                      }
                      placeholder={
                        tCommon('example', { example: 'Lane 2' }) as string
                      }
                    />
                  </Col>
                  <Col md={12}>
                    <FormTextField
                      name="postalCode"
                      label={t('postalCode')}
                      value={formState.postalCode}
                      className={styles.inputColor}
                      type="text"
                      data-testid="inputPostalCode"
                      onChange={(value) =>
                        handleFieldChange('postalCode', value)
                      }
                      placeholder={
                        tCommon('example', {
                          example: '12345',
                        }) as string
                      }
                    />
                  </Col>
                  <Col md={6}>
                    <FormTextField
                      name="city"
                      label={t('city')}
                      value={formState.city}
                      className={styles.inputColor}
                      type="text"
                      data-testid="inputCity"
                      onChange={(value) => handleFieldChange('city', value)}
                      placeholder={tCommon('enterCityName')}
                    />
                  </Col>
                  <Col md={6}>
                    <FormTextField
                      name="state"
                      label={t('state')}
                      value={formState.state}
                      className={styles.inputColor}
                      type="text"
                      data-testid="inputState"
                      onChange={(value) => handleFieldChange('state', value)}
                      placeholder={tCommon('enterStateName')}
                    />
                  </Col>
                  <Col md={12}>
                    <FormFieldGroup
                      name="country"
                      label={tCommon('country')}
                      data-testid="inputCountry"
                    >
                      <select
                        id="country"
                        value={formState.countryCode}
                        className={`${styles.inputColor} form-select`}
                        data-testid="inputCountry"
                        onChange={(e) =>
                          handleFieldChange('countryCode', e.target.value)
                        }
                      >
                        <option value="" disabled>
                          {tCommon('select')} {tCommon('country')}
                        </option>
                        {[...countryOptions]
                          .sort((a, b) => a.label.localeCompare(b.label))
                          .map((country) => (
                            <option
                              key={country.value.toUpperCase()}
                              value={country.value.toLowerCase()}
                              aria-label={tCommon('selectAsYourCountry', {
                                country: country.label,
                              })}
                            >
                              {country.label}
                            </option>
                          ))}
                      </select>
                    </FormFieldGroup>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
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
                  className={styles.member_details_style}
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
