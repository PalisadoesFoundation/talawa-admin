import React, { useEffect, useRef, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import Button from 'react-bootstrap/Button';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import styles from '../../style/app.module.css';
import { languages } from 'utils/languages';
import { UPDATE_USER_MUTATION } from 'GraphQl/Mutations/mutations';
import { USER_DETAILS } from 'GraphQl/Queries/Queries';
import { toast } from 'react-toastify';
import { errorHandler } from 'utils/errorHandler';
import { Card, Row, Col } from 'react-bootstrap';
import Loader from 'components/Loader/Loader';
import useLocalStorage from 'utils/useLocalstorage';
import Avatar from 'components/Avatar/Avatar';
import EventsAttendedByMember from '../../components/MemberDetail/EventsAttendedByMember';
import MemberAttendedEventsModal from '../../components/MemberDetail/EventsAttendedMemberModal';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import convertToBase64 from 'utils/convertToBase64';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import {
  educationGradeEnum,
  maritalStatusEnum,
  genderEnum,
  employmentStatusEnum,
} from 'utils/formEnumFields';
import DynamicDropDown from 'components/DynamicDropDown/DynamicDropDown';
import type { InterfaceEvent } from 'components/EventManagement/EventAttendance/InterfaceEvents';
import type { InterfaceTagData } from 'utils/interfaces';
import InfiniteScroll from 'react-infinite-scroll-component';
import InfiniteScrollLoader from 'components/InfiniteScrollLoader/InfiniteScrollLoader';
import UnassignUserTagModal from 'screens/ManageTag/UnassignUserTagModal';
import { UNASSIGN_USER_TAG } from 'GraphQl/Mutations/TagMutations';
import { TAGS_QUERY_DATA_CHUNK_SIZE } from 'utils/organizationTagsUtils';

type MemberDetailProps = {
  id?: string;
};

/**
 * MemberDetail component is used to display the details of a user.
 * It also allows the user to update the details. It uses the UPDATE_USER_MUTATION to update the user details.
 * It uses the USER_DETAILS query to get the user details. It uses the useLocalStorage hook to store the user
 *  details in the local storage.
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
  const currentUrl = location.state?.id || getItem('id') || id;

  const { orgId } = useParams();
  const navigate = useNavigate();

  const [unassignUserTagModalIsOpen, setUnassignUserTagModalIsOpen] =
    useState(false);

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
  const handleDateChange = (date: Dayjs | null): void => {
    if (date) {
      setisUpdated(true);
      setFormState((prevState) => ({
        ...prevState,
        birthDate: dayjs(date).format('YYYY-MM-DD'),
      }));
    }
  };

  /*istanbul ignore next*/
  const handleEditIconClick = (): void => {
    fileInputRef.current?.click();
  };
  const [updateUser] = useMutation(UPDATE_USER_MUTATION);
  const {
    data: user,
    loading,
    refetch: refetchUserDetails,
    fetchMore: fetchMoreAssignedTags,
  } = useQuery(USER_DETAILS, {
    variables: { id: currentUrl, first: TAGS_QUERY_DATA_CHUNK_SIZE },
  });
  const userData = user?.user;
  const [isUpdated, setisUpdated] = useState(false);
  useEffect(() => {
    if (userData && isMounted.current) {
      setFormState({
        ...formState,
        firstName: userData?.user?.firstName,
        lastName: userData?.user?.lastName,
        email: userData?.user?.email,
        appLanguageCode: userData?.appUserProfile?.appLanguageCode,
        gender: userData?.user?.gender,
        birthDate: userData?.user?.birthDate || ' ',
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

  const tagsAssigned =
    userData?.user?.tagsAssignedWith.edges.map(
      (edge: { node: InterfaceTagData; cursor: string }) => edge.node,
    ) ?? /* istanbul ignore next */ [];

  const loadMoreAssignedTags = (): void => {
    fetchMoreAssignedTags({
      variables: {
        first: TAGS_QUERY_DATA_CHUNK_SIZE,
        after:
          user?.user?.user?.tagsAssignedWith?.pageInfo?.endCursor ??
          /* istanbul ignore next */
          null,
      },
      updateQuery: (prevResult, { fetchMoreResult }) => {
        if (!fetchMoreResult) /* istanbul ignore next */ return prevResult;

        return {
          user: {
            ...prevResult.user,
            user: {
              ...prevResult.user.user,
              tagsAssignedWith: {
                edges: [
                  ...prevResult.user.user.tagsAssignedWith.edges,
                  ...fetchMoreResult.user.user.tagsAssignedWith.edges,
                ],
                pageInfo: fetchMoreResult.user.user.tagsAssignedWith.pageInfo,
                totalCount: fetchMoreResult.user.user.tagsAssignedWith.pageInfo,
              },
            },
          },
        };
      },
    });
  };

  const [unassignUserTag] = useMutation(UNASSIGN_USER_TAG);
  const [unassignTagId, setUnassignTagId] = useState<string | null>(null);

  const handleUnassignUserTag = async (): Promise<void> => {
    try {
      await unassignUserTag({
        variables: {
          tagId: unassignTagId,
          userId: currentUrl,
        },
      });

      refetchUserDetails();
      toggleUnassignUserTagModal();
      toast.success(t('successfullyUnassigned'));
    } catch (error: unknown) {
      /* istanbul ignore next */
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  const toggleUnassignUserTagModal = (): void => {
    if (unassignUserTagModalIsOpen) {
      setUnassignTagId(null);
    }
    setUnassignUserTagModalIsOpen(!unassignUserTagModalIsOpen);
  };

  const handleChange = async (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ): Promise<void> => {
    const { name, value } = e.target;
    /*istanbul ignore next*/
    if (
      name === 'photo' &&
      'files' in e.target &&
      e.target.files &&
      e.target.files[0]
    ) {
      const file = e.target.files[0];
      const base64 = await convertToBase64(file);
      setFormState((prevState) => ({
        ...prevState,
        image: base64 as string,
      }));
    } else {
      setFormState((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
    setisUpdated(true);
  };
  const handleEventsAttendedModal = (): void => {
    setShow(!show);
  };

  const loginLink = async (): Promise<void> => {
    try {
      const firstName = formState.firstName;
      const lastName = formState.lastName;
      const email = formState.email;
      // const appLanguageCode = formState.appLanguageCode;
      const image = formState.image;
      // const gender = formState.gender;
      try {
        const { data } = await updateUser({
          variables: {
            id: currentUrl,
            ...formState,
          },
        });
        /* istanbul ignore next */
        if (data) {
          setisUpdated(false);
          if (getItem('id') === currentUrl) {
            setItem('FirstName', firstName);
            setItem('LastName', lastName);
            setItem('Email', email);
            setItem('UserImage', image);
          }
          toast.success(tCommon('successfullyUpdated') as string);
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
  };
  const resetChanges = (): void => {
    /*istanbul ignore next*/
    setFormState({
      firstName: userData?.user?.firstName || '',
      lastName: userData?.user?.lastName || '',
      email: userData?.user?.email || '',
      appLanguageCode: userData?.appUserProfile?.appLanguageCode || '',
      image: userData?.user?.image || '',
      gender: userData?.user?.gender || '',
      empStatus: userData?.user?.employmentStatus || '',
      maritalStatus: userData?.user?.maritalStatus || '',
      phoneNumber: userData?.user?.phone?.mobile || '',
      address: userData?.user?.address?.line1 || '',
      country: userData?.user?.address?.countryCode || '',
      city: userData?.user?.address?.city || '',
      state: userData?.user?.address?.state || '',
      birthDate: userData?.user?.birthDate || '',
      grade: userData?.user?.educationGrade || '',
      pluginCreationAllowed:
        userData?.appUserProfile?.pluginCreationAllowed || false,
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
                {userData?.appUserProfile?.isSuperAdmin
                  ? 'Super Admin'
                  : userData?.appUserProfile?.adminFor.length > 0
                    ? 'Admin'
                    : 'User'}
              </Button>
            </Card.Header>
            <Card.Body className="py-3 px-3">
              <div className="text-center mb-3">
                {formState?.image ? (
                  <div className="position-relative d-inline-block">
                    <img
                      className="rounded-circle"
                      style={{ width: '55px', aspectRatio: '1/1' }}
                      src={formState.image}
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
                      onKeyDown={
                        /*istanbul ignore next*/
                        (e) => e.key === 'Enter' && handleEditIconClick()
                      }
                    />
                  </div>
                ) : (
                  <div className="position-relative d-inline-block">
                    <Avatar
                      name={`${formState.firstName} ${formState.lastName}`}
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
                  onChange={handleChange}
                  data-testid="organisationImage"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                />
              </div>
              <Row className="g-3">
                <Col md={6}>
                  <label htmlFor="firstName" className="form-label">
                    {tCommon('firstName')}
                  </label>
                  <input
                    id="firstName"
                    value={formState.firstName}
                    className={`form-control ${styles.inputColor}`}
                    type="text"
                    name="firstName"
                    onChange={handleChange}
                    required
                    placeholder={tCommon('firstName')}
                  />
                </Col>
                <Col md={6}>
                  <label htmlFor="lastName" className="form-label">
                    {tCommon('lastName')}
                  </label>
                  <input
                    id="lastName"
                    value={formState.lastName}
                    className={`form-control ${styles.inputColor}`}
                    type="text"
                    name="lastName"
                    onChange={handleChange}
                    required
                    placeholder={tCommon('lastName')}
                  />
                </Col>
                <Col md={6}>
                  <label htmlFor="gender" className="form-label">
                    {t('gender')}
                  </label>
                  <DynamicDropDown
                    formState={formState}
                    setFormState={setFormState}
                    fieldOptions={genderEnum}
                    fieldName="gender"
                    handleChange={handleChange}
                  />
                </Col>
                <Col md={6}>
                  <label htmlFor="birthDate" className="form-label">
                    {t('birthDate')}
                  </label>
                  <DatePicker
                    className={`${styles.dateboxMemberDetail} w-100`}
                    value={dayjs(formState.birthDate)}
                    onChange={handleDateChange}
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
                    fieldName="grade"
                    handleChange={handleChange}
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
                    fieldName="empStatus"
                    handleChange={handleChange}
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
                    handleChange={handleChange}
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
                    value={formState.email}
                    className={`form-control ${styles.inputColor}`}
                    type="email"
                    name="email"
                    onChange={handleChange}
                    required
                    placeholder={tCommon('email')}
                  />
                </Col>
                <Col md={12}>
                  <label htmlFor="phoneNumber" className="form-label">
                    {t('phone')}
                  </label>
                  <input
                    id="phoneNumber"
                    value={formState.phoneNumber}
                    className={`form-control ${styles.inputColor}`}
                    type="tel"
                    name="phoneNumber"
                    onChange={handleChange}
                    pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                    placeholder={t('phone')}
                  />
                </Col>
                <Col md={12}>
                  <label htmlFor="address" className="form-label">
                    {tCommon('address')}
                  </label>
                  <input
                    id="address"
                    value={formState.address}
                    className={`form-control ${styles.inputColor}`}
                    type="text"
                    name="address"
                    onChange={handleChange}
                    placeholder={tCommon('address')}
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
                    onChange={handleChange}
                    placeholder={t('city')}
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
                    onChange={handleChange}
                    placeholder={tCommon('state')}
                  />
                </Col>
                <Col md={12}>
                  <label htmlFor="country" className="form-label">
                    {t('countryCode')}
                  </label>
                  <input
                    id="country"
                    value={formState.country}
                    className={`form-control ${styles.inputColor}`}
                    type="text"
                    name="country"
                    onChange={handleChange}
                    placeholder={t('countryCode')}
                  />
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
                onClick={loginLink}
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
            >
              {!tagsAssigned.length ? (
                <div className="w-100 h-100 d-flex justify-content-center align-items-center fw-semibold text-secondary">
                  {t('noTagsAssigned')}
                </div>
              ) : (
                <InfiniteScroll
                  dataLength={tagsAssigned?.length ?? 0}
                  next={loadMoreAssignedTags}
                  hasMore={
                    userData?.user?.tagsAssignedWith.pageInfo.hasNextPage ??
                    /* istanbul ignore next */
                    false
                  }
                  loader={<InfiniteScrollLoader />}
                  scrollableTarget="tagsAssignedScrollableDiv"
                >
                  {tagsAssigned.map((tag: InterfaceTagData, index: number) => (
                    <div key={tag._id}>
                      <div className="d-flex justify-content-between my-2 ms-2">
                        <div
                          className={styles.tagLink}
                          data-testid="tagName"
                          onClick={() =>
                            navigate(`/orgtags/${orgId}/manageTag/${tag._id}`)
                          }
                        >
                          {tag.parentTag ? (
                            <>
                              <i className={'fa fa-angle-double-right'} />
                              <span className="me-2">...</span>
                            </>
                          ) : (
                            <i className={'me-2 fa fa-angle-right'} />
                          )}
                          {tag.name}
                        </div>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => {
                            setUnassignTagId(tag._id);
                            toggleUnassignUserTagModal();
                          }}
                          className="me-2"
                          data-testid="unassignTagBtn"
                        >
                          {'Unassign'}
                        </Button>
                      </div>
                      {index + 1 !== tagsAssigned.length && (
                        <hr className="mx-0" />
                      )}
                    </div>
                  ))}
                </InfiniteScroll>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col>
          <Card className={`${styles.contact} ${styles.allRound} mt-3`}>
            <Card.Header
              className={`bg-primary d-flex justify-content-between align-items-center py-3 px-4 ${styles.topRadius}`}
            >
              <h3 className="text-white m-0" data-testid="eventsAttended-title">
                {t('eventsAttended')}
              </h3>
              <Button
                style={{ borderRadius: '20px' }}
                size="sm"
                variant="light"
                data-testid="viewAllEvents"
                onClick={handleEventsAttendedModal}
              >
                {t('viewAll')}
              </Button>
            </Card.Header>
            <Card.Body
              className={`${styles.cardBody} ${styles.scrollableCardBody}`}
            >
              {!userData?.user.eventsAttended?.length ? (
                <div
                  className={`${styles.emptyContainer} w-100 h-100 d-flex justify-content-center align-items-center fw-semibold text-secondary`}
                >
                  {t('noeventsAttended')}
                </div>
              ) : (
                userData.user.eventsAttended.map(
                  (event: InterfaceEvent, index: number) => (
                    <span data-testid="membereventsCard" key={index}>
                      <EventsAttendedByMember
                        eventsId={event._id}
                        key={index}
                      />
                    </span>
                  ),
                )
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Unassign User Tag Modal */}
      <UnassignUserTagModal
        unassignUserTagModalIsOpen={unassignUserTagModalIsOpen}
        toggleUnassignUserTagModal={toggleUnassignUserTagModal}
        handleUnassignUserTag={handleUnassignUserTag}
        t={t}
        tCommon={tCommon}
      />
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
