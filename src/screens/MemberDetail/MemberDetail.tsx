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
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Modal } from 'react-bootstrap';
import styles from 'style/app-fixed.module.css';
import {
  UPDATE_CURRENT_USER_MUTATION,
  DELETE_USER_MUTATION,
} from 'GraphQl/Mutations/mutations';
import { CURRENT_USER } from 'GraphQl/Queries/Queries';
import { toast } from 'react-toastify';
import { languages } from 'utils/languages';
import { errorHandler } from 'utils/errorHandler';
import { Card, Row, Col, Form } from 'react-bootstrap';
import Loader from 'components/Loader/Loader';
import useLocalStorage from 'utils/useLocalstorage';
import Avatar from 'components/Avatar/Avatar';
import MemberAttendedEventsModal from 'components/MemberActivity/Modal/EventsAttendedMemberModal';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {
  countryOptions,
  educationGradeEnum,
  maritalStatusEnum,
  genderEnum,
  languageEnum,
  employmentStatusEnum,
} from 'utils/formEnumFields';
import dayjs from 'dayjs';
import DynamicDropDown from 'components/DynamicDropDown/DynamicDropDown';
import { urlToFile } from 'utils/urlToFile';
import { validatePassword } from 'utils/passwordValidator';
import { sanitizeAvatars } from 'utils/sanitizeAvatar';
import TagIcon from 'assets/svgs/tag.svg?react';
import MemberOrganizationIcon from 'assets/svgs/memberOrganization.svg?react';
import MemberEvents from 'assets/svgs/memberEvents.svg?react';
import OverviewIcon from 'assets/svgs/overview.svg?react';
import DeleteIcon from 'assets/svgs/delete.svg?react';
import ReloadIcon from 'assets/svgs/reload.svg?react';
import SaveIcon from 'assets/svgs/save.svg?react';

type MemberDetailProps = { id?: string };

