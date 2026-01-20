/**
 * UserContactDetails
 *
 * Renders a comprehensive profile view for a user.
 *
 * @param props - Props for UserContactDetails.
 */
import React, { useEffect, useRef, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { Button } from 'shared-components/Button';
import { useTranslation } from 'react-i18next';
import { useLocation, useParams } from 'react-router';
import styles from './UserContactDetails.module.css';
import { UPDATE_USER_MUTATION } from 'GraphQl/Mutations/mutations';
import { GET_USER_BY_ID } from 'GraphQl/Queries/Queries';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import { errorHandler } from 'utils/errorHandler';
import { Card, Row, Col } from 'react-bootstrap';
import useLocalStorage from 'utils/useLocalstorage';
import Avatar from 'shared-components/Avatar/Avatar';
import DatePicker from 'shared-components/DatePicker';
import {
  AdapterDayjs,
  LocalizationProvider,
} from 'shared-components/DateRangePicker';
import { sanitizeInput } from '../../utils/SanitizeInput';
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
import { FormFieldGroup } from 'shared-components/FormFieldGroup/FormFieldGroup';
type MemberDetailProps = { id?: string };
const UserContactDetails: React.FC<MemberDetailProps> = ({
  id,
}): JSX.Element => {
  const { t } = useTranslation('translation', { keyPrefix: 'memberDetail' });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t: tCommon } = useTranslation('common');
  const location = useLocation();
  const { getItem } = useLocalStorage();
  const [isUpdated, setisUpdated] = useState(false);
  const currentId = location.state?.id || getItem('id') || id;
  const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null);
  document.title = t('title');
  const [formState, setFormState] = useState({
    addressLine1: '',
    addressLine2: '',
    birthDate: null as string | null,
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
  const isUser = location.pathname.split('/')[1] === 'user';
  const isAdmin = location.pathname.split('/')[1] === 'admin';
  const params = useParams();
  const userId: string =
    (!(isUser || isAdmin)
      ? params.userId
      : getItem('userId') || getItem('id')) || '';
  useEffect(() => {
    document.title = t('title');
  }, [t]);
  const [updateUser] = useMutation(UPDATE_USER_MUTATION);
  const { data, loading, error } = useQuery(GET_USER_BY_ID, {
    variables: {
      input: {
        id: currentId,
      },
      fetchPolicy: 'no-cache',
    },
  });
  useEffect(() => {
    if (error) {
      NotificationToast.error(tCommon('failedToLoadUserData'));
      return;
    }
    if (!data?.user) return;
    const { birthDate, ...rest } = data.user;
    setFormState((prev) => ({
      ...prev,
      ...rest,
      birthDate: birthDate ? dayjs(birthDate).format('YYYY-MM-DD') : '',
    }));
  }, [data, error, t]);
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target?.files?.[0];
    if (!file) return;
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type))
      return NotificationToast.error(t('invalidFileType'));
    if (file.size > 5 * 1024 * 1024)
      return NotificationToast.error(t('fileTooLarge'));
    const sanitizedFileName = file.name.replace(/[^a-z0-9._-]/gi, '_');
    const sanitizedFile = new File([file], sanitizedFileName, {
      type: file.type,
    });
    setSelectedAvatar(sanitizedFile);
    setisUpdated(true);
  };
  const handleFieldChange = (fieldName: string, value: string) => {
    setisUpdated(true);
    setFormState((prev) => ({ ...prev, [fieldName]: sanitizeInput(value) }));
  };
  const handleUserUpdate = async (): Promise<void> => {
    const removeEmptyFields = <T extends Record<string, string | File | null>>(
      obj: T,
    ) =>
      Object.fromEntries(
        Object.entries(obj).filter(
          ([, v]) => v != null && (typeof v !== 'string' || v.trim()),
        ),
      ) as Partial<T>;
    const passwordError = formState.password
      ? validatePassword(formState.password)
      : null;
    if (passwordError) {
      NotificationToast.error(passwordError);
      return;
    }
    const avatarFile =
      !selectedAvatar && formState.avatarURL
        ? await urlToFile(formState.avatarURL).catch(() => {
            NotificationToast.error(
              'Failed to process profile picture. Please try uploading again.',
            );
            return null;
          })
        : null;
    const data: Omit<typeof formState, 'avatarURL' | 'emailAddress'> & {
      id?: string;
    } = {
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
      ...(!isUser && !isAdmin ? { id: userId } : {}),
    };

    const input = removeEmptyFields(data);
    try {
      const { data: updateData } = await updateUser({
        variables: { input },
        refetchQueries: [
          {
            query: GET_USER_BY_ID,
            variables: { input: { id: currentId } },
          },
        ],
      });
      if (updateData)
        NotificationToast.success(
          tCommon('updatedSuccessfully', {
            item: tCommon('profile'),
          }) as string,
        );
      setSelectedAvatar(null);
      setisUpdated(false);
    } catch (e: unknown) {
      errorHandler(t, e);
    }
  };
  const resetChanges = (): void => {
    setisUpdated(false);
    if (data?.user) setFormState({ ...data.user });
  };
  if (loading) {
    return <div data-testid="loader">{tCommon('loading')}</div>;
  }
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Row className="g-4 mt-1">
        <Col md={6}>
          <Card className={`${styles.allRound}`}>
            <Card.Header className={styles.userContactDetailPersonalCardHeader}>
              <h3 className="m-0 font-black">{t('personalDetailsHeading')}</h3>
              <Button
                variant="light"
                size="sm"
                disabled
                className="rounded-pill fw-bolder"
              >
                {data?.user?.role === 'administrator'
                  ? tCommon('admin')
                  : tCommon('user')}
              </Button>
            </Card.Header>
            <Card.Body className="py-3 px-3">
              <Col lg={12} className="mb-2">
                <div className="text-center mb-3">
                  <div className="position-relative d-inline-block">
                    {selectedAvatar || formState?.avatarURL ? (
                      <img
                        className={`rounded-circle ${styles.userContactDetailContactAvatarUrl}`}
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
                        name={sanitizeInput(formState.name)}
                        alt={tCommon('userImage')}
                        size={60}
                        dataTestId="profile-picture"
                        radius={150}
                      />
                    )}
                    <button
                      type="button"
                      className={`fas fa-edit position-absolute bottom-0 right-0 p-2 bg-white rounded-circle ${styles.userContactDetailContactAvatarEditIcon}`}
                      onClick={() => fileInputRef.current?.click()}
                      data-testid="uploadImageBtn"
                      title={tCommon('userEditProfilePicture')}
                      aria-label={tCommon('userEditProfilePicture')}
                    />
                  </div>
                </div>
                <FormFieldGroup name="photo" label={''}>
                  <input
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
                </FormFieldGroup>
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
                    data-testid="inputNatalSex"
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
                    data-testid="employmentstatus-dropdown-btn"
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
                    placeholder={tCommon('enterDescription')}
                  />
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className={`${styles.allRound}`}>
            <Card.Header className={`py-3 px-4 ${styles.topRadius}`}>
              <h3 className="m-0 font-black">{t('contactInfoHeading')}</h3>
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
                    data-testid="inputAddressLine1"
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
                    data-testid="inputAddressLine2"
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
                    placeholder={tCommon('postalCode')}
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
                  <FormFieldGroup name="country" label={tCommon('country')}>
                    <select
                      id="country"
                      className={`form-control ${styles.inputColor}`}
                      value={formState.countryCode}
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
                          >
                            {String(country.label)}
                          </option>
                        ))}
                    </select>
                  </FormFieldGroup>
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
