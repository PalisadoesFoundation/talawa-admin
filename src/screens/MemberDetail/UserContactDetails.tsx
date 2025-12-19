/**
 * UserContactDetails Component
 *
 * This component renders a comprehensive profile view for a user, allowing them to
 * view and update their personal and contact information. It supports profile picture
 * upload, form validation, and controlled updates with reset functionality.
 *
 * The component fetches user data by ID, populates editable form fields, and submits
 * updates via GraphQL mutations. Changes are tracked to prevent unnecessary updates.
 *
 * @component
 * @param {MemberDetailProps} props - The props for the component.
 * @param {string} [props.id] - Optional user ID used to fetch profile details.
 *                            If not provided, the ID is resolved from route state
 *                            or local storage.
 *
 * @returns {JSX.Element} The rendered UserContactDetails component.
 *
 * @remarks
 * - Uses Apollo Client's `useQuery` to fetch user data and `useMutation` to update it.
 * - Supports avatar upload with file type and size validation.
 * - Tracks unsaved changes and conditionally displays Save/Reset actions.
 * - Converts existing avatar URLs to File objects when required.
 * - Prevents invalid password updates using custom validation logic.
 * - Uses `react-i18next` for localization and translations.
 * - Stores updated user details in local storage after a successful update.
 *
 * @example
 * ```tsx
 * <UserContactDetails id="12345" />
 * ```
 *
 * @dependencies
 * - `@apollo/client` for GraphQL queries and mutations
 * - `react-bootstrap` for layout and form components
 * - `@mui/x-date-pickers` for date selection
 * - `react-toastify` for user notifications
 * - `dayjs` for date handling
 * - Custom utilities for password validation, avatar sanitization,
 *   local storage handling, and error processing
 *
 */