const MemberDetail: React.FC<MemberDetailProps> = ({ id }): JSX.Element => {
  const { t } = useTranslation('translation', { keyPrefix: 'memberDetail' });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t: tCommon } = useTranslation('common');
  const location = useLocation();
  const isMounted = useRef(true);
  const { getItem, setItem } = useLocalStorage();
  const [show, setShow] = useState(false);
  const [isUpdated, setisUpdated] = useState(false);
  const currentId = location.state?.id || getItem('id') || id;
  const originalImageState = React.useRef<string>('');
  const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const navigate = useNavigate();

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
    adminApproved: false,
    pluginCreationAllowed: false,
  });

  // Mutation to delete the user
  const [deleteUser] = useMutation(DELETE_USER_MUTATION);

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

  useEffect(() => {
    // check component is mounted or not
    return () => {
      isMounted.current = false;
    };
  }, []);

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

  // items for navigation at the top.
  const navItems = [
    {
      to: '/member',
      icon: <OverviewIcon />,
      label: t('navigationOverview'),
    },
    {
      to: '/orgList',
      icon: <MemberOrganizationIcon />,
      label: t('navigationOrganizations'),
    },
    {
      to: '/orgevents',
      icon: <MemberEvents />,
      label: t('navigationEvents'),
    },
    {
      to: '/orgtags',
      icon: <TagIcon />,
      label: t('navigationTags'),
    },
  ];

  // Function to handle the deletion of a user
  const handleDeleteUser = async (): Promise<void> => {
    try {
      // Call mutation with just the ID
      const { data: deleteData } = await deleteUser({
        variables: {
          id: id,
        },
      });

      if (deleteData) {
        toast.success(
          tCommon('deletedSuccessfully', { item: 'User' }) as string,
        );
        setShowDeleteConfirm(false);
      }
    } catch (error: unknown) {
      errorHandler(t, error);
    }
  };

  // to handle the change in the form fields
  const handleFieldChange = (
    fieldName: string,
    value: string,
  ): void => {
    // future birthdates are not possible to select.

    // Check if value is a string
      // Password validation (only for string values)
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
    function removeEmptyFields<
      T extends Record<string, string | File | null | boolean>,
    >(obj: T): Partial<T> {
      return Object.fromEntries(
        Object.entries(obj).filter(
          ([, value]) =>
            value !== null &&
            value !== undefined &&
            (typeof value === 'boolean' ||
              typeof value !== 'string' ||
              value.trim() !== ''),
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
      adminApproved: formState.adminApproved,
      pluginCreationAllowed: formState.pluginCreationAllowed,
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
      {show && (
        <MemberAttendedEventsModal
          eventsAttended={userData?.user?.eventsAttended}
          show={show}
          setShow={setShow}
        />
      )}
      <div
        style={{
          display: 'flex',
          marginTop: '2rem',
          width: 'max',
          padding: '2rem',
        }}
        className={`bg-white gap-4 ${styles.allRound}`}
      >
        <div className={`bg-white gap-4 ${styles.allRound}`}>
          {navItems.map(({ to, icon, label }) => (
            <Link to={to} key={to}>
              <button
                type="button"
                className={`${styles.featuresBox} ${styles.allRound} flex items-center rounded-lg text-gray-100 transition-colors`}
              >
                {icon}
                <h3
                  style={{ margin: 'auto', fontSize: '1rem' }}
                  className="text-gray-100"
                >
                  {label}
                </h3>
              </button>
            </Link>
          ))}
        </div>
      </div>
      <Row className="g-4 mt-1">
        <Col md={8}>
          <Card className={`${styles.allRound}`}>
            <Card.Header
              className={`py-3 px-4 d-flex justify-content-between align-items-center ${styles.topRadius} ${styles.headerStyle}`}
            >
              <h3 className="m-0">{t('personalInfoHeading')}</h3>
              <Button
                type="button"
                variant="light"
                size="sm"
                disabled
                className="rounded-pill fw-bolder"
              >
                {userData?.currentUser?.role === 'administrator'
                  ? 'Admin'
                  : 'User'}
              </Button>
            </Card.Header>
            <Card.Body className="py-3 px-3">
              <Col lg={12} className="mb-2">
                <div className="text-center mb-3">
                  <div className="position-relative d-inline-block">
                    {formState?.avatarURL ? (
                      <img
                        onClick={() => fileInputRef.current?.click()}
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
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        data-testid="uploadImageBtn"
                        style={{
                          cursor: 'pointer',
                          fontSize: '1.2rem',
                          background: 'none',
                          border: 'none',
                          padding: '0px',
                        }}
                        title="Edit profile picture"
                        type="button"
                        aria-label="Edit profile picture"
                        tabIndex={0}
                      >
                        <Avatar
                          name={formState.name}
                          alt="User Image"
                          size={60}
                          radius={150}
                        />
                      </button>
                    )}

                    {/** Removed Logo for file upload **/}
                    {/* <i
                      className="fas fa-edit position-absolute bottom-0 right-0 p-2 bg-white rounded-circle"
                      onClick={() => fileInputRef.current?.click()}
                      data-testid="uploadImageBtn"
                      style={{ cursor: 'pointer', fontSize: '1.2rem' }}
                      title="Edit profile picture"
                      role="button"
                      aria-label="Edit profile picture"
                      tabIndex={0}
                      onKeyDown={(e) =>
                        e.key === 'Enter' && fileInputRef.current?.click()
                      }
                    /> */}
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
                <Col md={9}>
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
                <Col md={3} data-testid="gender">
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
                <Col md={5}>
                  <label htmlFor="birthDate" className="form-label">
                    {t('birthDate')}
                  </label>
                  <DatePicker
                    className={`${styles.dateboxMemberDetail} w-100`}
                    value={dayjs(formState.birthDate)}
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
                <Col md={4}>
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
                <Col md={5}>
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
                <Col md={4}>
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
        </Col>

        <Col lg={4}>
          <Card className={`${styles.contact} ${styles.allRound}`}>
            <Card.Header
              className={`d-flex justify-content-between align-items-center py-3 px-4 ${styles.topRadius} ${styles.headerStyle}`}
            >
              <h3 className="m-0" data-testid="eventsAttended-title">
                {t('personalDetailsHeading')}
              </h3>
            </Card.Header>
            <Card.Body
              id="tagsAssignedScrollableDiv"
              data-testid="tagsAssignedScrollableDiv"
              className={`${styles.cardBody} pe-0`}
            >
              <div className={styles.profileDetailItem}>
                <span>{tCommon('name')}:</span>
                <span>{formState.name}</span>
              </div>
              <div>
                <span>{tCommon('location')}:</span>
                <span>{formState.city}</span>
              </div>
              <div>
                <span>{tCommon('phone')}:</span>
                <span>{formState.workPhoneNumber}</span>
              </div>
            </Card.Body>
          </Card>

          <Card className={`${styles.contact} ${styles.allRound} mt-5`}>
            <Card.Header
              className={`d-flex justify-content-between align-items-center py-3 px-4 ${styles.topRadius} ${styles.headerStyle}`}
            >
              <h3 className="m-0" data-testid="eventsAttended-title">
                {t('actionsHeading')}
              </h3>
            </Card.Header>
            <Card.Body
              id="tagsAssignedScrollableDiv"
              data-testid="tagsAssignedScrollableDiv"
              className={`${styles.cardBody} pe-0`}
            >
              <Row className="mb-3 gap-2">
                <Col md={12} className="mb-3">
                  <Form.Check
                    checked={!!formState.pluginCreationAllowed}
                    className="gap-3 d-flex align-items-center"
                    type="checkbox"
                    onChange={(e) => {
                      setFormState((prevState) => ({
                        ...prevState,
                        pluginCreationAllowed: e.target.checked,
                      }));
                      setisUpdated(true);
                    }}
                    id="pluginCreationAllowed"
                    label={t('pluginCreationAllowed')}
                    style={{ color: '#495057' }}
                    data-testid="pluginCreationForm"
                  />
                </Col>
                <Col md={12}>
                  <Form.Check
                    checked={!!formState.adminApproved}
                    className="gap-3 d-flex align-items-center"
                    onChange={(e) => {
                      setFormState((prevState) => ({
                        ...prevState,
                        adminApproved: e.target.checked,
                      }));
                      setisUpdated(true);
                    }}
                    style={{ color: '#495057' }}
                    type="checkbox"
                    id="adminApproved"
                    label={t('adminApproved')}
                    data-testid="AdminApprovedForm"
                  />
                </Col>
              </Row>
              <Row className="mt-4">
                <Col md={5}>
                  <label
                    htmlFor="language"
                    className="form-label"
                    style={{ color: '#495057' }}
                  >
                    {t('chooseLanguage')}
                  </label>
                  <DynamicDropDown
                    formState={formState}
                    setFormState={setFormState}
                    fieldOptions={languageEnum}
                    fieldName="naturalLanguageCode"
                    handleChange={(e) =>
                      handleFieldChange('naturalLanguageCode', e.target.value)
                    }
                  />
                </Col>

                <Col md={7}>
                  <label
                    htmlFor="deleteUserButton"
                    className="form-label"
                    style={{ color: '#495057' }}
                  >
                    {t('deleteUser')}
                  </label>
                  <Button
                    type="button"
                    data-testid="deleteUserButton"
                    variant="outline-danger"
                    style={{
                      backgroundColor: '#F8D6DC',
                      width: 'fit-content',
                      gap: '0.5rem',
                    }}
                    onClick={(e) => {
                      setShowDeleteConfirm(true);
                    }}
                    className="d-flex align-items-center justify-content-center"
                  >
                    <DeleteIcon />
                    {t('deleteUser')}
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <Modal
            data-testid="confirmationToDelete"
            show={showDeleteConfirm}
            onHide={() => setShowDeleteConfirm(false)}
          >
            <Modal.Header closeButton>
              <Modal.Title>{t('deleteUser')}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{t('deleteUserConfirmationText')}</Modal.Body>
            <Modal.Footer>
              <Button
                data-testid="button-cancelDeleteConfirmation"
                variant="secondary"
                onClick={() => setShowDeleteConfirm(false)}
              >
                {tCommon('cancel')}
              </Button>
              <Button
                data-testid="button-handleDeleteConfirmation"
                variant="danger"
                onClick={handleDeleteUser}
              >
                {t('confirmDelete')}
              </Button>
            </Modal.Footer>
          </Modal>

          {isUpdated && (
            <Row className="mt-4">
              <Col md={12}>
                <Card.Footer className="bg-inherit border-top-0 d-flex justify-content-center gap-2 py-3 px-2">
                  <Button
                    type="button"
                    style={{ color: '#495057' }}
                    className="gap-3"
                    variant="outline-secondary"
                    onClick={resetChanges}
                    data-testid="resetChangesBtn"
                  >
                    <ReloadIcon style={{ marginRight: '0.5rem' }} />
                    {tCommon('resetChanges')}
                  </Button>
                  <Button
                    type="button"
                    style={{ color: '#495057', backgroundColor: '#A8C7FA' }}
                    variant="success"
                    onClick={handleUserUpdate}
                    data-testid="saveChangesBtn"
                  >
                    <SaveIcon style={{ marginRight: '0.5rem' }} />
                    {tCommon('saveChanges')}
                  </Button>
                </Card.Footer>
              </Col>
            </Row>
          )}
        </Col>

        <Col md={8}>
          <Card className={`${styles.allRound}`}>
            <Card.Header
              className={`py-3 px-4 ${styles.topRadius} ${styles.headerStyle}`}
            >
              <h3 className="m-0">{t('contactInfoHeading')}</h3>
            </Card.Header>
            <Card.Body className="py-3 px-3">
              <Row className="g-3">
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
                <Col md={6}>
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
                    placeholder="Ex. +1234567890"
                  />
                </Col>
                <Col md={6}>
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
                    placeholder="Ex. +1234567890"
                  />
                </Col>
                <Col md={6}>
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
                    placeholder="Ex. +1234567890"
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
                <Col md={6}>
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
                    placeholder="Ex. Lane 2"
                  />
                </Col>
                <Col md={6}>
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
                    placeholder="Ex. 12345"
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
                    onChange={(e) => handleFieldChange('city', e.target.value)}
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
                    onChange={(e) => handleFieldChange('state', e.target.value)}
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
                      Select {tCommon('country')}
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
      </Row>

      <Row className="mb-4">
        <Col xs={12} lg={6}>
          <Card className={`${styles.contact} ${styles.allRound} mt-3`}>
            <Card.Header
              className={`d-flex justify-content-between align-items-center py-3 px-4 ${styles.topRadius} ${styles.headerStyle}`}
            >
              <h3 className="m-0" data-testid="eventsAttended-title">
                {t('tagsAssigned')}
              </h3>
            </Card.Header>
            <Card.Body
              id="tagsAssignedScrollableDiv"
              data-testid="tagsAssignedScrollableDiv"
              className={`${styles.cardBody} pe-0`}
            >
              <Row className="p-5">
                <Col md={6} className="mb-3">
                  <div className="border rounded p-3 h-100">
                    <h6 className="text-muted mb-2">Gender</h6>
                    <p className="mb-0 fw-bold">
                      {formState.natalSex || 'Not specified'}
                    </p>
                  </div>
                </Col>
                <Col md={6} className="mb-3">
                  <div className="border rounded p-3 h-100">
                    <h6 className="text-muted mb-2">Education Grade</h6>
                    <p className="mb-0 fw-bold">
                      {formState.educationGrade || 'Not specified'}
                    </p>
                  </div>
                </Col>
                <Col md={6} className="mb-3">
                  <div className="border rounded p-3 h-100">
                    <h6 className="text-muted mb-2">Employment Status</h6>
                    <p className="mb-0 fw-bold">
                      {formState.employmentStatus || 'Not specified'}
                    </p>
                  </div>
                </Col>
                <Col md={6} className="mb-3">
                  <div className="border rounded p-3 h-100">
                    <h6 className="text-muted mb-2">Marital Status</h6>
                    <p className="mb-0 fw-bold">
                      {formState.maritalStatus || 'Not specified'}
                    </p>
                  </div>
                </Col>
                <Col md={6} className="mb-3">
                  <div className="border rounded p-3 h-100">
                    <h6 className="text-muted mb-2">Primary Language</h6>
                    <p className="mb-0 fw-bold">
                      {formState.naturalLanguageCode || 'Not specified'}
                    </p>
                  </div>
                </Col>
                <Col md={6} className="mb-3">
                  <div className="border rounded p-3 h-100">
                    <h6 className="text-muted mb-2">Country</h6>
                    <p className="mb-0 fw-bold">
                      {formState.countryCode || 'Not specified'}
                    </p>
                  </div>
                </Col>
                <Col md={12} className="mb-3">
                  <div className="border rounded p-3 h-100">
                    <h6 className="text-muted mb-2">Birth Date</h6>
                    <p className="mb-0 fw-bold">
                      {formState.birthDate
                        ? new Date(formState.birthDate).toLocaleDateString()
                        : 'Not specified'}
                    </p>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
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
