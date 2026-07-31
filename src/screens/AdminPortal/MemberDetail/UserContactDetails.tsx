/**
 * UserContactDetails — Overview tab for /user/settings
 *
 * Two-column layout: Personal Details (left) + Contact Information (right).
 * Avatar upload, form fields, dropdowns for enums, date picker for DOB.
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { useLocation, useParams } from 'react-router';
import styles from './UserContactDetails.module.css';
import { UPDATE_USER_MUTATION } from 'GraphQl/Mutations/mutations';
import { GET_USER_BY_ID } from 'GraphQl/Queries/Queries';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import { errorHandler } from 'utils/errorHandler';
import useLocalStorage from 'utils/useLocalstorage';
import { ProfileAvatarDisplay } from 'shared-components/ProfileAvatarDisplay/ProfileAvatarDisplay';
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
import { InterfaceMemberDetailProps } from 'types/AdminPortal/MemberDetail/interface';
import { resolveAvatarFile } from './resolveAvatarFile';
import { phoneFieldConfigs, addressFieldConfigs } from './fieldConfigs';
import Button from 'shared-components/Button/Button';

/** Pencil edit icon SVG */
const PencilIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
  </svg>
);

const UserContactDetails: React.FC<InterfaceMemberDetailProps> = ({
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
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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
    postalCode: '',
    state: '',
    workPhoneNumber: '',
  });

  useEffect(() => {
    if (selectedAvatar) {
      const url = URL.createObjectURL(selectedAvatar);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [selectedAvatar]);

  const avatarDisplayUrl = useMemo(() => {
    if (previewUrl) return previewUrl;
    return formState.avatarURL && formState.avatarURL !== 'null'
      ? formState.avatarURL
      : undefined;
  }, [previewUrl, formState.avatarURL]);

  const resolvedUserId = currentId;
  useEffect(() => {
    document.title = t('title');
  }, [t]);

  const [updateUser] = useMutation(UPDATE_USER_MUTATION);
  const { data, loading, error } = useQuery(GET_USER_BY_ID, {
    variables: { input: { id: resolvedUserId } },
    fetchPolicy: 'no-cache',
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

    let avatarFile = await resolveAvatarFile({
      newAvatarUploaded,
      selectedAvatar,
      avatarURL: formState.avatarURL,
    });

    const payload: Omit<typeof formState, 'avatarURL' | 'emailAddress'> & {
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
      postalCode: formState.postalCode,
      state: formState.state,
      workPhoneNumber: formState.workPhoneNumber,
      avatar: selectedAvatar ? selectedAvatar : avatarFile,
      ...(resolvedUserId ? { id: resolvedUserId } : {}),
    };

    const input = removeEmptyFields(payload);
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
      setNewAvatarUploaded(false);
      setisUpdated(false);
    } catch (e: unknown) {
      errorHandler(t, e);
    }
  };

  const resetChanges = (): void => {
    setisUpdated(false);
    setSelectedAvatar(null);
    setNewAvatarUploaded(false);
    if (data?.user) setFormState({ ...data.user });
  };

  if (loading) {
    return <div data-testid="loader">{tCommon('loading')}</div>;
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className={styles.twoColGrid}>
        {/* ── Personal Details ── */}
        <div className={styles.cardWrapper}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardHeaderTitle}>
                {t('personalDetailsHeading')}
              </h3>
              <span className={styles.roleBadge}>
                {data?.user?.role === 'administrator'
                  ? tCommon('admin')
                  : tCommon('user')}
              </span>
            </div>

            <div className={styles.cardBody}>
              {/* Avatar */}
              <div className={styles.avatarSection}>
                <div className={styles.avatarWrapper}>
                  <ProfileAvatarDisplay
                    imageUrl={avatarDisplayUrl}
                    fallbackName={sanitizeInput(formState.name) || t('user')}
                    size="custom"
                    customSize={80}
                    shape="circle"
                    objectFit="cover"
                    dataTestId="profile-picture"
                    crossOrigin="anonymous"
                    className={styles.avatarImage}
                    enableEnlarge={true}
                  />
                  <Button
                    variant="plain"
                    type="button"
                    className={styles.avatarEditBtn}
                    onClick={() => fileInputRef.current?.click()}
                    data-testid="uploadImageBtn"
                    title={tCommon('userEditProfilePicture')}
                    aria-label={tCommon('userEditProfilePicture')}
                  >
                    <PencilIcon />
                  </Button>
                </div>
                <input
                  accept="image/*"
                  id="postphoto"
                  name="photo"
                  type="file"
                  className={styles.hiddenFileInput}
                  data-testid="fileInput"
                  multiple={false}
                  ref={fileInputRef}
                  onChange={onAvatarChange}
                />
              </div>

              {/* Fields */}
              <div className={styles.formGrid}>
                <div className={styles.formCol6}>
                  <label htmlFor="name" className={styles.fieldLabel}>
                    {tCommon('name')}
                  </label>
                  <input
                    id="name"
                    value={formState.name}
                    className="form-input"
                    type="text"
                    name="name"
                    data-testid="inputName"
                    onChange={(e) => handleFieldChange('name', e.target.value)}
                    required
                    placeholder={tCommon('name')}
                  />
                </div>
                <div className={styles.formCol6} data-testid="gender">
                  <label htmlFor="gender" className={styles.fieldLabel}>
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
                    />
                  </div>
                </div>
                <div className={styles.formCol6}>
                  <label htmlFor="birthDate" className={styles.fieldLabel}>
                    {t('birthDate')}
                  </label>
                  <div className={styles.dateField}>
                    <DatePicker
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
                  </div>
                </div>
                <div className={styles.formCol6}>
                  <label htmlFor="grade" className={styles.fieldLabel}>
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
                    />
                  </div>
                </div>
                <div className={styles.formCol6}>
                  <label htmlFor="empStatus" className={styles.fieldLabel}>
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
                    />
                  </div>
                </div>
                <div className={styles.formCol6}>
                  <label htmlFor="maritalStatus" className={styles.fieldLabel}>
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
                    />
                  </div>
                </div>
                <div className={styles.formCol12}>
                  <label htmlFor="description" className={styles.fieldLabel}>
                    {tCommon('description')}
                  </label>
                  <input
                    id="description"
                    value={formState.description}
                    className="form-input"
                    type="text"
                    name="description"
                    data-testid="inputDescription"
                    onChange={(e) =>
                      handleFieldChange('description', e.target.value)
                    }
                    required
                    placeholder={tCommon('enterDescription')}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Contact Information ── */}
        <div className={styles.cardWrapper}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardHeaderTitle}>
                {t('contactInfoHeading')}
              </h3>
            </div>

            <div className={styles.cardBody}>
              <div className={styles.formGrid}>
                <div className={styles.formCol12}>
                  <label htmlFor="email" className={styles.fieldLabel}>
                    {tCommon('email')}
                  </label>
                  <input
                    id="email"
                    value={data?.user?.emailAddress}
                    className="form-input"
                    type="email"
                    name="email"
                    data-testid="inputEmail"
                    disabled
                    placeholder={tCommon('email')}
                  />
                </div>
                {phoneFieldConfigs.map((field) => (
                  <div className={styles.formCol12} key={field.id}>
                    <label htmlFor={field.id} className={styles.fieldLabel}>
                      {t(field.key)}
                    </label>
                    <input
                      id={field.id}
                      value={
                        (formState[
                          field.key as keyof typeof formState
                        ] as string) || ''
                      }
                      className="form-input"
                      type="tel"
                      data-testid={field.testId}
                      name={field.id}
                      onChange={(e) =>
                        handleFieldChange(field.key, e.target.value)
                      }
                      placeholder={tCommon('memberDetailNumberExample')}
                    />
                  </div>
                ))}
                {addressFieldConfigs.map((field) => (
                  <div
                    className={
                      field.colSize === 12 ? styles.formCol12 : styles.formCol6
                    }
                    key={field.id}
                  >
                    <label htmlFor={field.id} className={styles.fieldLabel}>
                      {t(field.key)}
                    </label>
                    <input
                      id={field.id}
                      value={
                        (formState[
                          field.key as keyof typeof formState
                        ] as string) || ''
                      }
                      className="form-input"
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
                  </div>
                ))}
                <div className={styles.formCol12}>
                  <label htmlFor="country" className={styles.fieldLabel}>
                    {tCommon('country')}
                  </label>
                  <select
                    id="country"
                    className="form-input"
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
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Save / Reset ── */}
        {isUpdated && (
          <div className={styles.footerActions}>
            <div className={styles.footerActionsInner}>
              <Button
                variant="secondary"
                onClick={resetChanges}
                data-testid="resetChangesBtn"
              >
                {tCommon('resetChanges')}
              </Button>
              <Button
                variant="primary"
                onClick={handleUserUpdate}
                data-testid="saveChangesBtn"
              >
                {tCommon('saveChanges')}
              </Button>
            </div>
          </div>
        )}
      </div>
    </LocalizationProvider>
  );
};
export default UserContactDetails;
