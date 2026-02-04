/**
 * UserContactDetails component
 *
 * Renders the personal and contact information section of a member’s profile.
 * Allows users or administrators to view and update details such as avatar,
 * personal information, contact numbers, address, and other profile attributes.
 *
 * Features include avatar upload with validation, form state management,
 * conditional update actions, and localized labels.
 *
 * @param props - Component props.
 * Optional {@link MemberDetailProps.id | id} may be provided to fetch
 * and update the corresponding member’s contact details.
 *
 * @returns The rendered UserContactDetails component.
 *
 * @remarks
 * - Uses Apollo Client hooks for fetching and updating user data.
 * - Handles avatar uploads with file type and size validation.
 * - Provides form validation for sensitive fields such as passwords.
 * - Uses react-bootstrap components and MUI-based date pickers for UI.
 * - Supports localization via react-i18next.
 *
 * @example
 * ```tsx
 * <UserContactDetails id="12345" />
 * ```
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
import { sanitizeInput } from '../../../utils/SanitizeInput';
import {
  countryOptions,
  educationGradeEnum,
  maritalStatusEnum,
  genderEnum,
  employmentStatusEnum,
} from 'utils/formEnumFields';
import dayjs from 'dayjs';
import DropDownButton from 'shared-components/DropDownButton/DropDownButton';
import { validatePassword } from 'utils/passwordValidator';
import { FormFieldGroup } from 'shared-components/FormFieldGroup/FormFieldGroup';
import { MemberDetailProps } from 'types/AdminPortal/MemberDetail/type';
import { resolveAvatarFile } from './resolveAvatarFile';
import { phoneFieldConfigs, addressFieldConfigs } from './fieldConfigs';
const UserContactDetails: React.FC<MemberDetailProps> = ({
  id,
}): JSX.Element => {
  const { t } = useTranslation('translation', { keyPrefix: 'memberDetail' });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t: tCommon } = useTranslation('common');
  const location = useLocation();
  const { getItem } = useLocalStorage();
  const [isUpdated, setisUpdated] = useState(false);
  const params = useParams();
  const storedUserId = getItem('id') || getItem('userId');
  const currentId =
    location.state?.id || id || params.userId || storedUserId || '';
  const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null);
  const [newAvatarUploaded, setNewAvatarUploaded] = useState(false);

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
  const resolvedUserId = currentId;
  useEffect(() => {
    document.title = t('title');
  }, [t]);
  const [updateUser] = useMutation(UPDATE_USER_MUTATION);
  const { data, loading, error } = useQuery(GET_USER_BY_ID, {
    variables: {
      input: {
        id: resolvedUserId,
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
  const onAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileUpload(e);
    setNewAvatarUploaded(true);
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

    let avatarFile = await resolveAvatarFile({
      newAvatarUploaded,
      selectedAvatar,
      avatarURL: formState.avatarURL,
    });

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
      ...(resolvedUserId ? { id: resolvedUserId } : {}),
    };

    const input = removeEmptyFields(data);
    try {
      const { data: updateData } = await updateUser({
        variables: { input },
        refetchQueries: [
          {
            query: GET_USER_BY_ID,
            variables: { input: { id: resolvedUserId } },
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
      window.location.reload();
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
                    onChange={onAvatarChange}
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
                  <div className={styles.dropdownField}>
                    <DropDownButton
                      options={genderEnum.map((o) => ({
                        value: String(o.value),
                        label: String(o.label),
                      }))}
                      selectedValue={
                        formState.natalSex
                          ? String(formState.natalSex)
                          : undefined
                      }
                      onSelect={(val: string) =>
                        handleFieldChange('natalSex', val)
                      }
                      ariaLabel={t('gender')}
                      dataTestIdPrefix="inputNatalSex"
                      variant="outline-secondary"
                    />
                  </div>
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
                  <div className={styles.dropdownField}>
                    <DropDownButton
                      options={educationGradeEnum.map((o) => ({
                        value: String(o.value),
                        label: String(o.label),
                      }))}
                      selectedValue={
                        formState.educationGrade
                          ? String(formState.educationGrade)
                          : undefined
                      }
                      onSelect={(val: string) =>
                        handleFieldChange('educationGrade', val)
                      }
                      ariaLabel={t('educationGrade')}
                      dataTestIdPrefix="inputEducationGrade"
                      variant="outline-secondary"
                    />
                  </div>
                </Col>
                <Col md={6}>
                  <label htmlFor="empStatus" className="form-label">
                    {t('employmentStatus')}
                  </label>
                  <div className={styles.dropdownField}>
                    <DropDownButton
                      options={employmentStatusEnum.map((o) => ({
                        value: String(o.value),
                        label: String(o.label),
                      }))}
                      selectedValue={
                        formState.employmentStatus
                          ? String(formState.employmentStatus)
                          : undefined
                      }
                      onSelect={(val: string) =>
                        handleFieldChange('employmentStatus', val)
                      }
                      ariaLabel={t('employmentStatus')}
                      dataTestIdPrefix="employmentstatus-dropdown-btn"
                      variant="outline-secondary"
                    />
                  </div>
                </Col>
                <Col md={6}>
                  <label htmlFor="maritalStatus" className="form-label">
                    {t('maritalStatus')}
                  </label>
                  <div className={styles.dropdownField}>
                    <DropDownButton
                      options={maritalStatusEnum.map((o) => ({
                        value: String(o.value),
                        label: String(o.label),
                      }))}
                      selectedValue={
                        formState.maritalStatus
                          ? String(formState.maritalStatus)
                          : undefined
                      }
                      onSelect={(val: string) =>
                        handleFieldChange('maritalStatus', val)
                      }
                      ariaLabel={t('maritalStatus')}
                      dataTestIdPrefix="marital-status-btn"
                      variant="outline-secondary"
                    />
                  </div>
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
                    placeholder={tCommon('enterPassword')}
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
                {phoneFieldConfigs.map((field) => (
                  <Col md={12} key={field.id}>
                    <label htmlFor={field.id} className="form-label">
                      {t(field.key)}
                    </label>
                    <input
                      id={field.id}
                      value={
                        (formState[
                          field.key as keyof typeof formState
                        ] as string) || ''
                      }
                      className={`form-control ${styles.inputColor}`}
                      type="tel"
                      data-testid={field.testId}
                      name={field.id}
                      onChange={(e) =>
                        handleFieldChange(field.key, e.target.value)
                      }
                      placeholder={tCommon('memberDetailNumberExample')}
                    />
                  </Col>
                ))}
                {addressFieldConfigs.map((field) => (
                  <Col md={field.colSize} key={field.id}>
                    <label htmlFor={field.id} className="form-label">
                      {t(field.key)}
                    </label>
                    <input
                      id={field.id}
                      value={
                        (formState[
                          field.key as keyof typeof formState
                        ] as string) || ''
                      }
                      className={`form-control ${styles.inputColor}`}
                      type="text"
                      name={field.id}
                      data-testid={field.testId}
                      onChange={(e) =>
                        handleFieldChange(field.key, e.target.value)
                      }
                      placeholder={
                        field.key === 'postalCode'
                          ? tCommon('postalCode')
                          : field.key.includes('city')
                            ? tCommon('enterCity')
                            : tCommon('memberDetailExampleLane')
                      }
                    />
                  </Col>
                ))}
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
                className={styles.saveChangesBtn}
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
