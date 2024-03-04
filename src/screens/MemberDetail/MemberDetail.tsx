import React, { useEffect, useRef, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import UserUpdate from 'components/UserUpdate/UserUpdate';
import OrganizationScreen from 'components/OrganizationScreen/OrganizationScreen';
import SuperAdminScreen from 'components/SuperAdminScreen/SuperAdminScreen';
import { USER_DETAILS } from 'GraphQl/Queries/Queries';
import styles from './MemberDetail.module.css';
import { languages } from 'utils/languages';
import {
  ADD_ADMIN_MUTATION,
  UPDATE_USERTYPE_MUTATION,
  UPDATE_USER_MUTATION,
} from 'GraphQl/Mutations/mutations';
import { toast } from 'react-toastify';
import { errorHandler } from 'utils/errorHandler';
import Loader from 'components/Loader/Loader';
import useLocalStorage from 'utils/useLocalstorage';
import Avatar from 'components/Avatar/Avatar';
import { CalendarIcon } from '@mui/x-date-pickers';
import { Form } from 'react-bootstrap';
import convertToBase64 from 'utils/convertToBase64';

type MemberDetailProps = {
  id: string; // This is the userId
  from?: string;
};

const MemberDetail: React.FC<MemberDetailProps> = ({
  id,
  from,
}): JSX.Element => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'memberDetail',
  });

  const [state, setState] = useState(1);
  const [isAdmin, setIsAdmin] = useState(false);
  const isMounted = useRef(true);

  const { getItem, setItem } = useLocalStorage();
  const location = useLocation<MemberDetailProps>();
  const currentUrl = location.state?.id || getItem('id') || id;
  const orgId = window.location.href.split('=')[1];
  const calledFrom = location.state?.from || from;
  document.title = t('title');

  const [formState, setFormState] = useState({
    firstName: '',
    lastName: '',
    email: '',
    applangcode: '',
    file: '',
    gender: '',
    birthDate: '',
    educationGrade: '',
    employmentStatus: '',
    maritalStatus: '',
    phone: {
      home: '',
    },
    address: {
      line1: '',
      countryCode: '',
      city: '',
      state: '',
    },
    pluginCreationAllowed: false,
    adminApproved: false,
  });

  const [adda] = useMutation(ADD_ADMIN_MUTATION);
  const [updateUserType] = useMutation(UPDATE_USERTYPE_MUTATION);
  const [updateUser] = useMutation(UPDATE_USER_MUTATION);

  const {
    data: userData,
    loading: loading,
    error: error,
    refetch: refetch,
  } = useQuery(USER_DETAILS, {
    variables: { id: currentUrl }, // For testing we are sending the id as a prop
  });

  useEffect(() => {
    if (userData) {
      setFormState({
        ...formState,
        firstName: userData?.user?.firstName,
        lastName: userData?.user?.lastName,
        email: userData?.user?.email,
        applangcode: userData?.user?.applangcode,
        gender: userData?.user?.gender,
        birthDate: userData?.user?.birthDate,
        educationGrade: userData?.user?.educationGrade,
        employmentStatus: userData?.user?.employmentStatus,
        maritalStatus: userData?.user?.maritalStatus,
        phone: {
          home: userData?.user?.phone?.home,
        },
        address: {
          line1: userData?.user?.address?.line1,
          countryCode: userData?.user?.address?.countryCode,
          city: userData?.user?.address?.city,
          state: userData?.user?.address?.state,
        },
        pluginCreationAllowed: userData?.user?.pluginCreationAllowed,
        adminApproved: userData?.user?.adminApproved,
      });
    }
  }, [userData]);

  useEffect(() => {
    // check component is mounted or not
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormState({
      ...formState,
      [name]: value,
    });
    console.log(formState);
  };

  const handleAddressChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    const { name, value } = e.target;
    setFormState({
      ...formState,
      address: {
        ...formState.address,
        [name]: value,
      },
    });
    console.log(formState);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormState({
      ...formState,
      phone: {
        ...formState.phone,
        [name]: value,
      },
    });
    console.log(formState);
  };

  const handleToggleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, checked } = e.target;
    setFormState({
      ...formState,
      [name]: checked,
    });
    console.log(formState);
  };

  const loginLink = async (): Promise<void> => {
    try {
      const firstName = formState.firstName;
      const lastName = formState.lastName;
      const email = formState.email;
      const applangcode = formState.applangcode;
      const file = formState.file;
      const gender = formState.gender;
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
            setItem('UserImage', file);
          }
          toast.success('Successful updated');
        }
      } catch (error: any) {
        errorHandler(t, error);
      }
    } catch (error: any) {
      /* istanbul ignore next */
      errorHandler(t, error);
    }
  };

  /* istanbul ignore next */
  const toggleStateValue = (): void => {
    if (state === 1) setState(2);
    else setState(1);
    refetch();
  };

  if (loading) {
    return <Loader />;
  }

  /* istanbul ignore next */
  if (error) {
    window.location.assign(`/orgpeople/id=${currentUrl}`);
  }

  const addAdmin = async (): Promise<void> => {
    try {
      const { data } = await adda({
        variables: {
          userid: location.state?.id,
          orgid: orgId,
        },
      });

      /* istanbul ignore next */
      if (data) {
        try {
          const { data } = await updateUserType({
            variables: {
              id: location.state?.id,
              userType: 'ADMIN',
            },
          });
          if (data) {
            toast.success(t('addedAsAdmin'));
            setTimeout(() => {
              window.location.reload();
            }, 2000);
          }
        } catch (error: any) {
          errorHandler(t, error);
        }
      }
    } catch (error: any) {
      /* istanbul ignore next */
      if (
        userData.user.userType === 'ADMIN' ||
        userData.user.userType === 'SUPERADMIN'
      ) {
        if (isMounted.current) setIsAdmin(true);
        toast.error(t('alreadyIsAdmin'));
      } else {
        errorHandler(t, error);
      }
    }
  };

  const memberDetails = (
    <Row>
      <Col>
        {state == 1 ? (
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
                        id=""
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div>
                      <p className="my-0 mx-2">{t('lastName')}</p>
                      <input
                        value={formState.lastName}
                        className={`rounded border-0 p-2 m-2 ${styles.inputColor}`}
                        type="text"
                        name="lastName"
                        id=""
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div>
                      <p className="my-0 mx-2">{t('gender')}</p>
                      <input
                        value={formState.gender}
                        className={`rounded border-0 p-2 m-2 w-75 ${styles.inputColor}`}
                        type="text"
                        name="gender"
                        id=""
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <p className="my-0 mx-2">{t('birthDate')}</p>
                      <input
                        value={formState.birthDate}
                        className={`rounded border-0 p-2 m-2 ${styles.inputColor}`}
                        type="text"
                        name="birthDate"
                        id=""
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <p className="my-0 mx-2">{t('educationGrade')}</p>
                      <input
                        value={formState.educationGrade}
                        className={`rounded border-0 p-2 m-2 ${styles.inputColor}`}
                        type="text"
                        name="educationGrade"
                        id=""
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <p className="my-0 mx-2">{t('employmentStatus')}</p>
                      <input
                        value={formState.employmentStatus}
                        className={`rounded border-0 p-2 m-2 ${styles.inputColor}`}
                        type="text"
                        name="employmentStatus"
                        id=""
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <p className="my-0 mx-2">{t('maritalStatus')}</p>
                      <input
                        value={formState.maritalStatus}
                        className={`rounded border-0 p-2 m-2 ${styles.inputColor}`}
                        type="text"
                        name="maritalStatus"
                        id=""
                        onChange={handleChange}
                      />
                    </div>
                    <p className="my-0 mx-2 w-100">
                      {t('displayImage')}:
                      <Form.Control
                        className="w-75"
                        accept="image/*"
                        id="orgphoto"
                        name="photo"
                        type="file"
                        multiple={false}
                        onChange={async (
                          e: React.ChangeEvent,
                        ): Promise<void> => {
                          const target = e.target as HTMLInputElement;
                          const file = target.files && target.files[0];
                          if (file)
                            setFormState({
                              ...formState,
                              file: await convertToBase64(file),
                            });
                        }}
                        data-testid="organisationImage"
                      />
                    </p>
                  </div>
                </div>
                {/* Contact Info */}
                <div
                  className={`contact mt-5 bg-white border ${styles.allRound}`}
                >
                  <div
                    className={`d-flex border-bottom py-3 px-4 ${styles.topRadius}`}
                  >
                    <h3>{t('contactInfoHeading')}</h3>
                  </div>
                  <div className="d-flex flex-row flex-wrap py-3 px-3">
                    <div>
                      <p className="my-0 mx-2">{t('phone')}</p>
                      <input
                        value={formState.phone.home}
                        className={`rounded border-0 p-2 m-2 ${styles.inputColor}`}
                        type="number"
                        name="home"
                        id=""
                        onChange={handlePhoneChange}
                      />
                    </div>
                    <div className="w-50 p-2">
                      <p className="my-0">{t('email')}</p>
                      <input
                        value={formState.email}
                        className={`w-100 rounded border-0 p-2 ${styles.inputColor}`}
                        type="email"
                        name="email"
                        id=""
                        onChange={handleChange}
                      />
                    </div>
                    <div className="p-2" style={{ width: `82%` }}>
                      <p className="my-0">{t('address')}</p>
                      <input
                        value={formState.address.line1}
                        className={`w-100 rounded border-0 p-2 ${styles.inputColor}`}
                        type="email"
                        name="line1"
                        id=""
                        onChange={handleAddressChange}
                      />
                    </div>
                    <div className="w-25 p-2">
                      <p className="my-0">{t('countryCode')}</p>
                      <input
                        value={formState.address.countryCode}
                        className={`w-100 rounded border-0 p-2 ${styles.inputColor}`}
                        type="text"
                        name="countryCode"
                        id=""
                        onChange={handleAddressChange}
                      />
                    </div>
                    <div className="w-25 p-2">
                      <p className="my-0">{t('city')}</p>
                      <input
                        value={formState.address.city}
                        className={`w-100 rounded border-0 p-2 ${styles.inputColor}`}
                        type="text"
                        name="city"
                        id=""
                        onChange={handleAddressChange}
                      />
                    </div>
                    <div className="w-25 p-2">
                      <p className="my-0">{t('state')}</p>
                      <input
                        value={formState.address.state}
                        className={`w-100 rounded border-0 p-2 ${styles.inputColor}`}
                        type="text"
                        name="state"
                        id=""
                        onChange={handleAddressChange}
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
                      {userData?.user?.image ? (
                        <img
                          className={`rounded-circle mx-auto`}
                          style={{ width: '80px', aspectRatio: '1/1' }}
                          src={formState.file || userData?.user?.image}
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
                      <div className="p-1 bg-success text-white text-center rounded mt-1">
                        <p className="p-0 m-0">{userData?.user?.userType}</p>
                      </div>
                    </div>
                    <div className="d-flex flex-column mx-2">
                      <p className="fs-2 my-0 fw-medium">
                        {formState?.firstName}
                      </p>
                      <p className="my-0">{userData?.user?.email}</p>
                      <p className="my-0">
                        <CalendarIcon />
                        Joined on {prettyDate(userData?.user?.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div
                  className={`personal mt-4 bg-white border ${styles.allRound}`}
                >
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
                          name="adminApproved"
                          id=""
                          className="mx-2"
                          checked={formState.adminApproved}
                          onChange={handleToggleChange}
                          disabled // API not supporting this feature
                        />
                        <p className="p-0 m-0">
                          {`${t('adminApproved')} (API not supported yet)`}
                        </p>
                      </div>
                      <div className="d-flex flex-row">
                        <input
                          type="checkbox"
                          name="pluginCreationAllowed"
                          id=""
                          className="mx-2"
                          checked={formState.pluginCreationAllowed}
                          onChange={handleToggleChange}
                          disabled // API not supporting this feature
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
                              disabled
                              className="form-control"
                              data-testid="applangcode"
                              onChange={(e): void => {
                                setFormState({
                                  ...formState,
                                  applangcode: e.target.value,
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
                        <Button
                          className="btn btn-danger"
                          data-testid="deleteBtn"
                        >
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
            {/* Main Section And Activity section */}
          </div>
        ) : (
          <UserUpdate id={currentUrl} toggleStateValue={toggleStateValue} />
        )}
      </Col>
    </Row>
  );

  console.log(userData);
  return (
    <>
      {calledFrom === 'orglist' ? (
        <SuperAdminScreen screenName="Profile" title={t('title')}>
          {memberDetails}
        </SuperAdminScreen>
      ) : (
        <OrganizationScreen screenName="Profile" title={t('title')}>
          {memberDetails}
        </OrganizationScreen>
      )}
    </>
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
  return `${day}${getOrdinalSuffix(day)} ${month} ${year}`;
};

const getOrdinalSuffix = (day: number): string => {
  if (day >= 11 && day <= 13) {
    return 'th';
  }
  switch (day % 10) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
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
