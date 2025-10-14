/**
 * MemberDetail Component
 *
 * This component renders the detailed view of a member's profile, allowing users to view and update personal and contact information.
 * It includes features such as avatar upload, form validation, and dynamic dropdowns for various fields.
 *
 * @component
 * @param {MemberDetailProps} props - The props for the component.
 * @param {string} [props.id] - Optional member ID to fetch and display details.
 *
 * @returns {JSX.Element} The rendered MemberDetail component.
 *
 * @remarks
 * - Uses Apollo Client's `useQuery` and `useMutation` hooks for fetching and updating user data.
 * - Includes form validation for fields like password and avatar upload.
 * - Utilizes `react-bootstrap` and `@mui/x-date-pickers` for UI components.
 * - Handles localization using `react-i18next`.
 *
 * @example
 * ```tsx
 * <MemberDetail id="12345" />
 * ```
 *
 * @dependencies
 * - `@apollo/client` for GraphQL queries and mutations.
 * - `react-bootstrap` for UI components.
 * - `@mui/x-date-pickers` for date selection.
 * - `react-toastify` for toast notifications.
 * - `dayjs` for date manipulation.
 *
 *
 */
import React, { useEffect, useRef, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import Button from 'react-bootstrap/Button';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';
import styles from 'style/app-fixed.module.css';
import { UPDATE_CURRENT_USER_MUTATION } from 'GraphQl/Mutations/mutations';
import { CURRENT_USER } from 'GraphQl/Queries/Queries';
import { toast } from 'react-toastify';
import { languages } from 'utils/languages';
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
import { sanitizeAvatars } from 'utils/sanitizeAvatar';
import SaveIcon from '@mui/icons-material/Save';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import EditIcon from '@mui/icons-material/Edit';

type MemberDetailProps = { id?: string };

const MemberDetail: React.FC<MemberDetailProps> = ({ id }): JSX.Element => {
  const { t } = useTranslation('translation', { keyPrefix: 'memberDetail' });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t: tCommon } = useTranslation('common');
  const location = useLocation();
  const { getItem, setItem } = useLocalStorage();
  const [isUpdated, setisUpdated] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'tags'>('overview');
  const currentId = location.state?.id || getItem('id') || id;
  const originalImageState = React.useRef<string>('');
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
  const [updateUser] = useMutation(UPDATE_CURRENT_USER_MUTATION);
  const { data: userData, loading } = useQuery(CURRENT_USER, {
    variables: { id: currentId },
  });

  useEffect(() => {
    if (userData?.currentUser) {
      setFormState(userData.currentUser);
      originalImageState.current = userData.currentUser.avatarURL || '';
    }
  }, [userData]);

  // Function to handle the click on the edit icon
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
      setFormState((prevState) => ({ ...prevState, avatar: file }));
      setSelectedAvatar(file); // to show the image to the user before updating the avatar
      setisUpdated(true);
    }
  };

  // to handle the change in the form fields
  const handleFieldChange = (fieldName: string, value: string): void => {
    // Prevent future birthdates
    if (fieldName === 'birthDate' && value) {
      if (dayjs(value).isAfter(dayjs(), 'day')) return;
    }

    // password validation
    if (fieldName === 'password' && value) {
      if (!validatePassword(value)) {
        toast.error('Password must be at least 8 characters long.');
        return;
      }
    }

    setisUpdated(true);
    setFormState((prevState) => ({ ...prevState, [fieldName]: value }));
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

    // If no new avatar is selected but there's an avatar URL, convert it to File
    let avatarFile: File | null = null;
    if (!selectedAvatar && formState.avatarURL) {
      try {
        avatarFile = await urlToFile(formState.avatarURL);
      } catch (error) {
        console.log(error);
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

  const resetChanges = (): void => {
    setisUpdated(false);
    if (userData?.currentUser) {
      setFormState({
        ...userData.currentUser,
        avatar: originalImageState.current,
      });
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      {/* Custom Tabs */}
      <div className="bg-white p-4 rounded shadow-sm mb-4">
        <div
          className="d-flex gap-3"
          role="tablist"
          aria-label="Member details tabs"
        >
          <button
            type="button"
            className={`btn ${activeTab === 'overview' ? styles.activeTab : styles.inActiveTab}`}
            onClick={() => setActiveTab('overview')}
            data-testid="overviewTab"
            role="tab"
            aria-selected={activeTab === 'overview' ? 'true' : 'false'}
            aria-controls="overview-panel"
            id="overview-tab"
          >
            <i className="fas fa-th-large me-2"></i>
            {t('personalDetailsHeading')}
          </button>
          <button
            type="button"
            className={`btn ${activeTab === 'tags' ? styles.activeTab : styles.inActiveTab}`}
            onClick={() => setActiveTab('tags')}
            data-testid="tagsTab"
            role="tab"
            aria-selected={activeTab === 'tags' ? 'true' : 'false'}
            aria-controls="tags-panel"
            id="tags-tab"
          >
            <i className="fas fa-tags me-2"></i>
            {t('tagsAssigned')}
          </button>
        </div>
      </div>

      {/* Overview Tab Content */}
      {activeTab === 'overview' && (
        <div role="tabpanel" id="overview-panel" aria-labelledby="overview-tab">
          <Row className="g-4 mt-1">
            <Col md={8}>
              <Card className={`${styles.allRound}`}>
                <Card.Header
                  className={`${styles.memberDetailCardHeader} py-3 px-4 ${styles.topRadius}`}
                >
                  <h3 className="m-0">{t('personalInfoHeading')}</h3>
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
                            src={sanitizeAvatars(
                              selectedAvatar,
                              formState.avatarURL,
                            )}
                            alt="User"
                            data-testid="profile-picture"
                            crossOrigin="anonymous" // to avoid Cors
                          />
                        ) : (
                          <Avatar
                            name={formState.name}
                            alt="User Image"
                            size={60}
                            dataTestId="profile-picture"
                            radius={150}
                          />
                        )}
                        <button
                          type="button"
                          className="position-absolute bottom-0 end-0 p-2 bg-white rounded-circle border-0 shadow-sm"
                          data-testid="uploadImageBtn"
                          style={{ cursor: 'pointer' }}
                          title="Edit profile picture"
                          aria-label="Edit profile picture"
                          tabIndex={0}
                          onClick={() => fileInputRef.current?.click()}
                          onKeyDown={(e) =>
                            e.key === 'Enter' && fileInputRef.current?.click()
                          }
                        >
                          <EditIcon sx={{ fontSize: 16, color: '#1976d2' }} />
                        </button>
                      </div>
                    </div>
                    <Form.Control
                      accept="image/jpeg,image/png,image/gif"
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
                        onChange={(e) =>
                          handleFieldChange('name', e.target.value)
                        }
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
                        value={dayjs(formState.birthDate)}
                        disableFuture
                        onChange={(date) =>
                          handleFieldChange(
                            'birthDate',
                            date ? date.toISOString().split('T')[0] : '',
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
                        placeholder="Enter description"
                      />
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              {/* Contact Information Card */}
              <Card className={`${styles.allRound} mt-4`}>
                <Card.Header
                  className={`${styles.memberDetailCardHeader} py-3 px-4 ${styles.topRadius}`}
                >
                  <h3 className="m-0">{t('contactInfoHeading')}</h3>
                </Card.Header>
                <Card.Body className="py-3 px-3">
                  <Row className="g-3">
                    <Col md={6}>
                      <label htmlFor="mobilePhoneNumber" className="form-label">
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
                        placeholder="Ex. +1234567890"
                      />
                    </Col>
                    <Col md={6}>
                      <label htmlFor="email" className="form-label">
                        {tCommon('email')}
                      </label>
                      <input
                        id="email"
                        value={userData?.currentUser?.emailAddress}
                        className={`form-control ${styles.inputColor}`}
                        type="email"
                        name="email"
                        data-testid="inputEmail"
                        disabled
                        placeholder={tCommon('email')}
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
                        placeholder="Ex. Lane 2"
                      />
                    </Col>
                    <Col md={4}>
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
                        onChange={(e) =>
                          handleFieldChange('city', e.target.value)
                        }
                        placeholder="Enter city name"
                      />
                    </Col>
                    <Col md={4}>
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
                        onChange={(e) =>
                          handleFieldChange('state', e.target.value)
                        }
                        placeholder="Enter state name"
                      />
                    </Col>
                    <Col md={4}>
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
                          Select
                        </option>
                        {[...countryOptions]
                          .sort((a, b) => a.label.localeCompare(b.label))
                          .map((country) => (
                            <option
                              key={country.value.toUpperCase()}
                              value={country.value.toLowerCase()}
                              aria-label={`Select ${country.label} as your country`}
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

            <Col md={4}>
              {/* Profile Details Card */}
              <Card className={`${styles.allRound} mb-4`}>
                <Card.Header
                  className={`${styles.memberDetailCardHeader} py-3 px-4 ${styles.topRadius}`}
                >
                  <h3 className="m-0">{t('personalDetailsHeading')}</h3>
                </Card.Header>
                <Card.Body className="py-3 px-3">
                  <div className="d-flex align-items-center mb-3">
                    <span className="me-2">Status:</span>
                    <Button
                      variant="light"
                      size="sm"
                      disabled
                      className="rounded-pill fw-bolder"
                      data-testid="roleButton"
                    >
                      {userData?.currentUser?.role === 'administrator'
                        ? tCommon('admin') || 'Admin'
                        : tCommon('user') || 'User'}
                    </Button>
                  </div>
                </Card.Body>
              </Card>

              {/* Actions Card */}
              <Card className={`${styles.allRound}`}>
                <Card.Header
                  className={`${styles.memberDetailCardHeader} py-3 px-4 ${styles.topRadius}`}
                >
                  <h3 className="m-0">{t('actionsHeading')}</h3>
                </Card.Header>
                <Card.Body className="py-3 px-3">
                  <div className="mb-3">
                    <div className="form-check mb-2">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="pluginCreation"
                        disabled
                        checked={false}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="pluginCreation"
                      >
                        Plugin Creation Allowed
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="adminApproved"
                        disabled
                        checked={false}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="adminApproved"
                      >
                        Admin Approved
                      </label>
                    </div>
                  </div>
                  <div className="d-flex gap-2 mb-3">
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      className="flex-grow-1"
                    >
                      <i className="fas fa-language me-2"></i>
                      Choose Language
                    </Button>
                  </div>
                  <Button
                    variant="danger"
                    size="sm"
                    className="w-100"
                    data-testid="deleteUserBtn"
                  >
                    <i className="fas fa-trash me-2"></i>
                    Delete User
                  </Button>
                </Card.Body>
              </Card>

              {/* Save/Reset Changes Buttons */}
              {isUpdated && (
                <div className="d-flex gap-2 mt-4">
                  <Button
                    variant="outline-secondary"
                    onClick={resetChanges}
                    data-testid="resetChangesBtn"
                    className="d-flex align-items-center justify-content-center gap-2 py-2 flex-grow-1"
                  >
                    <RestartAltIcon sx={{ fontSize: 20 }} />
                    {tCommon('resetChanges')}
                  </Button>
                  <Button
                    onClick={handleUserUpdate}
                    data-testid="saveChangesBtn"
                    className={`${styles.editButton} d-flex align-items-center justify-content-center gap-2 py-2 flex-grow-1`}
                  >
                    <SaveIcon sx={{ fontSize: 20 }} />
                    {tCommon('saveChanges')}
                  </Button>
                </div>
              )}
            </Col>
          </Row>
        </div>
      )}

      {/* Tags Tab Content */}
      {activeTab === 'tags' && (
        <div role="tabpanel" id="tags-panel" aria-labelledby="tags-tab">
          <Card className={`${styles.contact} ${styles.allRound}`}>
            <Card.Header
              className={`${styles.memberDetailCardHeader} d-flex justify-content-between align-items-center py-3 px-4 ${styles.topRadius}`}
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
        </div>
      )}
    </LocalizationProvider>
  );
};

export const prettyDate = (param: string): string => {
  const date = new Date(param);
  if (date?.toDateString() === 'Invalid Date') {
    return 'Unavailable';
  }
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};
export const getLanguageName = (code: string): string => {
  let language = 'Unavailable';
  languages.map((data) => {
    if (data.code == code) {
      language = data.name;
    }
  });
  return language;
};

export default MemberDetail;
