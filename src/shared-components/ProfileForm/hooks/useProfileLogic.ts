import React, { useEffect, useRef, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { useLocation, useParams } from 'react-router';
import {
  UPDATE_CURRENT_USER_MUTATION,
  UPDATE_USER_MUTATION,
} from 'GraphQl/Mutations/mutations';
import { USER_DETAILS } from 'GraphQl/Queries/Queries';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import { errorHandler } from 'utils/errorHandler';
import useLocalStorage from 'utils/useLocalstorage';
import { urlToFile } from 'utils/urlToFile';
import { validatePassword } from 'utils/passwordValidator';
import { removeEmptyFields, validateImageFile } from 'utils/userUpdateUtils';
// UPDATED: Import from the new centralized interface file
import { IProfileFormState } from '../../../types/shared-components/ProfileForm/interface';

export const useProfileLogic = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'memberDetail' });
  const { t: tCommon } = useTranslation('common');
  const location = useLocation();
  const params = useParams();
  const { getItem, setItem } = useLocalStorage();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const originalImageState = useRef<string>('');

  const [show, setShow] = useState(false);
  const [isUpdated, setisUpdated] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null);
  const [hideDrawer, setHideDrawer] = useState<boolean>(() => {
    const stored = getItem('sidebar');
    return stored === 'true';
  });

  // Determine context (User, Admin, or Member view)
  const isUser = location.pathname.split('/')[1] === 'user';
  const isAdmin = location.pathname.split('/')[1] === 'admin';
  const userId: string =
    (!(isUser || isAdmin)
      ? params.userId
      : getItem('userId') || getItem('id')) || '';

  const [formState, setFormState] = useState<IProfileFormState>({
    addressLine1: '',
    addressLine2: '',
    birthDate: null,
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

  // GraphQL Operations
  const [updateUser] = useMutation(UPDATE_USER_MUTATION);
  const [updateCurrentUser] = useMutation(UPDATE_CURRENT_USER_MUTATION);
  const { data: userData, loading } = useQuery(USER_DETAILS, {
    variables: { input: { id: userId } },
  });

  // Effects
  useEffect(() => {
    document.title = t('title');
  }, [t]);

  useEffect(() => {
    if (userData?.user) {
      setFormState(userData.user);
      originalImageState.current = userData.user?.avatarURL || '';
    }
  }, [userData]);

  // Handlers
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target?.files?.[0];
    const isValid = validateImageFile(file, tCommon);

    if (!isValid || !file) return;

    setFormState((prevState) => ({ ...prevState, avatar: file }));
    setSelectedAvatar(file);
    setisUpdated(true);
  };

  const handleFieldChange = (fieldName: string, value: string): void => {
    if (fieldName === 'password' && value) {
      if (!validatePassword(value)) {
        NotificationToast.error(
          tCommon('passwordLengthRequirement', { length: 8 }) as string,
        );
        return;
      }
    }
    setisUpdated(true);
    setFormState((prevState) => ({ ...prevState, [fieldName]: value }));
  };

  const handleUserUpdate = async (): Promise<void> => {
    let avatarFile: File | null = null;
    if (!selectedAvatar && formState.avatarURL) {
      try {
        avatarFile = await urlToFile(formState.avatarURL);
      } catch {
        NotificationToast.error(tCommon('profilePictureUploadError') as string);
        return;
      }
    }

    const data: Omit<IProfileFormState, 'avatarURL' | 'emailAddress'> & {
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

    // Cast 'data' to Record to satisfy removeEmptyFields signature despite 'undefined' in interface
    const input = removeEmptyFields(
      data as unknown as Record<string, string | File | null>,
    );

    try {
      const { data: updateData } =
        isUser || isAdmin
          ? await updateCurrentUser({ variables: { input } })
          : await updateUser({ variables: { input } });

      if (updateData) {
        NotificationToast.success(
          tCommon('updatedSuccessfully', { item: 'Profile' }) as string,
        );
        if (isUser || isAdmin) {
          setItem('UserImage', updateData.updateCurrentUser.avatarURL);
          setItem('name', updateData.updateCurrentUser.name);
          setItem('email', updateData.updateCurrentUser.emailAddress);
          setItem('id', updateData.updateCurrentUser.id);
          setItem('role', updateData.updateCurrentUser.role);
        }
        setSelectedAvatar(null);
        setisUpdated(false);
      }
    } catch (error: unknown) {
      errorHandler(t, error);
    }
  };

  const resetChanges = (): void => {
    setisUpdated(false);
    if (userData?.user) {
      setFormState({
        ...userData.user,
        avatar: originalImageState.current,
      });
    }
  };

  const handleEventsAttendedModal = (): void => {
    setShow(!show);
  };

  return {
    formState,
    userData,
    loading,
    isUpdated,
    selectedAvatar,
    fileInputRef,
    show,
    hideDrawer,
    setHideDrawer,
    setShow,
    isUser,
    isAdmin,
    handlers: {
      handleFieldChange,
      handleFileUpload,
      handleUserUpdate,
      resetChanges,
      handleEventsAttendedModal,
    },
    t,
    tCommon,
  };
};
