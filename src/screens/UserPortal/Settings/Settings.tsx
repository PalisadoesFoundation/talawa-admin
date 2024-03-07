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

export default function settings(): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'settings',
  });

  const { setItem } = useLocalStorage();

  const { data } = useQuery(CHECK_AUTH, { fetchPolicy: 'network-only' });
  const [image, setImage] = React.useState('');
  const [updateUserDetails] = useMutation(UPDATE_USER_MUTATION);
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [gender, setGender] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const fileInputRef = React.useRef(null);
  const [birthDate, setBirthDate] = React.useState('');
  const [grade, setGrade] = React.useState('');
  const [empStatus, setEmpStatus] = React.useState('');
  const [martitalStatus, setMartitalStatus] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [state, setState] = React.useState('');
  const [country, setCountry] = React.useState('');

  const handleUpdateUserDetails = async (): Promise<void> => {
    let variables: any = {
      firstName,
      lastName,
    };

    /* istanbul ignore next */
    if (image) {
      variables = {
        ...variables,
        file: image,
      };
    }
    try {
      const { data } = await updateUserDetails({
        variables,
      });

      /* istanbul ignore next */
      if (data) {
        setImage('');
        toast.success('Your details have been updated.');
        setTimeout(() => {
          window.location.reload();
        }, 500);

        const userFullName = `${firstName} ${lastName}`;
        setItem('name', userFullName);
      }
    } catch (error: any) {
      errorHandler(t, error);
    }
  };

  const handleFirstNameChange = (e: any): void => {
    const { value } = e.target;
    setFirstName(value);
  };

  const handleLastNameChange = (e: any): void => {
    const { value } = e.target;
    setLastName(value);
  };

  const handleGenderChange = (e: any): void => {
    const { value } = e.target;
    setGender(value);
  };

  const handlePhoneNumberChange = (e: any): void => {
    const { value } = e.target;
    setPhoneNumber(value);
  };

  const handleImageUpload = (): void => {
    if (fileInputRef.current) {
      (fileInputRef.current as HTMLInputElement).click();
    }
  };

  const handleBirthDateChange = (e: any): void => {
    const { value } = e.target;
    setBirthDate(value);
  };

  const handleGradeChange = (e: any): void => {
    const { value } = e.target;
    setGrade(value);
  };

  const handleEmpStatusChange = (e: any): void => {
    const { value } = e.target;
    setEmpStatus(value);
  };

  const handleMartitalStatusChange = (e: any): void => {
    const { value } = e.target;
    setMartitalStatus(value);
  };

  const handleAdressChange = (e: any): void => {
    const { value } = e.target;
    setAddress(value);
  };

  const handleStateChange = (e: any): void => {
    const { value } = e.target;
    setState(value);
  };

  const handleCountryChange = (e: any): void => {
    const { value } = e.target;
    setCountry(value);
  };

  const handleResetChanges = (): void => {
    setFirstName(data.checkAuth.firstName);
    setLastName(data.checkAuth.lastName);
    setGender('');
    setPhoneNumber('');
    setBirthDate('');
    setGrade('');
    setEmpStatus('');
    setMartitalStatus('');
    setAddress('');
    setState('');
    setCountry('');
  };

  React.useEffect(() => {
    /* istanbul ignore next */
    if (data) {
      setFirstName(data.checkAuth.firstName);
      setLastName(data.checkAuth.lastName);
      setEmail(data.checkAuth.email);
    }
  }, [data]);

  return (
    <>
      <UserNavbar />
      <div className={`d-flex flex-row ${styles.containerHeight}`}>
        <UserSidebar />
        <div className={`${styles.mainContainer}`}>
          <h3>{t('settings')}</h3>
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
                        value={firstName}
                        onChange={handleFirstNameChange}
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
                        value={lastName}
                        onChange={handleLastNameChange}
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
                        type="text"
                        id="gender"
                        value={gender}
                        onChange={handleGenderChange}
                        className={`${styles.cardControl}`}
                        data-testid="inputGender"
                      />
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
                        value={email}
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
                        value={phoneNumber}
                        onChange={handlePhoneNumberChange}
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
                      <Button
                        className={`${styles.cardButton}`}
                        onClick={handleImageUpload}
                        data-testid="uploadImageBtn"
                      >
                        {t('chooseFile')}
                      </Button>
                      <Form.Control
                        accept="image/*"
                        id="displayImage"
                        name="photo"
                        type="file"
                        className={styles.cardControl}
                        multiple={false}
                        ref={fileInputRef}
                        onChange={
                          /* istanbul ignore next */
                          async (e: React.ChangeEvent): Promise<void> => {
                            const target = e.target as HTMLInputElement;
                            const file = target.files && target.files[0];
                            if (file) {
                              const image = await convertToBase64(file);
                              setImage(image);
                            }
                          }
                        }
                        style={{ display: 'none' }}
                      />
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
                        value={birthDate}
                        onChange={handleBirthDateChange}
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
                        type="text"
                        id="grade"
                        value={grade}
                        onChange={handleGradeChange}
                        className={`${styles.cardControl}`}
                        data-testid="inputGrade"
                      />
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
                        type="text"
                        id="empStatus"
                        value={empStatus}
                        onChange={handleEmpStatusChange}
                        className={`${styles.cardControl}`}
                        data-testid="inputEmpStatus"
                      />
                    </Col>
                    <Col lg={4}>
                      <Form.Label
                        htmlFor="maritalStatus"
                        className={`${styles.cardLabel}`}
                      >
                        {t('maritalStatus')}
                      </Form.Label>
                      <Form.Control
                        type="text"
                        id="maritalStatus"
                        value={martitalStatus}
                        onChange={handleMartitalStatusChange}
                        className={`${styles.cardControl}`}
                        data-testid="inputMaritalStatus"
                      />
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
                        id="address"
                        value={address}
                        onChange={handleAdressChange}
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
                        value={state}
                        onChange={handleStateChange}
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
                        type="text"
                        id="country"
                        value={country}
                        onChange={handleCountryChange}
                        className={`${styles.cardControl}`}
                        data-testid="inputCountry"
                      />
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
            <Col lg={5}>
              <Card border="0" className="rounded-4 mb-4">
                <div className={styles.cardHeader}>
                  <div className={styles.cardTitle}>{t('profileDetails')}</div>
                </div>
                <Card.Body className={styles.cardBody}>
                  <div className={`d-flex mb-2 ${styles.profileContainer}`}>
                    <div className={styles.imgContianer}>
                      {image && image !== 'null' ? (
                        <img src={image} alt={`profile picture`} />
                      ) : (
                        <Avatar
                          name={`${firstName} ${lastName}`}
                          alt={`dummy picture`}
                        />
                      )}
                    </div>
                    <div className={styles.profileDetails}>
                      <span style={{ fontWeight: '700', fontSize: '28px' }}>
                        {`${firstName}`.charAt(0).toUpperCase() +
                          `${firstName}`.slice(1)}
                      </span>
                      <span data-testid="userEmail">{email}</span>
                      {birthDate && (
                        <span className="d-flex">
                          <CalendarMonthOutlinedIcon />
                          <span className="d-flex align-end">{birthDate}</span>
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="mb-1 d-flex justify-content-center">
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
          </Row>
        </div>
      </div>
    </>
  );
}
