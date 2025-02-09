import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './Settings.module.css';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { UPDATE_CURRENT_USER_MUTATION } from 'GraphQl/Mutations/mutations';
import { useMutation, useQuery } from '@apollo/client';
import { errorHandler } from 'utils/errorHandler';
import { toast } from 'react-toastify';
import { CURRENT_USER } from 'GraphQl/Queries/Queries';
import useLocalStorage from 'utils/useLocalstorage';
import {
  educationGradeEnum,
  employmentStatusEnum,
  genderEnum,
  maritalStatusEnum,
} from 'utils/formEnumFields';
import OtherSettings from 'components/UserProfileSettings/OtherSettings';
import UserSidebar from 'components/UserPortal/UserSidebar/UserSidebar';
import ProfileDropdown from 'components/ProfileDropdown/ProfileDropdown';
import Avatar from 'components/Avatar/Avatar';
import '../../../style/app.module.css';
import EventsAttendedByUser from 'components/UserPortal/UserProfile/EventsAttendedByUser';
import UserAddressFields from 'components/UserPortal/UserProfile/UserAddressFields';
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

  const { setItem } = useLocalStorage();

  // get details about current user
  const { data } = useQuery(CURRENT_USER);

  // mutation to update current user details
  const [updateUser] = useMutation(UPDATE_CURRENT_USER_MUTATION);

  const [userDetails, setUserDetails] = useState({
    addressLine1: '',
    addressLine2: '',
    emailAddress: '',
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

  const originalImageState = React.useRef<string>('');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleResize = (): void => {
    if (window.innerWidth <= 820) {
      setHideDrawer(!hideDrawer);
    }
  };

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleUpdateUserDetails = async (): Promise<void> => {
    // takes an object and removes all the empty fields
    function removeEmptyFields(obj: typeof userDetails) {
      return Object.fromEntries(
        Object.entries(obj).filter(
          ([_, value]) =>
            value !== null &&
            value !== undefined &&
            (typeof value !== 'string' || value.trim() !== ''),
        ),
      );
    }

    const data = {
      addressLine1: userDetails.addressLine1,
      addressLine2: userDetails.addressLine2,
      birthDate: userDetails.birthDate,
      emailAddress: '', // do not update email
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
      avatar: userDetails.avatar instanceof File ? userDetails.avatar : null,
    };

    // Clean the data by removing empty fields
    const input = removeEmptyFields(data);

    try {
      const { data: updateData } = await updateUser({
        variables: { input: input },
      });
      if (updateData) {
        toast.success(
          tCommon('updatedSuccessfully', { item: 'Profile' }) as string,
        );
        setItem('name', userDetails.name);

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
        console.error('Future dates are not allowed for birth date.');
        return;
      }
    }

    setIsUpdated(true);
    setUserDetails((prevState) => ({
      ...prevState,
      [fieldName]: value,
    }));
  };

  const fileUploadHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      setSelectedAvatar(file);
      setIsUpdated(true);
    }
  };

  const handleResetChanges = (): void => {
    setIsUpdated(false);
    if (data?.currentUser) {
      setUserDetails({
        ...data.currentUser,
        avataar: originalImageState.current,
      });
    }
  };

  useEffect(() => {
    if (data?.currentUser) {
      setUserDetails(data.currentUser);
      originalImageState.current = data.currentUser.avatar || '';
    }
  }, [data]);

  return (
    <>
      {hideDrawer ? (
        <Button
          className={styles.opendrawer}
          onClick={(): void => {
            setHideDrawer(!hideDrawer);
          }}
          data-testid="openMenu"
        >
          <i className="fa fa-angle-double-right" aria-hidden="true"></i>
        </Button>
      ) : (
        <Button
          className={styles.collapseSidebarButton}
          onClick={(): void => {
            setHideDrawer(!hideDrawer);
          }}
          data-testid="closeMenu"
        >
          <i className="fa fa-angle-double-left" aria-hidden="true"></i>
        </Button>
      )}
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
        <div className={`${styles.mainContainer}`}>
          <div className="d-flex justify-content-between align-items-center">
            <div style={{ flex: 1 }}>
              <h1>{tCommon('settings')}</h1>
            </div>
            <ProfileDropdown />
          </div>
          <h3>{tCommon('settings')}</h3>
          <Row>
            <Col lg={7}>
              <Card border="0" className="rounded-4 mb-4">
                <div className={`${styles.cardHeader}`}>
                  <div className={`${styles.cardTitle}`}>
                    {t('profileSettings')}
                  </div>
                </div>
                <Card.Body className={`${styles.cardBody}`}>
                  <Row className="mb-1">
                    <Col lg={12} className="mb-2">
                      <div className="text-center mb-3">
                        <div className="position-relative d-inline-block">
                          {userDetails?.avatar ? (
                            <img
                              className="rounded-circle"
                              style={{
                                width: '60px',
                                height: '60px',
                                objectFit: 'cover',
                              }}
                              src={
                                userDetails.avatar instanceof File
                                  ? URL.createObjectURL(userDetails.avatar)
                                  : userDetails.avatar
                              }
                              alt="User"
                              data-testid="profile-picture"
                            />
                          ) : (
                            <Avatar
                              name={userDetails.name}
                              alt="User Image"
                              size={60}
                              dataTestId="profile-picture"
                              radius={150}
                            />
                          )}
                          <i
                            className="fas fa-edit position-absolute bottom-0 right-0 p-2 bg-white rounded-circle"
                            onClick={(e) => fileInputRef.current?.click()}
                            data-testid="uploadImageBtn"
                            style={{ cursor: 'pointer', fontSize: '1.2rem' }}
                            title="Edit profile picture"
                            role="button"
                            aria-label="Edit profile picture"
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
                        onChange={fileUploadHandler}
                        style={{ display: 'none' }}
                      />
                    </Col>
                    <Col lg={4}>
                      <Form.Label
                        htmlFor="inputName"
                        className={`${styles.cardLabel}`}
                      >
                        {tCommon('name')}
                      </Form.Label>
                      <Form.Control
                        type="text"
                        id="inputName"
                        value={userDetails.name}
                        onChange={(e) =>
                          handleFieldChange('name', e.target.value)
                        }
                        className={`${styles.cardControl}`}
                        data-testid="inputName"
                      />
                    </Col>
                    <Col lg={4}>
                      <Form.Label
                        htmlFor="gender"
                        className={`${styles.cardLabel}`}
                      >
                        {t('gender')}
                      </Form.Label>
                      <Form.Control
                        as="select"
                        id="gender"
                        value={userDetails.natalSex}
                        onChange={(e) =>
                          handleFieldChange('natalSex', e.target.value)
                        }
                        className={`${styles.cardControl}`}
                        data-testid="inputGender"
                      >
                        <option value="" disabled>
                          {t('sgender')}
                        </option>
                        {genderEnum.map((g) => (
                          <option key={g.value.toLowerCase()} value={g.value}>
                            {g.label}
                          </option>
                        ))}
                      </Form.Control>
                    </Col>
                    <Col lg={4}>
                      <Form.Label
                        htmlFor="inputPassword"
                        className={`${styles.cardLabel}`}
                      >
                        {tCommon('password')}
                      </Form.Label>
                      <Form.Control
                        type="password"
                        id="inputPassword"
                        data-testid="inputPassword"
                        placeholder="enter new password"
                        onChange={(e) =>
                          handleFieldChange('password', e.target.value)
                        }
                        className={`${styles.cardControl}`}
                      />
                    </Col>
                  </Row>
                  <Row className="mb-1">
                    <Col lg={4}>
                      <Form.Label
                        htmlFor="inputEmail"
                        className={`${styles.cardLabel}`}
                      >
                        {tCommon('emailAddress')}
                      </Form.Label>
                      <Form.Control
                        type="email"
                        id="inputEmail"
                        data-testid="inputEmail"
                        value={userDetails.emailAddress}
                        className={`${styles.cardControl}`}
                        disabled
                      />
                    </Col>
                    <Col lg={4}>
                      <Form.Label
                        htmlFor="phoneNo"
                        className={`${styles.cardLabel}`}
                      >
                        {t('phoneNumber')}
                      </Form.Label>
                      <Form.Control
                        type="tel"
                        id="phoneNo"
                        placeholder={t('phone')}
                        value={userDetails.mobilePhoneNumber}
                        onChange={(e) =>
                          handleFieldChange('mobilePhoneNumber', e.target.value)
                        }
                        className={`${styles.cardControl}`}
                        data-testid="inputPhoneNumber"
                      />
                    </Col>
                    <Col lg={4}>
                      <Form.Label
                        htmlFor="phoneNo"
                        className={`${styles.cardLabel}`}
                      >
                        {t('homePhoneNumber')}
                      </Form.Label>
                      <Form.Control
                        type="tel"
                        id="homePhoneNo"
                        placeholder={t('phone')}
                        value={userDetails.homePhoneNumber}
                        onChange={(e) =>
                          handleFieldChange('homePhoneNumber', e.target.value)
                        }
                        className={`${styles.cardControl}`}
                        data-testid="inputHomePhoneNumber"
                      />
                    </Col>
                    <Col lg={4}>
                      <Form.Label
                        htmlFor="workPhoneNo"
                        className={`${styles.cardLabel}`}
                      >
                        {t('workPhoneNumber')}
                      </Form.Label>
                      <Form.Control
                        type="tel"
                        id="workPhoneNo"
                        placeholder={t('phone')}
                        value={userDetails.workPhoneNumber}
                        onChange={(e) =>
                          handleFieldChange('workPhoneNumber', e.target.value)
                        }
                        className={`${styles.cardControl}`}
                        data-testid="inputWorkPhoneNumber"
                      />
                    </Col>
                    <Col lg={4}>
                      <Form.Label
                        htmlFor="birthDate"
                        className={`${styles.cardLabel}`}
                      >
                        {t('birthDate')}
                      </Form.Label>
                      <Form.Control
                        type="date"
                        id="birthDate"
                        value={userDetails.birthDate || ''}
                        onChange={(e) =>
                          handleFieldChange('birthDate', e.target.value)
                        }
                        className={`${styles.cardControl}`}
                        max={new Date().toISOString().split('T')[0]}
                      />
                    </Col>
                    <Col lg={4}>
                      <Form.Label
                        htmlFor="grade"
                        className={`${styles.cardLabel}`}
                      >
                        {t('grade')}
                      </Form.Label>
                      <Form.Control
                        as="select"
                        id="grade"
                        value={userDetails.educationGrade}
                        onChange={(e) =>
                          handleFieldChange('educationGrade', e.target.value)
                        }
                        className={`${styles.cardControl}`}
                        data-testid="inputGrade"
                      >
                        <option value="" disabled>
                          {t('gradePlaceholder')}
                        </option>
                        {educationGradeEnum.map((grade) => (
                          <option
                            key={grade.value.toLowerCase()}
                            value={grade.value}
                          >
                            {grade.label}
                          </option>
                        ))}
                      </Form.Control>
                    </Col>
                  </Row>
                  <Row className="mb-1">
                    <Col lg={4}>
                      <Form.Label
                        htmlFor="empStatus"
                        className={`${styles.cardLabel}`}
                      >
                        {t('empStatus')}
                      </Form.Label>
                      <Form.Control
                        as="select"
                        id="empStatus"
                        value={userDetails.employmentStatus}
                        onChange={(e) =>
                          handleFieldChange('employmentStatus', e.target.value)
                        }
                        className={`${styles.cardControl}`}
                        data-testid="inputEmpStatus"
                      >
                        <option value="" disabled>
                          {t('sEmpStatus')}
                        </option>
                        {employmentStatusEnum.map((status) => (
                          <option
                            key={status.value.toLowerCase()}
                            value={status.value}
                          >
                            {status.label}
                          </option>
                        ))}
                      </Form.Control>
                    </Col>
                    <Col lg={4}>
                      <Form.Label
                        htmlFor="maritalStatus"
                        className={`${styles.cardLabel}`}
                      >
                        {t('maritalStatus')}
                      </Form.Label>
                      <Form.Control
                        as="select"
                        id="maritalStatus"
                        value={userDetails.maritalStatus}
                        onChange={(e) =>
                          handleFieldChange('maritalStatus', e.target.value)
                        }
                        className={`${styles.cardControl}`}
                        data-testid="inputMaritalStatus"
                      >
                        <option value="" disabled>
                          {t('sMaritalStatus')}
                        </option>
                        {maritalStatusEnum.map((status) => (
                          <option
                            key={status.value.toLowerCase()}
                            value={status.value}
                          >
                            {status.label}
                          </option>
                        ))}
                      </Form.Control>
                    </Col>
                  </Row>
                  <br />
                  <h5>{tCommon('address')} :-</h5>
                  <UserAddressFields
                    tCommon={tCommon}
                    t={t}
                    handleFieldChange={handleFieldChange}
                    userDetails={userDetails}
                  />
                  <Row className="mb-1">
                    <Col lg={12}>
                      <Form.Label
                        htmlFor="description"
                        className={`${styles.cardLabel}`}
                      >
                        {t('description')}
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        id="description"
                        placeholder={t('enterDescription')}
                        value={userDetails.description}
                        onChange={(e) =>
                          handleFieldChange('description', e.target.value)
                        }
                        className={`${styles.cardControl}`}
                        rows={3}
                        data-testid="inputDescription"
                      />
                    </Col>
                  </Row>
                  {isUpdated && (
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginTop: '1.5em',
                      }}
                    >
                      <Button
                        onClick={handleResetChanges}
                        variant="outline-success"
                        data-testid="resetChangesBtn"
                      >
                        {t('resetChanges')}
                      </Button>
                      <Button
                        onClick={handleUpdateUserDetails}
                        data-testid="updateUserBtn"
                        className={`${styles.cardButton}`}
                      >
                        {tCommon('saveChanges')}
                      </Button>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
            <Col lg={5} className="d-none d-lg-block">
              <OtherSettings />
            </Col>
            <Col lg={5} className="d-lg-none">
              <OtherSettings />
            </Col>
          </Row>
          <EventsAttendedByUser userDetails={userDetails} t={t} />
        </div>
      </div>
    </>
  );
}