import React, { useEffect, useRef, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import Button from 'react-bootstrap/Button';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';
import styles from 'style/app-fixed.module.css';
import { UPDATE_CURRENT_USER_MUTATION } from 'GraphQl/Mutations/mutations';
import { GET_USER_BY_ID } from 'GraphQl/Queries/Queries';
import { toast } from 'react-toastify';
import { errorHandler } from 'utils/errorHandler';
import { Card, Row, Col, Form } from 'react-bootstrap';
import Loader from 'components/Loader/Loader';
import useLocalStorage from 'utils/useLocalstorage';
import Avatar from 'components/Avatar/Avatar';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
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

type MemberDetailProps = { id?: string };

const UserContactDetails: React.FC<MemberDetailProps> = ({
  id,
}): JSX.Element => {
  const { t } = useTranslation('translation', { keyPrefix: 'memberDetail' });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t: tCommon } = useTranslation('common');
  const location = useLocation();
  const isMounted = useRef(true);
  const { getItem, setItem } = useLocalStorage();
  const [isUpdated, setisUpdated] = useState(false);
  const currentId = location.state?.id || getItem('id') || id;
  // console.log('Current User ID:', currentId);
  const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null);

  document.title = t('title');

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
  const [updateUser] = useMutation(UPDATE_CURRENT_USER_MUTATION, {
    update(cache, { data }) {
      if (!data) return;
      cache.writeQuery({
        query: GET_USER_BY_ID,
        variables: { input: { id: currentId } },
        data: { user: data.updateCurrentUser },
      });
    },
  });

  //   const { data: data, loading } = useQuery(CURRENT_USER, {
  //     variables: { id: currentId },
  //   });
  // console.log('User Data:', data);

  const { data, loading } = useQuery(GET_USER_BY_ID, {
    variables: {
      input: {
        id: currentId,
      },
    },
    skip: !currentId,
  });

  // console.log('Fetched User:', data.user);

  useEffect(() => {
    if (!data?.user) return;

    setFormState((prev) => ({
      ...prev,
      ...data.user,
    }));
  }, [data]);

  useEffect(() => {
    // check component is mounted or not
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedAvatar) return;

    const previewUrl = URL.createObjectURL(selectedAvatar);
    return () => URL.revokeObjectURL(previewUrl);
  }, [selectedAvatar]);

  // Function to handle the click on the edit icon
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target?.files?.[0];

    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(file.type)) {
        toast.error(t('invalidFileType'));
        return;
      }

      if (file.size > maxSize) {
        toast.error(t('fileTooLarge'));
        return;
      }

      // Update all states properly
      setFormState((prevState) => ({ ...prevState, avatar: file }));
      setSelectedAvatar(file); // to show the image to the user before updating the avatar
      setisUpdated(true);
    }
  };

  // to handle the change in the form fields
  const handleFieldChange = (fieldName: string, value: string) => {
    setisUpdated(true);
    setFormState((prev) => ({
      ...prev,
      [fieldName]: value, // value as YYYY-MM-DD string
    }));
  };

  // Function to handle the update of the user details
  const handleUserUpdate = async (): Promise<void> => {
    // Remove empty fields from the form state
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

    if (formState.password) {
      const errorMsg = validatePassword(formState.password);
      if (errorMsg) {
        toast.error(errorMsg);
        return;
      }
    }

    // If no new avatar is selected but there's an avatar URL, convert it to File
    let avatarFile: File | null = null;
    if (!selectedAvatar && formState?.avatarURL) {
      try {
        avatarFile = await urlToFile(formState.avatarURL);
      } catch {
        toast.error(
          'Failed to process profile picture. Please try uploading again.',
        );
        return;
      }
    }

    const data: Omit<typeof formState, 'avatarURL' | 'emailAddress'> = {
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
    };

    const input = removeEmptyFields(data);

    // Update the user details
    try {
      const { data: updateData } = await updateUser({ variables: { input } });

      console.log('Update Response:', updateData);

      if (updateData) {
        const updatedUser = updateData.updateCurrentUser;

        toast.success(
          tCommon('updatedSuccessfully', { item: 'Profile' }) as string,
        );
        setItem('UserImage', updatedUser.avatarURL);
        setItem('name', updatedUser.name);
        setItem('email', updatedUser.emailAddress);
        setItem('id', updatedUser.id);
        setItem('role', updatedUser.role);
        setSelectedAvatar(null);
        setisUpdated(false);
      }
    } catch (error: unknown) {
      errorHandler(t, error);
    }
  };

  const resetChanges = (): void => {
    setisUpdated(false);
    if (data?.user) {
      setFormState({
        ...data.user,
      });
    }
  };

  if (loading || !data?.user) {
    return <Loader />;
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Row className="g-4 mt-1">
        <Col md={6}>
          {/* Personal Details Card */}
          <Card className={`${styles.allRound}`}>
            <Card.Header
              className={`py-3 px-4 d-flex justify-content-between align-items-center ${styles.topRadius}`}
              style={{ backgroundColor: '#A8C7FA', color: '#555' }}
            >
              <h3 className="m-0">{t('personalDetailsHeading')}</h3>
              <Button
                variant="light"
                size="sm"
                disabled
                className="rounded-pill fw-bolder"
              >
                {data?.user?.role === 'administrator' ? 'Admin' : 'User'}
              </Button>
            </Card.Header>
            <Card.Body className="py-3 px-3">
              <Col lg={12} className="mb-2">
                <div className="text-center mb-3">
                  <div className="position-relative d-inline-block">
                    {formState?.avatarURL ? (
                      <img
                        className="rounded-circle"
                        style={{
                          width: '60px',
                          height: '60px',
                          objectFit: 'cover',
                        }}
                        src={
                          selectedAvatar
                            ? URL.createObjectURL(selectedAvatar)
                            : formState.avatarURL
                        }
                        alt={tCommon('user')}
                        data-testid="profile-picture"
                        crossOrigin="anonymous"
                      />
                    ) : (
                      <Avatar
                        name={formState.name}
                        alt={tCommon('userImage')}
                        size={60}
                        dataTestId="profile-picture"
                        radius={150}
                      />
                    )}
                    <i
                      className="fas fa-edit position-absolute bottom-0 right-0 p-2 bg-white rounded-circle"
                      onClick={() => fileInputRef.current?.click()}
                      data-testid="uploadImageBtn"
                      style={{ cursor: 'pointer', fontSize: '1.2rem' }}
                      title={tCommon('userEditProfilePicture')}
                      role="button"
                      aria-label={tCommon('userEditProfilePicture')}
                      tabIndex={0}
                      onKeyDown={(e) =>
                        e.key === 'Enter' && fileInputRef.current?.click()
                      }
                    />
                  </div>
                </div>
                <Form.Control
                  accept="image/*"
                  id="postphoto"
                  name="photo"
                  type="file"
                  className={styles.cardControl}
                  data-testid="fileInput"
                  multiple={false}
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
              </Col>
              <Row className="g-3">
                <Col md={6}>
                  <label htmlFor="name" className="form-label">
                    {tCommon('name')}
                  </label>
                  <input
                    id="name"
                    value={formState.name}
                    className={`form-control ${styles.inputColor}`}
                    type="text"
                    name="name"
                    data-testid="inputName"
                    onChange={(e) => handleFieldChange('name', e.target.value)}
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
                    className={`${styles.dateboxMemberDetail} w-100`}
                    value={
                      formState.birthDate ? dayjs(formState.birthDate) : null
                    }
                    onChange={(date) =>
                      handleFieldChange(
                        'birthDate',
                        date ? date.format('YYYY-MM-DD') : '',
                      )
                    }
                    data-testid="birthDate"
                    slotProps={{
                      textField: {
                        inputProps: {
                          'data-testid': 'birthDate',
                          'aria-label': t('birthDate'),
                        },
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
                  <label htmlFor="password" className="form-label">
                    {tCommon('password')}
                  </label>
                  <input
                    id="password"
                    value={formState.password}
                    className={`form-control ${styles.inputColor}`}
                    type="password"
                    name="password"
                    onChange={(e) =>
                      handleFieldChange('password', e.target.value)
                    }
                    data-testid="inputPassword"
                    placeholder="* * * * * * * *"
                  />
                </Col>
                <Col md={12}>
                  <label htmlFor="description" className="form-label">
                    {tCommon('description')}
                  </label>
                  <input
                    id="description"
                    value={formState.description}
                    className={`form-control ${styles.inputColor}`}
                    type="text"
                    name="description"
                    data-testid="inputDescription"
                    onChange={(e) =>
                      handleFieldChange('description', e.target.value)
                    }
                    required
                    placeholder={tCommon('enterDescrip')}
                  />
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className={`${styles.allRound}`}>
            <Card.Header
              className={`py-3 px-4 ${styles.topRadius}`}
              style={{ backgroundColor: '#A8C7FA', color: '#555' }}
            >
              <h3 className="m-0">{t('contactInfoHeading')}</h3>
            </Card.Header>
            <Card.Body className="py-3 px-3">
              <Row className="g-3">
                <Col md={12}>
                  <label htmlFor="email" className="form-label">
                    {tCommon('email')}
                  </label>
                  <input
                    id="email"
                    value={data?.user?.emailAddress}
                    className={`form-control ${styles.inputColor}`}
                    type="email"
                    name="email"
                    data-testid="inputEmail"
                    disabled
                    placeholder={tCommon('email')}
                  />
                </Col>
                <Col md={12}>
                  <label htmlFor="phoneNumber" className="form-label">
                    {t('mobilePhoneNumber')}
                  </label>
                  <input
                    id="mobilePhoneNumber"
                    value={formState.mobilePhoneNumber}
                    className={`form-control ${styles.inputColor}`}
                    type="tel"
                    name="mobilePhoneNumber"
                    data-testid="inputMobilePhoneNumber"
                    onChange={(e) =>
                      handleFieldChange('mobilePhoneNumber', e.target.value)
                    }
                    placeholder={tCommon('memberDetailNumberExample')}
                  />
                </Col>
                <Col md={12}>
                  <label htmlFor="phoneNumber" className="form-label">
                    {t('workPhoneNumber')}
                  </label>
                  <input
                    id="workPhoneNumber"
                    value={formState.workPhoneNumber}
                    className={`form-control ${styles.inputColor}`}
                    type="tel"
                    data-testid="inputWorkPhoneNumber"
                    name="workPhoneNumber"
                    onChange={(e) =>
                      handleFieldChange('workPhoneNumber', e.target.value)
                    }
                    placeholder={tCommon('memberDetailNumberExample')}
                  />
                </Col>
                <Col md={12}>
                  <label htmlFor="phoneNumber" className="form-label">
                    {t('homePhoneNumber')}
                  </label>
                  <input
                    id="homePhoneNumber"
                    value={formState.homePhoneNumber}
                    className={`form-control ${styles.inputColor}`}
                    type="tel"
                    data-testid="inputHomePhoneNumber"
                    name="homePhoneNumber"
                    onChange={(e) =>
                      handleFieldChange('homePhoneNumber', e.target.value)
                    }
                    placeholder={tCommon('memberDetailNumberExample')}
                  />
                </Col>
                <Col md={12}>
                  <label htmlFor="address" className="form-label">
                    {t('addressLine1')}
                  </label>
                  <input
                    id="addressLine1"
                    value={formState.addressLine1}
                    className={`form-control ${styles.inputColor}`}
                    type="text"
                    name="addressLine1"
                    data-testid="addressLine1"
                    onChange={(e) =>
                      handleFieldChange('addressLine1', e.target.value)
                    }
                    placeholder={tCommon('memberDetailExampleLane')}
                  />
                </Col>
                <Col md={12}>
                  <label htmlFor="address" className="form-label">
                    {t('addressLine2')}
                  </label>
                  <input
                    id="addressLine2"
                    value={formState.addressLine2}
                    className={`form-control ${styles.inputColor}`}
                    type="text"
                    name="addressLine2"
                    data-testid="addressLine2"
                    onChange={(e) =>
                      handleFieldChange('addressLine2', e.target.value)
                    }
                    placeholder={tCommon('memberDetailExampleLane')}
                  />
                </Col>
                <Col md={12}>
                  <label htmlFor="address" className="form-label">
                    {t('postalCode')}
                  </label>
                  <input
                    id="postalCode"
                    value={formState.postalCode}
                    className={`form-control ${styles.inputColor}`}
                    type="text"
                    name="postalCode"
                    data-testid="inputPostalCode"
                    onChange={(e) =>
                      handleFieldChange('postalCode', e.target.value)
                    }
                    placeholder={tCommon('memberDetailPostalExample')}
                  />
                </Col>
                <Col md={6}>
                  <label htmlFor="city" className="form-label">
                    {t('city')}
                  </label>
                  <input
                    id="city"
                    value={formState.city}
                    className={`form-control ${styles.inputColor}`}
                    type="text"
                    name="city"
                    data-testid="inputCity"
                    onChange={(e) => handleFieldChange('city', e.target.value)}
                    placeholder={tCommon('enterCity')}
                  />
                </Col>
                <Col md={6}>
                  <label htmlFor="state" className="form-label">
                    {t('state')}
                  </label>
                  <input
                    id="state"
                    value={formState.state}
                    className={`form-control ${styles.inputColor}`}
                    type="text"
                    name="state"
                    data-testid="inputState"
                    onChange={(e) => handleFieldChange('state', e.target.value)}
                    placeholder={tCommon('enterCity')}
                  />
                </Col>
                <Col md={12}>
                  <Form.Label htmlFor="country" className="form-label">
                    {tCommon('country')}
                  </Form.Label>
                  <Form.Select
                    id="country"
                    value={formState.countryCode}
                    className={`${styles.inputColor}`}
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
                          aria-label={`${tCommon('select')} ${country.label} ${tCommon('asYourCountry')}`}
                        >
                          {country.label}
                        </option>
                      ))}
                  </Form.Select>
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
                style={{ backgroundColor: '#A8C7FA', color: '#555' }}
                onClick={handleUserUpdate}
                data-testid="saveChangesBtn"
              >
                {tCommon('saveChanges')}
              </Button>
            </Card.Footer>
          </Col>
        )}
      </Row>
    </LocalizationProvider>
  );
};

export default UserContactDetails;
