/**
 * Resolves the avatar file to use for a member.
 *
 * @param params - Object containing avatar information:
 *   - `newAvatarUploaded`: Whether a new avatar file was uploaded
 *   - `selectedAvatar`: The uploaded avatar file, if any
 *   - `avatarURL`: The URL of the existing avatar
 *
 * @returns A Promise that resolves to the selected File or null if unable to resolve.
 */

import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import { urlToFile } from 'utils/urlToFile';
import type { InterfaceResolveAvatarFileParams } from 'types/AdminPortal/MemberDetail/interface';

export const resolveAvatarFile = async ({
  newAvatarUploaded,
  selectedAvatar,
  avatarURL,
}: InterfaceResolveAvatarFileParams): Promise<File | null> => {
  if (newAvatarUploaded && selectedAvatar) {
    return selectedAvatar;
  }

  if (avatarURL) {
    try {
      return await urlToFile(avatarURL);
    } catch {
      NotificationToast.error(
        'Failed to process profile picture. Please try uploading again.',
      );
      return null;
    }
  }

  return null;
};
