import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import { urlToFile } from 'utils/urlToFile';

export const resolveAvatarFile = async ({
  newAvatarUploaded,
  selectedAvatar,
  avatarURL,
}: {
  newAvatarUploaded: boolean;
  selectedAvatar: File | null;
  avatarURL: string;
}): Promise<File | null> => {
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
