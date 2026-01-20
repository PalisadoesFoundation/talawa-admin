/**
 * Helper functions for ProfileForm operations
 * Handles data preparation, localStorage updates, and business logic
 */

import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import { errorHandler } from 'utils/errorHandler';
import { removeEmptyFields } from 'utils/userUpdateUtils';
import { urlToFile } from 'utils/urlToFile';
import { IFormState } from 'types/ProfileForm/type';

type Translator = (key: string, options?: Record<string, unknown>) => string;

interface UpdateCurrentUser {
  avatarURL: string;
  name: string;
  emailAddress: string;
  id: string;
  role: string;
}

interface UpdateResponse {
  updateCurrentUser: UpdateCurrentUser;
}

export const prepareUpdatePayload = async (
  formState: IFormState,
  selectedAvatar: File | null,
  userId: string,
  isUser: boolean,
  isAdmin: boolean,
  tCommon: Translator,
): Promise<Record<string, unknown> | null> => {
  let avatarFile: File | null = null;

  if (!selectedAvatar && formState.avatarURL) {
    try {
      avatarFile = await urlToFile(formState.avatarURL);
    } catch {
      NotificationToast.error(tCommon('profilePictureUploadError'));
      return null;
    }
  }

  const data: Record<string, string | File | null> = {
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
  updateData: UpdateResponse,
  setItem: (key: string, value: string) => void,
): void => {
  const { updateCurrentUser } = updateData;

  setItem('UserImage', updateCurrentUser.avatarURL);
  setItem('name', updateCurrentUser.name);
  setItem('email', updateCurrentUser.emailAddress);
  setItem('id', updateCurrentUser.id);
  setItem('role', updateCurrentUser.role);
};

export const handleProfileUpdate = async (
  executeUpdate: (input: unknown) => Promise<{ data?: UpdateResponse }>,
  input: unknown,
  isUser: boolean,
  isAdmin: boolean,
  setItem: (key: string, value: string) => void,
  setSelectedAvatar: (avatar: File | null) => void,
  setIsUpdated: (updated: boolean) => void,
  tCommon: Translator,
  t: Translator,
): Promise<void> => {
  try {
    const { data: updateData } = await executeUpdate(input);

    if (updateData) {
      NotificationToast.success(
        tCommon('updatedSuccessfully', { item: 'Profile' }),
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

export const determineUserContext = (
  pathname: string,
): { isUser: boolean; isAdmin: boolean } => {
  const pathParts = pathname.split('/');
  const isUser = pathParts[1] === 'user';
  const isAdmin = pathParts[1] === 'admin';

  return { isUser, isAdmin };
};
