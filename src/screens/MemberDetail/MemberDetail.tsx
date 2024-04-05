<<<<<<< HEAD
import React, { useEffect, useRef, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import Button from 'react-bootstrap/Button';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { USER_DETAILS } from 'GraphQl/Queries/Queries';
import styles from './MemberDetail.module.css';
import { languages } from 'utils/languages';
import { UPDATE_USER_MUTATION } from 'GraphQl/Mutations/mutations';
import { toast } from 'react-toastify';
import { errorHandler } from 'utils/errorHandler';
import Loader from 'components/Loader/Loader';
import useLocalStorage from 'utils/useLocalstorage';
import Avatar from 'components/Avatar/Avatar';
import {
  CalendarIcon,
  DatePicker,
  LocalizationProvider,
} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Form } from 'react-bootstrap';
import convertToBase64 from 'utils/convertToBase64';
import sanitizeHtml from 'sanitize-html';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import {
  educationGradeEnum,
  maritalStatusEnum,
  genderEnum,
  employmentStatusEnum,
} from 'utils/formEnumFields';
import DynamicDropDown from 'components/DynamicDropDown/DynamicDropDown';

type MemberDetailProps = {
  id?: string; // This is the userId
=======
import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import UserUpdate from 'components/UserUpdate/UserUpdate';

import OrganizationScreen from 'components/OrganizationScreen/OrganizationScreen';
import { USER_DETAILS } from 'GraphQl/Queries/Queries';
import styles from './MemberDetail.module.css';
import { languages } from 'utils/languages';
import { ADD_ADMIN_MUTATION } from 'GraphQl/Mutations/mutations';
import { toast } from 'react-toastify';
import { errorHandler } from 'utils/errorHandler';
import Loader from 'components/Loader/Loader';

type MemberDetailProps = {
  id: string; // This is the userId
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
};

const MemberDetail: React.FC<MemberDetailProps> = ({ id }): JSX.Element => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'memberDetail',
  });
