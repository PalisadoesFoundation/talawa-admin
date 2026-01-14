/**
 * Helper functions for ProfileForm operations
 * Handles data preparation, localStorage updates, and business logic
 */

import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import { urlToFile } from 'utils/urlToFile';
import { removeEmptyFields } from 'utils/userUpdateUtils';
import { errorHandler } from 'utils/errorHandler';

export const prepareUpdatePayload = async (
  formState: any,
  selectedAvatar: File | null,
  userId: string,
  isUser: boolean,
  isAdmin: boolean,
  tCommon: any
) => {
  let avatarFile: File | null = null;
  
  if (!selectedAvatar && formState.avatarURL) {
    try {
      avatarFile = await urlToFile(formState.avatarURL);
    } catch {
      NotificationToast.error(tCommon('profilePictureUploadError') as string);
      return null;
    }
  }

  const data: any = {
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
    avatar: selectedAvatar || avatarFile,
    ...(!isUser && !isAdmin ? { id: userId } : {}),
  };

  return removeEmptyFields(data);
};

export const updateLocalStorageProfile = (
  updateData: any,
  setItem: (key: string, value: string) => void
) => {
  setItem('UserImage', updateData.updateCurrentUser.avatarURL);
  setItem('name', updateData.updateCurrentUser.name);
  setItem('email', updateData.updateCurrentUser.emailAddress);
  setItem('id', updateData.updateCurrentUser.id);
  setItem('role', updateData.updateCurrentUser.role);
};

export const handleProfileUpdate = async (
  executeUpdate: (input: any) => Promise<any>,
  input: any,
  isUser: boolean,
  isAdmin: boolean,
  setItem: (key: string, value: string) => void,
  setSelectedAvatar: (avatar: File | null) => void,
  setIsUpdated: (updated: boolean) => void,
  tCommon: any,
  t: any
) => {
  try {
    const { data: updateData } = await executeUpdate(input);
    
    if (updateData) {
      NotificationToast.success(
        tCommon('updatedSuccessfully', { item: 'Profile' }) as string
      );
      
      if (isUser || isAdmin) {
        updateLocalStorageProfile(updateData, setItem);
      }
      
      setSelectedAvatar(null);
      setIsUpdated(false);
    }
  } catch (error: unknown) {
    errorHandler(t, error);
  }
};

export const determineUserContext = (pathname: string) => {
  const pathParts = pathname.split('/');
  const isUser = pathParts[1] === 'user';
  const isAdmin = pathParts[1] === 'admin';
  
  return { isUser, isAdmin };
};