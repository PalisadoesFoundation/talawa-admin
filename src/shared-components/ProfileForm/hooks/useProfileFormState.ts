/**
 * Custom hook for managing ProfileForm state and validation
 * Consolidates form state, field changes, and validation logic
 */

import { useState, useRef } from 'react';
import { validatePassword } from 'utils/passwordValidator';
import { validateImageFile } from 'utils/userUpdateUtils';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import { FormStateType } from 'types/ProfileForm/type';

export const useProfileFormState = (tCommon: any) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const originalImageState = useRef<string>('');
  const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null);
  const [isUpdated, setIsUpdated] = useState(false);
  
  const [formState, setFormState] = useState<FormStateType>({
    addressLine1: '',
    addressLine2: '',
    birthDate: null,
    emailAddress: '',
    city: '',
    avatar: null,
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

  const initializeFormState = (userData: any) => {
    if (userData?.user) {
      setFormState(userData.user);
      originalImageState.current = userData.user?.avatarURL || '';
    }
  };

  const handleFieldChange = (fieldName: string, value: string) => {
    if (fieldName === 'password' && value) {
      if (!validatePassword(value)) {
        NotificationToast.error(
          tCommon('passwordLengthRequirement', { length: 8 }) as string
        );
        return;
      }
    }

    setIsUpdated(true);
    setFormState((prevState) => ({ ...prevState, [fieldName]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target?.files?.[0];
    const isValid = validateImageFile(file, tCommon);
    
    if (!isValid || !file) {
      return;
    }

    setFormState((prevState) => ({ ...prevState, avatar: file }));
    setSelectedAvatar(file);
    setIsUpdated(true);
  };

  const resetChanges = (userData: any) => {
    setIsUpdated(false);
    if (userData?.user) {
      setFormState({
        ...userData.user,
        avatar: originalImageState.current,
      });
    }
    setSelectedAvatar(null);
  };

  return {
    formState,
    setFormState,
    selectedAvatar,
    setSelectedAvatar,
    isUpdated,
    setIsUpdated,
    fileInputRef,
    originalImageState,
    handleFieldChange,
    handleFileUpload,
    resetChanges,
    initializeFormState,
  };
};