<<<<<<< HEAD
  const location = useLocation();
  const isMounted = useRef(true);
  const { getItem, setItem } = useLocalStorage();
  const currentUrl = location.state?.id || getItem('id') || id;
  document.title = t('title');
  const [formState, setFormState] = useState({
    firstName: '',
    lastName: '',
    email: '',
    appLanguageCode: '',
    image: '',
    gender: '',
    birthDate: '2024-03-14',
    grade: '',
    empStatus: '',
    maritalStatus: '',
    phoneNumber: '',
    address: '',
    state: '',
    city: '',
    country: '',
    pluginCreationAllowed: false,
  });
  // Handle date change
  const handleDateChange = (date: Dayjs | null): void => {
    if (date) {
      setFormState((prevState) => ({
        ...prevState,
        birthDate: dayjs(date).format('YYYY-MM-DD'), // Convert Dayjs object to JavaScript Date object
      }));
    }
  };
  const [updateUser] = useMutation(UPDATE_USER_MUTATION);
  const { data: user, loading: loading } = useQuery(USER_DETAILS, {
    variables: { id: currentUrl }, // For testing we are sending the id as a prop
  });
  const userData = user?.user;

  useEffect(() => {
    if (userData && isMounted) {
      // console.log(userData);
      setFormState({
        ...formState,
        firstName: userData?.user?.firstName,
        lastName: userData?.user?.lastName,
        email: userData?.user?.email,
        appLanguageCode: userData?.appUserProfile?.appLanguageCode,
        gender: userData?.user?.gender,
        birthDate: userData?.user?.birthDate || '2020-03-14',
        grade: userData?.user?.educationGrade,
        empStatus: userData?.user?.employmentStatus,
        maritalStatus: userData?.user?.maritalStatus,
        phoneNumber: userData?.user?.phone?.mobile,
        address: userData.user?.address?.line1,
        state: userData?.user?.address?.state,
        city: userData?.user?.address?.city,
        country: userData?.user?.address?.countryCode,
        pluginCreationAllowed: userData?.appUserProfile?.pluginCreationAllowed,
        image: userData?.user?.image || '',
      });
    }
  }, [userData, user]);

  useEffect(() => {
    // check component is mounted or not
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    // setFormState({
    //   ...formState,
    //   [name]: value,
    // });
    // console.log(name, value);
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    // console.log(formState);
  };

  // const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
  //   const { name, value } = e.target;
  //   setFormState({
  //     ...formState,
  //     phoneNumber: {
  //       ...formState.phoneNumber,
  //       [name]: value,
  //     },
  //   });
  //   // console.log(formState);
  // };

  const handleToggleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    // console.log(e.target.checked);
    const { name, checked } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: checked,
    }));
    // console.log(formState);
  };

  const loginLink = async (): Promise<void> => {
    try {
      // console.log(formState);
      const firstName = formState.firstName;
      const lastName = formState.lastName;
      const email = formState.email;
      // const appLanguageCode = formState.appLanguageCode;
      const image = formState.image;
      // const gender = formState.gender;
      let toSubmit = true;
      if (firstName.trim().length == 0 || !firstName) {
        toast.warning('First Name cannot be blank!');
        toSubmit = false;
      }
      if (lastName.trim().length == 0 || !lastName) {
        toast.warning('Last Name cannot be blank!');
        toSubmit = false;
      }
      if (email.trim().length == 0 || !email) {
        toast.warning('Email cannot be blank!');
        toSubmit = false;
      }
      if (!toSubmit) return;
      try {
        const { data } = await updateUser({
          variables: {
            //! Currently only some fields are supported by the api
            id: currentUrl,
            ...formState,
          },
        });
        /* istanbul ignore next */
        if (data) {
          if (getItem('id') === currentUrl) {
            setItem('FirstName', firstName);
            setItem('LastName', lastName);
            setItem('Email', email);
            setItem('UserImage', image);
          }
          toast.success('Successful updated');
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          errorHandler(t, error);
        }
      }
    } catch (error: unknown) {
      /* istanbul ignore next */
      if (error instanceof Error) {
        errorHandler(t, error);
      }
    }
=======

  const [state, setState] = useState(1);

  const location = useLocation<MemberDetailProps>();
  const currentUrl = location.state?.id || localStorage.getItem('id') || id;
  document.title = t('title');

  const [adda] = useMutation(ADD_ADMIN_MUTATION);
  const {
    data: userData,
    loading: loading,
    error: error,
    refetch: refetch,
  } = useQuery(USER_DETAILS, {
    variables: { id: currentUrl }, // For testing we are sending the id as a prop
  });

  /* istanbul ignore next */
  const toggleStateValue = (): void => {
    if (state === 1) setState(2);
    else setState(1);
    refetch();
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
  };

  if (loading) {
    return <Loader />;
  }

<<<<<<< HEAD
  const sanitizedSrc = sanitizeHtml(formState.image, {
    allowedTags: ['img'],
    allowedAttributes: {
      img: ['src', 'alt'],
    },
  });

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className={`my-4 ${styles.mainpageright}`}>
        <div className="d-flex flex-row">
          <div className={`left d-flex flex-column ${styles.width60}`}>
            {/* Personal */}
            <div className={`personal bg-white border ${styles.allRound}`}>
              <div
                className={`d-flex border-bottom py-3 px-4 ${styles.topRadius}`}
              >
                <h3>{t('personalInfoHeading')}</h3>
              </div>
              <div className="d-flex flex-row flex-wrap py-3 px-3">
                <div>
                  <p className="my-0 mx-2">{t('firstName')}</p>
                  <input
                    value={formState.firstName}
                    className={`rounded border-0 p-2 m-2 ${styles.inputColor}`}
                    type="text"
                    name="firstName"
                    onChange={handleChange}
                    required
                    placeholder={t('firstName')}
                  />
                </div>
                <div>
                  <p className="my-0 mx-2">{t('lastName')}</p>
                  <input
                    value={formState.lastName}
                    className={`rounded border-0 p-2 m-2 ${styles.inputColor}`}
                    type="text"
                    name="lastName"
                    onChange={handleChange}
                    required
                    placeholder={t('lastName')}
                  />
                </div>
                <div>
                  <p className="my-0 mx-2">{t('gender')}</p>
                  <div className="w-100">
                    <DynamicDropDown
                      formState={formState}
                      setFormState={setFormState}
                      fieldOptions={genderEnum} // Pass your options array here
                      fieldName="gender" // Label for the field
                    />
                  </div>
                </div>
                <div>
                  <p className="my-0 mx-2">{t('birthDate')}</p>
                  <div>
                    <DatePicker
                      // label={t('birthDate')}
                      className={styles.datebox}
                      value={dayjs(formState.birthDate)}
                      onChange={handleDateChange}
                      data-testid="birthDate"
                      slotProps={{
                        textField: {
                          inputProps: {
                            'data-testid': 'birthDate',
                          },
                        },
                      }}
                    />
                  </div>
                </div>
                <div>
                  <p className="my-0 mx-2">{t('educationGrade')}</p>
                  <DynamicDropDown
                    formState={formState}
                    setFormState={setFormState}
                    fieldOptions={educationGradeEnum} // Pass your options array here
                    fieldName="grade" // Label for the field
                  />
                </div>
                <div>
                  <p className="my-0 mx-2">{t('employmentStatus')}</p>
                  <DynamicDropDown
                    formState={formState}
                    setFormState={setFormState}
                    fieldOptions={employmentStatusEnum} // Pass your options array here
                    fieldName="empStatus" // Label for the field
                  />
                </div>
                <div>
                  <p className="my-0 mx-2">{t('maritalStatus')}</p>
                  <DynamicDropDown
                    formState={formState}
                    setFormState={setFormState}
                    fieldOptions={maritalStatusEnum} // Pass your options array here
                    fieldName="maritalStatus" // Label for the field
                  />
                </div>
                <p className="my-0 mx-2 w-100">
                  <label htmlFor="orgphoto" className={styles.orgphoto}>
                    {t('displayImage')}:
                    <Form.Control
                      className="w-75"
                      accept="image/*"
                      id="orgphoto"
                      name="photo"
                      type="file"
                      multiple={false}
                      onChange={async (e: React.ChangeEvent): Promise<void> => {
                        const target = e.target as HTMLInputElement;
                        const image = target.files && target.files[0];
                        if (image)
                          setFormState({
                            ...formState,
                            image: await convertToBase64(image),
                          });
                      }}
                      data-testid="organisationImage"
                    />
                  </label>
                </p>
              </div>
            </div>
            {/* Contact Info */}
            <div className={`contact mt-5 bg-white border ${styles.allRound}`}>
              <div
                className={`d-flex border-bottom py-3 px-4 ${styles.topRadius}`}
              >
                <h3>{t('contactInfoHeading')}</h3>
              </div>
              <div className="d-flex flex-row flex-wrap py-3 px-3">
                <div>
                  <p className="my-0 mx-2">{t('phone')}</p>
                  <input
                    value={formState.phoneNumber}
                    className={`rounded border-0 p-2 m-2 ${styles.inputColor}`}
                    type="number"
                    name="phoneNumber"
                    onChange={handleChange}
                    placeholder={t('phone')}
                  />
                </div>
                <div className="w-50 p-2">
                  <p className="my-0">{t('email')}</p>
                  <input
                    value={formState.email}
                    className={`w-100 rounded border-0 p-2 ${styles.inputColor}`}
                    type="email"
                    name="email"
                    onChange={handleChange}
                    required
                    placeholder={t('email')}
                  />
                </div>
                <div className="p-2" style={{ width: `82%` }}>
                  <p className="my-0">{t('address')}</p>
                  <input
                    value={formState.address}
                    className={`w-100 rounded border-0 p-2 ${styles.inputColor}`}
                    type="email"
                    name="address"
                    onChange={handleChange}
                    placeholder={t('address')}
                  />
                </div>
                <div className="w-25 p-2">
                  <p className="my-0">{t('countryCode')}</p>
                  <input
                    value={formState.country}
                    className={`w-100 rounded border-0 p-2 ${styles.inputColor}`}
                    type="text"
                    name="country"
                    onChange={handleChange}
                    placeholder={t('countryCode')}
                  />
                </div>
                <div className="w-25 p-2">
                  <p className="my-0">{t('city')}</p>
                  <input
                    value={formState.city}
                    className={`w-100 rounded border-0 p-2 ${styles.inputColor}`}
                    type="text"
                    name="city"
                    onChange={handleChange}
                    placeholder={t('city')}
                  />
                </div>
                <div className="w-25 p-2">
                  <p className="my-0">{t('state')}</p>
                  <input
                    value={formState.state}
                    className={`w-100 rounded border-0 p-2 ${styles.inputColor}`}
                    type="text"
                    name="state"
                    onChange={handleChange}
                    placeholder={t('state')}
                  />
                </div>
              </div>
            </div>
          </div>
          <div
            className={`right d-flex flex-column mx-auto px-3 ${styles.maxWidth40}`}
          >
            {/* Personal */}
            <div className={`personal bg-white border ${styles.allRound}`}>
              <div
                className={`d-flex flex-column border-bottom py-3 px-4 ${styles.topRadius}`}
              >
                <h3>{t('personalDetailsHeading')}</h3>
              </div>
              <div className="d-flex flex-row p-4">
                <div className="d-flex flex-column">
                  {formState.image ? (
                    <img
                      className={`rounded-circle mx-auto`}
                      style={{ width: '80px', aspectRatio: '1/1' }}
                      src={sanitizedSrc}
                      data-testid="userImagePresent"
                    />
                  ) : (
                    <>
                      <Avatar
                        name={`${userData?.user?.firstName} ${userData?.user?.lastName}`}
                        alt="User Image"
                        size={100}
                        dataTestId="userImageAbsent"
                        radius={50}
                      />
                    </>
                  )}
                </div>
                <div className="d-flex flex-column mx-2">
                  <p className="fs-2 my-0 fw-medium">{formState?.firstName}</p>
                  <div
                    className={`p-1 bg-white border border-success text-success text-center rounded mt-1 ${styles.WidthFit}`}
                  >
                    <p className="p-0 m-0 fs-6">
                      {userData?.appUserProfile?.isSuperAdmin
                        ? 'Super Admin'
                        : userData?.appUserProfile?.adminFor.length > 0
                          ? 'Admin'
                          : 'User'}
                    </p>
                  </div>
                  <p className="my-0">{formState.email}</p>
                  <p className="my-0">
                    <CalendarIcon />
                    Joined on {prettyDate(userData?.user?.createdAt)}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className={`personal mt-4 bg-white border ${styles.allRound}`}>
              <div
                className={`d-flex flex-column border-bottom py-3 px-4 ${styles.topRadius}`}
              >
                <h3>{t('actionsHeading')}</h3>
              </div>
              <div className="p-3">
                <div className="toggles">
                  <div className="d-flex flex-row">
                    <input
                      type="checkbox"
                      name="pluginCreationAllowed"
                      className={`mx-2 ${styles.noOutline}`}
                      checked={formState.pluginCreationAllowed}
                      onChange={handleToggleChange} // API not supporting this feature
                      data-testid="pluginCreationAllowed"
                      placeholder="pluginCreationAllowed"
                    />
                    <p className="p-0 m-0">
                      {`${t('pluginCreationAllowed')} (API not supported yet)`}
                    </p>
                  </div>
                </div>
                <div className="buttons d-flex flex-row gap-3 mt-2">
                  <div className={styles.dispflex}>
                    <div>
                      <label>
                        {t('appLanguageCode')} <br />
                        {`(API not supported yet)`}
                        <select
                          className="form-control"
                          data-testid="applangcode"
                          onChange={(e): void => {
                            setFormState({
                              ...formState,
                              appLanguageCode: e.target.value,
                            });
                          }}
                        >
                          {languages.map((language, index: number) => (
                            <option key={index} value={language.code}>
                              {language.name}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>
                  </div>
                  <div className="d-flex flex-column">
                    <label htmlFor="">
                      {t('delete')}
                      <br />
                      {`(API not supported yet)`}
                    </label>
                    <Button className="btn btn-danger" data-testid="deleteBtn">
                      {t('delete')}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <div className="buttons mt-4">
              <Button
                type="button"
                className={styles.greenregbtn}
                value="savechanges"
                onClick={loginLink}
              >
                {t('saveChanges')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </LocalizationProvider>
  );
};
=======
  /* istanbul ignore next */
  if (error) {
    window.location.assign(`/orgpeople/id=${currentUrl}`);
  }

  const addAdmin = async (): Promise<void> => {
    try {
      const { data } = await adda({
        variables: {
          userid: location.state?.id,
          orgid: currentUrl,
        },
      });

      /* istanbul ignore next */
      if (data) {
        toast.success(t('addedAsAdmin'));
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error: any) {
      /* istanbul ignore next */
      errorHandler(t, error);
    }
  };

  return (
    <>
      <OrganizationScreen screenName="User" title={t('title')}>
        <Row>
          <Col sm={3}>
            <div className={styles.sidebar}>
              <div className={styles.sidebarsticky}>
                <br />
                <Button
                  className={styles.activeBtn}
                  data-testid="dashboardTitleBtn"
                >
                  <div className={styles.bgFill}>
                    <i className="fa fa-user" />
                  </div>
                  {t('title')}
                </Button>
              </div>
            </div>
          </Col>
          <Col sm={8}>
            {state == 1 ? (
              <div className={styles.mainpageright}>
                <Row className={styles.flexclm}>
                  <p className={styles.logintitle}>{t('title')}</p>
                  <div className={styles.btngroup}>
                    <Button
                      className={styles.memberfontcreatedbtn}
                      onClick={addAdmin}
                    >
                      {t('addAdmin')}
                    </Button>
                    <Button
                      className={styles.memberfontcreatedbtn}
                      role="stateBtn"
                      data-testid="stateBtn"
                      onClick={(): void => {
                        setState(2);
                      }}
                    >
                      Edit Profile
                    </Button>
                  </div>
                </Row>
                <Row className={styles.justifysp}>
                  <Col sm={6} lg={4}>
                    <div>
                      {userData?.user?.image ? (
                        <img
                          className={styles.userImage}
                          src={userData?.user?.image}
                          data-testid="userImagePresent"
                        />
                      ) : (
                        <img
                          className={styles.userImage}
                          src={`https://api.dicebear.com/5.x/initials/svg?seed=${userData?.user?.firstName} ${userData?.user?.lastName}`}
                          data-testid="userImageAbsent"
                        />
                      )}
                    </div>
                  </Col>
                  <Col sm={6} lg={8}>
                    {/* User section */}
                    <div>
                      <h2>
                        <strong>
                          {userData?.user?.firstName} {userData?.user?.lastName}
                        </strong>
                      </h2>
                      <p>
                        <strong>{t('role')} :</strong>{' '}
                        <span>{userData?.user?.userType}</span>
                      </p>
                      <p>
                        <strong>{t('email')} :</strong>{' '}
                        <span>{userData?.user?.email}</span>
                      </p>
                      <p>
                        <strong>{t('createdOn')} :</strong>{' '}
                        {prettyDate(userData?.user?.createdAt)}
                      </p>
                    </div>
                  </Col>
                </Row>
                <br />
                <br />
                <br />
                {/* Main Section And Activity section */}
                <section className="mb-5">
                  <Row className={styles.justifysp}>
                    {/* Main Section */}
                    <Col sm={12} lg={6}>
                      <div className="card mb-4">
                        <div className="card-header">
                          <h5>
                            <strong>{t('main')}</strong>
                          </h5>
                        </div>
                        <div className="card-body">
                          <Row className="border-bottom pt-2 pb-3">
                            <Col sm={6}>{t('firstName')}</Col>
                            <Col sm={6}>{userData?.user?.firstName}</Col>
                          </Row>
                          <Row className="border-bottom py-3">
                            <Col sm={6}>{t('lastName')}</Col>
                            <Col sm={6}>{userData?.user?.lastName}</Col>
                          </Row>
                          <Row className="border-bottom py-3">
                            <Col sm={6}>{t('role')}</Col>
                            <Col sm={6}>{userData?.user?.userType}</Col>
                          </Row>
                          <Row className="border-bottom py-3">
                            <Col sm={6}>{t('memberOfOrganization')}</Col>
                            <Col sm={6}>
                              {userData?.user?.organizationUserBelongsTo ??
                                'None'}
                            </Col>
                          </Row>
                          <Row className="border-bottom py-3">
                            <Col sm={6}>{t('language')}</Col>
                            <Col sm={6}>
                              {getLanguageName(userData?.user?.appLanguageCode)}
                            </Col>
                          </Row>
                          <Row className="border-bottom py-3">
                            <Col sm={6}>{t('adminApproved')}</Col>
                            <Col sm={6} data-testid="adminApproved">
                              {userData?.user?.adminApproved ? 'Yes' : 'No'}
                            </Col>
                          </Row>
                          <Row className="border-bottom py-3">
                            <Col sm={6}>{t('pluginCreationAllowed')}</Col>
                            <Col sm={6} data-testid="pluginCreationAllowed">
                              {userData?.user?.pluginCreationAllowed
                                ? 'Yes'
                                : 'No'}
                            </Col>
                          </Row>
                          <Row className="pt-3">
                            <Col sm={6}>{t('createdOn')}</Col>
                            <Col data-testid="createdOn" sm={6}>
                              {prettyDate(userData?.user?.createdAt)}
                            </Col>
                          </Row>
                        </div>
                      </div>
                    </Col>
                    {/* Activity Section */}
                    <Col sm={12} lg={6}>
                      {/* Organizations */}
                      <div className="card">
                        <div className="card-header">
                          <h5>
                            <strong>{t('organizations')}</strong>
                          </h5>
                        </div>
                        <div className="card-body">
                          <Row className="border-bottom pt-2 pb-3">
                            <Col sm={8}>{t('created')}</Col>
                            <Col sm={4}>
                              {userData?.user?.createdOrganizations?.length}
                            </Col>
                          </Row>
                          <Row className="border-bottom py-3">
                            <Col sm={8}>{t('joined')}</Col>
                            <Col sm={4}>
                              {userData?.user?.joinedOrganizations?.length}
                            </Col>
                          </Row>
                          <Row className="border-bottom py-3">
                            <Col sm={8}>{t('adminForOrganizations')}</Col>
                            <Col sm={4}>{userData?.user?.adminFor?.length}</Col>
                          </Row>
                          <Row className="pt-3">
                            <Col sm={8}>{t('membershipRequests')}</Col>
                            <Col sm={4}>
                              {userData?.user?.membershipRequests?.length}
                            </Col>
                          </Row>
                        </div>
                      </div>
                      {/* Events */}
                      <div className="card mt-4">
                        <div className="card-header">
                          <h5>
                            <strong>{t('events')}</strong>
                          </h5>
                        </div>
                        <div className="card-body">
                          <Row className="border-bottom pt-2 pb-3">
                            <Col sm={8}>{t('created')}</Col>
                            <Col sm={4}>
                              {userData?.user?.createdEvents?.length}
                            </Col>
                          </Row>
                          <Row className="border-bottom py-3">
                            <Col sm={8}>{t('joined')}</Col>
                            <Col sm={4}>
                              {userData?.user?.registeredEvents?.length}
                            </Col>
                          </Row>
                          <Row className="pt-3">
                            <Col sm={8}>{t('adminForEvents')}</Col>
                            <Col sm={4}>
                              {userData?.user?.eventAdmin?.length}
                            </Col>
                          </Row>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </section>
              </div>
            ) : (
              <UserUpdate id={currentUrl} toggleStateValue={toggleStateValue} />
            )}
          </Col>
        </Row>
      </OrganizationScreen>
    </>
  );
};

>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
export const prettyDate = (param: string): string => {
  const date = new Date(param);
  if (date?.toDateString() === 'Invalid Date') {
    return 'Unavailable';
  }
<<<<<<< HEAD
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};
=======
  return `${date?.toDateString()} ${date.toLocaleTimeString()}`;
};

>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
export const getLanguageName = (code: string): string => {
  let language = 'Unavailable';
  languages.map((data) => {
    if (data.code == code) {
      language = data.name;
    }
  });
  return language;
};
<<<<<<< HEAD
=======

>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
export default MemberDetail;
