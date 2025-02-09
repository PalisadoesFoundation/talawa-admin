import React, { useEffect, useRef, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import Button from 'react-bootstrap/Button';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import styles from '../../style/app.module.css';
import { UPDATE_CURRENT_USER_MUTATION } from 'GraphQl/Mutations/mutations';
import { CURRENT_USER } from 'GraphQl/Queries/Queries';
import { toast } from 'react-toastify';
import { languages } from 'utils/languages';
import { errorHandler } from 'utils/errorHandler';
import { Card, Row, Col, Form } from 'react-bootstrap';
import Loader from 'components/Loader/Loader';
import useLocalStorage from 'utils/useLocalstorage';
import Avatar from 'components/Avatar/Avatar';
import MemberAttendedEventsModal from '../../components/MemberDetail/EventsAttendedMemberModal';
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

type MemberDetailProps = {
  id?: string;
};

/**
 * MemberDetail component is used to display the details of a user.
 * It also allows the user to update the details. It uses the UPDATE_USER_MUTATION to update the user details.
 * It uses the USER_DETAILS query to get the user details. It uses the useLocalStorage hook to store the user details in the local storage.
 * @param id - The id of the user whose details are to be displayed.
 * @returns  React component
 *
 */
const MemberDetail: React.FC<MemberDetailProps> = ({ id }): JSX.Element => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'memberDetail',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t: tCommon } = useTranslation('common');
  const location = useLocation();
  const isMounted = useRef(true);
  const { getItem, setItem } = useLocalStorage();
  const [show, setShow] = useState(false);
  const currentId = location.state?.id || getItem('id') || id;
  const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null);

  document.title = t('title');
  const [formState, setFormState] = useState({
    addressLine1: '',
    addressLine2: '',
    birthDate: null,
    city: '',
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

  const handleEditIconClick = (): void => {
    fileInputRef.current?.click();
  };
  const [updateUser] = useMutation(UPDATE_CURRENT_USER_MUTATION);
  const {
    data: userData,
    loading,
    refetch: refetchUserDetails,
    fetchMore: fetchMoreAssignedTags,
  } = useQuery(CURRENT_USER, {
    variables: { id: currentId },
  });

  const [isUpdated, setisUpdated] = useState(false);
  useEffect(() => {
    if (userData && isMounted.current) {
      setFormState({
        ...formState,
        name: userData?.currentUser?.name,
        naturalLanguageCode: userData?.naturalLanguageCode,
        natalSex: userData?.currentUser?.natalSex,
        birthDate: userData?.currentUser?.birthDate,
        educationGrade: userData?.currentUser?.educationGrade,
        employmentStatus: userData?.currentUser?.employmentStatus,
        maritalStatus: userData?.currentUser?.maritalStatus,
        mobilePhoneNumber: userData?.currentUser?.mobilePhoneNumber,
        homePhoneNumber: userData?.currentUser?.homePhoneNumber,
        workPhoneNumber: userData?.currentUser?.workPhoneNumber,
        addressLine1: userData.currentUser?.addressLine1,
        addressLine2: userData.currentUser?.addressLine2,
        state: userData?.currentUser?.state,
        city: userData?.currentUser?.city,
        countryCode: userData?.currentUser?.countryCode,
        avatar: userData?.currentUser?.avatar,
        postalCode: userData?.currentUser?.postalCode,
        description: userData?.currentUser?.description,
      });
    }
  }, [userData]);
  useEffect(() => {
    // check component is mounted or not
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleFieldChange = (fieldName: string, value: string): void => {
    if (fieldName === 'birthDate') {
      const today = new Date();
      const selectedDate = new Date(value);
      if (selectedDate > today) {
        console.error('Future dates are not allowed for birth date.');
        return;
      }
    }

    setisUpdated(true);
    setFormState((prevState) => ({
      ...prevState,
      [fieldName]: value,
    }));
  };

  const handleUserUpdate = async (): Promise<void> => {
    // Remove empty fields from the form state
    function removeEmptyFields(obj: typeof formState) {
      return Object.fromEntries(
        Object.entries(obj).filter(
          ([_, value]) =>
            value !== null &&
            value !== undefined &&
            (typeof value !== 'string' || value.trim() !== ''),
        ),
      );
    }

    const input = removeEmptyFields(formState);

    try {
      const name = formState.name;
      const emailAddress = userData?.currentUser?.emailAddress;
      const avatar = formState.avatar;

      try {
        const { data } = await updateUser({
          variables: { input },
        });

        if (data) {
          setisUpdated(false);
          if (getItem('id') === currentId) {
            setItem('Name', name);
            setItem('Email', emailAddress);
            setItem('Avatar', avatar);
          }
          toast.success(tCommon('successfullyUpdated') as string);

          // wait for 2 seconds to complete the update
          await new Promise((resolve) => setTimeout(resolve, 2000));

          // refresh the screen
          window.location.reload();
        }
      } catch (error: unknown) {
        console.log('Error is: ', error);
        if (error instanceof Error) {
          errorHandler(t, error);
        }
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        errorHandler(t, error);
      }
    }
  };
  const resetChanges = (): void => {
    setFormState({
      name: userData?.currentUser?.name || '',
      naturalLanguageCode: userData?.currentUser?.naturalLanguageCode || '',
      avatar: userData?.currentUser?.avatar || '',
      natalSex: userData?.currentUser?.natalSex || '',
      employmentStatus: userData?.currentUser?.employmentStatus || '',
      maritalStatus: userData?.currentUser?.maritalStatus || '',
      mobilePhoneNumber: userData?.currentUser?.mobilePhoneNumber || '',
      addressLine1: userData?.currentUser?.addressLine1 || '',
      addressLine2: userData?.currentUser?.addressLine2 || '',
      countryCode: userData?.currentUser?.address?.countryCode || '',
      city: userData?.currentUser?.address?.city || '',
      state: userData?.currentUser?.address?.state || '',
      birthDate: userData?.currentUser?.birthDate || '',
      educationGrade: userData?.currentUser?.educationGrade || '',
      postalCode: userData?.currentUser?.postalCode || '',
      description: userData?.currentUser?.description || '',
      workPhoneNumber: userData?.currentUser?.workPhoneNumber || '',
      homePhoneNumber: userData?.currentUser?.homePhoneNumber || '',
      password: '',
    });
    setisUpdated(false);
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
      <Row className="g-4 mt-1">
        <Col md={6}>
          <Card className={`${styles.allRound}`}>
            <Card.Header
              className={`bg-success text-white py-3 px-4 d-flex justify-content-between align-items-center ${styles.topRadius}`}
            >
              <h3 className="m-0">{t('personalDetailsHeading')}</h3>
              <Button
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
              <div className="text-center mb-3">
                {formState?.avatar ? (
                  <div className="position-relative d-inline-block">
                    <img
                      className="rounded-circle"
                      style={{ width: '55px', aspectRatio: '1/1' }}
                      src={
                        formState.avatar instanceof File
                          ? URL.createObjectURL(formState.avatar)
                          : formState.avatar
                      }
                      alt="User"
                      data-testid="userImagePresent"
                    />
                    <i
                      className="fas fa-edit position-absolute bottom-0 right-0 p-1 bg-white rounded-circle"
                      onClick={handleEditIconClick}
                      style={{ cursor: 'pointer' }}
                      data-testid="editImage"
                      title="Edit profile picture"
                      role="button"
                      aria-label="Edit profile picture"
                      tabIndex={0}
                      onKeyDown={(e) =>
                        e.key === 'Enter' && handleEditIconClick()
                      }
                    />
                  </div>
                ) : (
                  <div className="position-relative d-inline-block">
                    <Avatar
                      name={formState.name}
                      alt="User Image"
                      size={55}
                      dataTestId="userImageAbsent"
                      radius={150}
                    />
                    <i
                      className="fas fa-edit position-absolute bottom-0 right-0 p-1 bg-white rounded-circle"
                      onClick={handleEditIconClick}
                      data-testid="editImage"
                      style={{ cursor: 'pointer' }}
                    />
                  </div>
                )}
                <input
                  type="file"
                  id="orgphoto"
                  name="photo"
                  accept="image/*"
                  onChange={(e) => handleFieldChange('avatar', e.target.value)}
                  data-testid="organisationImage"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                />
              </div>
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
                    value={dayjs(formState.birthDate)}
                    onChange={(e) =>
                      handleFieldChange('birthDate', e?.target.value || '')
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
        <Col md={6}>
          <Card className={`${styles.allRound}`}>
            <Card.Header
              className={`bg-success text-white py-3 px-4 ${styles.topRadius}`}
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
                    value={userData?.currentUser?.emailAddress}
                    className={`form-control ${styles.inputColor}`}
                    type="email"
                    name="email"
                    data-testid="inputEmail"
                    disabled
                    onChange={(e) =>
                      handleFieldChange('emailAddress', e.target.value)
                    }
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
                    placeholder="Ex. +1234567890"
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
                    placeholder="Ex. +1234567890"
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
                    placeholder="Ex. Lane 2"
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
                    placeholder="Ex. 12345"
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
                    placeholder="Enter city name"
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
                    placeholder="Enter state name"
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
        {isUpdated && (
          <Col md={12}>
            <Card.Footer className="bg-white border-top-0 d-flex justify-content-end gap-2 py-3 px-2">
              <Button
                variant="outline-secondary"
                onClick={resetChanges}
                data-testid="resetChangesBtn"
              >
                {tCommon('resetChanges')}
              </Button>
              <Button
                variant="success"
                onClick={handleUserUpdate}
                data-testid="saveChangesBtn"
              >
                {tCommon('saveChanges')}
              </Button>
            </Card.Footer>
          </Col>
        )}
      </Row>

      <Row className="mb-4">
        <Col xs={12} lg={6}>
          <Card className={`${styles.contact} ${styles.allRound} mt-3`}>
            <Card.Header
              className={`bg-primary d-flex justify-content-between align-items-center py-3 px-4 ${styles.topRadius}`}
            >
              <h3 className="text-white m-0" data-testid="eventsAttended-title">
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
