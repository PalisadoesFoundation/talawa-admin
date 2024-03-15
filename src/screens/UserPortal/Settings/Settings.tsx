import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './Settings.module.css';
import UserSidebar from 'components/UserPortal/UserSidebar/UserSidebar';
import UserNavbar from 'components/UserPortal/UserNavbar/UserNavbar';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import convertToBase64 from 'utils/convertToBase64';
import { UPDATE_USER_MUTATION } from 'GraphQl/Mutations/mutations';
import { useMutation, useQuery } from '@apollo/client';
import { errorHandler } from 'utils/errorHandler';
import { toast } from 'react-toastify';
import { CHECK_AUTH } from 'GraphQl/Queries/Queries';
import ChangeLanguageDropDown from 'components/ChangeLanguageDropdown/ChangeLanguageDropDown';
import useLocalStorage from 'utils/useLocalstorage';
import Avatar from 'components/Avatar/Avatar';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import {
  countryOptions,
  educationGradeEnum,
  employmentStatusEnum,
  genderEnum,
  maritalStatusEnum,
} from 'utils/formEnumFields';

export default function settings(): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'settings',
  });

  const { setItem } = useLocalStorage();

  const { data } = useQuery(CHECK_AUTH, { fetchPolicy: 'network-only' });
  const [updateUserDetails] = useMutation(UPDATE_USER_MUTATION);

  const [userDetails, setUserDetails] = React.useState({
    firstName: '',
    lastName: '',
    gender: '',
    email: '',
    phoneNumber: '',
    birthDate: '',
    grade: '',
    empStatus: '',
    maritalStatus: '',
    address: '',
    state: '',
    country: '',
    image: '',
  });

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const handleUpdateUserDetails = async (): Promise<void> => {
    try {
      const { data } = await updateUserDetails({
        variables: userDetails,
      });
      /* istanbul ignore next */
      if (data) {
        toast.success('Your details have been updated.');
        setTimeout(() => {
          window.location.reload();
        }, 500);

        const userFullName = `${userDetails.firstName} ${userDetails.lastName}`;
        setItem('name', userFullName);
      }
    } catch (error: any) {
      errorHandler(t, error);
    }
  };

  const handleFieldChange = (fieldName: string, value: string): void => {
    setUserDetails((prevState) => ({
      ...prevState,
      [fieldName]: value,
    }));
  };

  const handleImageUpload = (): void => {
    if (fileInputRef.current) {
      (fileInputRef.current as HTMLInputElement).click();
    }
  };

  const handleResetChanges = (): void => {
    /* istanbul ignore next */
    if (data) {
      const {
        firstName,
        lastName,
        gender,
        phone,
        birthDate,
        educationGrade,
        employmentStatus,
        maritalStatus,
        address,
      } = data.checkAuth;

      setUserDetails({
        ...userDetails,
        firstName: firstName || '',
        lastName: lastName || '',
        gender: gender || '',
        phoneNumber: phone?.mobile || '',
        birthDate: birthDate || '',
        grade: educationGrade || '',
        empStatus: employmentStatus || '',
        maritalStatus: maritalStatus || '',
        address: address?.line1 || '',
        state: address?.state || '',
        country: address?.countryCode || '',
      });
    }
  };

  React.useEffect(() => {
    /* istanbul ignore next */
    if (data) {
      const {
        firstName,
        lastName,
        gender,
        email,
        phone,
        birthDate,
        educationGrade,
        employmentStatus,
        maritalStatus,
        address,
        image,
      } = data.checkAuth;

      setUserDetails({
        firstName,
        lastName,
        gender,
        email,
        phoneNumber: phone?.mobile || '',
        birthDate,
        grade: educationGrade || '',
        empStatus: employmentStatus || '',
        maritalStatus: maritalStatus || '',
        address: address?.line1 || '',
        state: address?.state || '',
        country: address?.countryCode || '',
        image,
      });
    }
  }, [data]);
  console.log(data);
  return (
    <>
      <UserNavbar />
      <div className={`d-flex flex-row ${styles.containerHeight}`}>
        <UserSidebar />
        <div className={`${styles.mainContainer}`}>
          <h3>{t('settings')}</h3>
          <Row>
            <Col lg={5} className="d-lg-none">
              <Card border="0" className="rounded-4 mb-4">
                <div className={styles.cardHeader}>
                  <div className={styles.cardTitle}>{t('profileDetails')}</div>
                </div>
                <Card.Body className={styles.cardBody}>
                  <div className={`d-flex mb-2 ${styles.profileContainer}`}>
                    <div className={styles.imgContianer}>
                      {userDetails.image && userDetails.image !== 'null' ? (
                        <img src={userDetails.image} alt={`profile picture`} />
                      ) : (
                        <Avatar
                          name={`${userDetails.firstName} ${userDetails.lastName}`}
                          alt={`dummy picture`}
                        />
                      )}
                    </div>
                    <div className={styles.profileDetails}>
                      <span style={{ fontWeight: '700', fontSize: '28px' }}>
                        {`${userDetails.firstName}`.charAt(0).toUpperCase() +
                          `${userDetails.firstName}`.slice(1)}
                      </span>
                      <span data-testid="userEmail">{userDetails.email}</span>
                      <span className="d-flex">
                        <CalendarMonthOutlinedIcon />
                        <span className="d-flex align-end">
                          {t('joined')} 1st May, 2021
                        </span>
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 mb-1 d-flex justify-content-center">
                    <Button data-testid="copyProfileLink">
                      {t('copyLink')}
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={7}>
              <Card border="0" className="rounded-4 mb-4">
                <div className={`${styles.cardHeader}`}>
                  <div className={`${styles.cardTitle}`}>
                    {t('profileSettings')}
                  </div>
                </div>
                <Card.Body className={`${styles.cardBody}`}>
                  <Row className="mb-1">
                    <Col lg={4}>
                      <Form.Label
                        htmlFor="inputFirstName"
                        className={`${styles.cardLabel}`}
                      >
                        {t('firstName')}
                      </Form.Label>
                      <Form.Control
                        type="text"
                        id="inputFirstName"
                        value={userDetails.firstName}
                        onChange={(e) =>
                          handleFieldChange('firstName', e.target.value)
                        }
                        className={`${styles.cardControl}`}
                        data-testid="inputFirstName"
                      />
                    </Col>
                    <Col lg={4}>
                      <Form.Label
                        htmlFor="inputLastName"
                        className={`${styles.cardLabel}`}
                      >
                        {t('lastName')}
                      </Form.Label>
                      <Form.Control
                        type="text"
                        id="inputLastName"
                        value={userDetails.lastName}
                        onChange={(e) =>
                          handleFieldChange('lastName', e.target.value)
                        }
                        className={`${styles.cardControl}`}
                        data-testid="inputLastName"
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
                        value={userDetails.gender}
                        onChange={(e) =>
                          handleFieldChange('gender', e.target.value)
                        }
                        className={`${styles.cardControl}`}
                        data-testid="inputGender"
                      >
                        <option value="" disabled>
                          {t('sgender')}
                        </option>
                        {genderEnum.map((g) => (
                          <option key={g.value.toLowerCase()} value={g.value}>
                            {t(g.label)}
                          </option>
                        ))}
                      </Form.Control>
                    </Col>
                  </Row>
                  <Row className="mb-1">
                    <Col lg={4}>
                      <Form.Label
                        htmlFor="inputEmail"
                        className={`${styles.cardLabel}`}
                      >
                        {t('emailAddress')}
                      </Form.Label>
                      <Form.Control
                        type="email"
                        id="inputEmail"
                        value={userDetails.email}
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
                        placeholder="1234567890"
                        value={userDetails.phoneNumber}
                        onChange={(e) =>
                          handleFieldChange('phoneNumber', e.target.value)
                        }
                        className={`${styles.cardControl}`}
                        data-testid="inputPhoneNumber"
                      />
                    </Col>
                    <Col lg={4}>
                      <Form.Label
                        htmlFor="postphoto"
                        className={`${styles.cardLabel}`}
                      >
                        {t('displayImage')}
                      </Form.Label>
                      <div>
                        <Button
                          className={`${styles.cardButton}`}
                          onClick={handleImageUpload}
                          data-testid="uploadImageBtn"
                        >
                          {t('chooseFile')}
                        </Button>
                        <Form.Control
                          accept="image/*"
                          id="postphoto"
                          name="photo"
                          type="file"
                          className={styles.cardControl}
                          data-testid="fileInput"
                          multiple={false}
                          ref={fileInputRef}
                          onChange={
                            /* istanbul ignore next */
                            async (
                              e: React.ChangeEvent<HTMLInputElement>,
                            ): Promise<void> => {
                              const target = e.target as HTMLInputElement;
                              const file = target.files && target.files[0];
                              if (file) {
                                const image = await convertToBase64(file);
                                setUserDetails({ ...userDetails, image });
                              }
                            }
                          }
                          style={{ display: 'none' }}
                        />
                      </div>
                    </Col>
                  </Row>
                  <Row className="mb-1">
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
                        value={userDetails.birthDate}
                        onChange={(e) =>
                          handleFieldChange('birthDate', e.target.value)
                        }
                        className={`${styles.cardControl}`}
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
                        value={userDetails.grade}
                        onChange={(e) =>
                          handleFieldChange('grade', e.target.value)
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
                            {t(grade.label)}
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
                        value={userDetails.empStatus}
                        onChange={(e) =>
                          handleFieldChange('empStatus', e.target.value)
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
                            {t(status.label)}
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
                            {t(status.label)}
                          </option>
                        ))}
                      </Form.Control>
                    </Col>
                  </Row>
                  <Row className="mb-1">
                    <Col lg={4}>
                      <Form.Label
                        htmlFor="address"
                        className={`${styles.cardLabel}`}
                      >
                        {t('address')}
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Eg: lane 123, Main Street"
                        id="address"
                        value={userDetails.address}
                        onChange={(e) =>
                          handleFieldChange('address', e.target.value)
                        }
                        className={`${styles.cardControl}`}
                        data-testid="inputAddress"
                      />
                    </Col>
                    <Col lg={4}>
                      <Form.Label
                        htmlFor="inputState"
                        className={`${styles.cardLabel}`}
                      >
                        {t('state')}
                      </Form.Label>
                      <Form.Control
                        type="text"
                        id="inputState"
                        placeholder={t('enterState')}
                        value={userDetails.state}
                        onChange={(e) =>
                          handleFieldChange('state', e.target.value)
                        }
                        className={`${styles.cardControl}`}
                        data-testid="inputState"
                      />
                    </Col>
                    <Col lg={4}>
                      <Form.Label
                        htmlFor="country"
                        className={`${styles.cardLabel}`}
                      >
                        {t('country')}
                      </Form.Label>
                      <Form.Control
                        as="select"
                        id="country"
                        value={userDetails.country}
                        onChange={(e) =>
                          handleFieldChange('country', e.target.value)
                        }
                        className={`${styles.cardControl}`}
                        data-testid="inputCountry"
                      >
                        <option value="" disabled>
                          {t('selectCountry')}
                        </option>
                        {countryOptions.map((country) => (
                          <option
                            key={country.value.toUpperCase()}
                            value={country.value.toUpperCase()}
                          >
                            {country.label}
                          </option>
                        ))}
                      </Form.Control>
                    </Col>
                  </Row>
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
                      {t('saveChanges')}
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={5} className="d-none d-lg-block">
              <Card border="0" className="rounded-4 mb-4">
                <div className={styles.cardHeader}>
                  <div className={styles.cardTitle}>{t('profileDetails')}</div>
                </div>
                <Card.Body className={styles.cardBody}>
                  <div className={`d-flex mb-2 ${styles.profileContainer}`}>
                    <div className={styles.imgContianer}>
                      {userDetails.image && userDetails.image !== 'null' ? (
                        <img src={userDetails.image} alt={`profile picture`} />
                      ) : (
                        <Avatar
                          name={`${userDetails.firstName} ${userDetails.lastName}`}
                          alt={`dummy picture`}
                        />
                      )}
                    </div>
                    <div className={styles.profileDetails}>
                      <span style={{ fontWeight: '700', fontSize: '28px' }}>
                        {`${userDetails.firstName}`.charAt(0).toUpperCase() +
                          `${userDetails.firstName}`.slice(1)}
                      </span>
                      <span data-testid="userEmail">{userDetails.email}</span>
                      <span className="d-flex">
                        <CalendarMonthOutlinedIcon />
                        <span className="d-flex align-end">
                          {t('joined')} 1st May, 2021
                        </span>
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 mb-1 d-flex justify-content-center">
                    <Button data-testid="copyProfileLink">
                      {t('copyLink')}
                    </Button>
                  </div>
                </Card.Body>
              </Card>
              <Card border="0" className="rounded-4 mb-4">
                <div className={styles.cardHeader}>
                  <div className={styles.cardTitle}>{t('deleteUser')}</div>
                </div>
                <Card.Body className={styles.cardBody}>
                  <p style={{ margin: '1rem 0' }}>{t('deleteUserMessage')}</p>
                  <Button variant="danger">{t('deleteUser')}</Button>
                </Card.Body>
              </Card>
              <Card border="0" className="rounded-4 mb-4">
                <div className={styles.cardHeader}>
                  <div className={styles.cardTitle}>{t('otherSettings')}</div>
                </div>
                <Card.Body className={styles.cardBody}>
                  <Form.Label
                    className={`text-secondary fw-bold ${styles.cardLabel}`}
                  >
                    {t('changeLanguage')}
                  </Form.Label>
                  <ChangeLanguageDropDown />
                </Card.Body>
              </Card>
            </Col>
            <Col lg={5} className="d-lg-none">
              <Card border="0" className="rounded-4 mb-4">
                <div className={styles.cardHeader}>
                  <div className={styles.cardTitle}>{t('deleteUser')}</div>
                </div>
                <Card.Body className={styles.cardBody}>
                  <p style={{ margin: '1rem 0' }}>{t('deleteUserMessage')}</p>
                  <Button variant="danger">{t('deleteUser')}</Button>
                </Card.Body>
              </Card>
              <Card border="0" className="rounded-4 mb-4">
                <div className={styles.cardHeader}>
                  <div className={styles.cardTitle}>{t('otherSettings')}</div>
                </div>
                <Card.Body className={styles.cardBody}>
                  <Form.Label
                    className={`text-secondary fw-bold ${styles.cardLabel}`}
                  >
                    {t('changeLanguage')}
                  </Form.Label>
                  <ChangeLanguageDropDown />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
}
