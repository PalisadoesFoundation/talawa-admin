import { PRESIGNED_URL } from 'GraphQl/Mutations/mutations';
import { useMutation } from '@apollo/client';
import { calculateFileHash } from './filehash';

import { normalizeMinioUrl } from './minioUtils';

interface InterfaceMinioUpload {
  uploadFileToMinio: (
    file: File,
    organizationId: string,
  ) => Promise<{ objectName: string; fileHash: string }>;
}

export const useMinioUpload = (): InterfaceMinioUpload => {
  const [generatePresignedUrl] = useMutation<{
    createPresignedUrl: {
      presignedUrl: string;
      objectName: string;
      requiresUpload: boolean;
    };
  }>(PRESIGNED_URL);

  const uploadFileToMinio = async (
    file: File,
    organizationId: string,
  ): Promise<{ objectName: string; fileHash: string }> => {
    try {
      const fileHash = await calculateFileHash(file);
      const { data } = await generatePresignedUrl({
        variables: {
          input: {
            fileName: file.name,
            organizationId,
            fileHash,
          },
        },
      });

      if (!data?.createPresignedUrl) {
        throw new Error('Failed to get presigned URL');
      }

      const { presignedUrl, objectName, requiresUpload } =
        data.createPresignedUrl;

      // Upload the file only if required
      if (requiresUpload && presignedUrl) {
        const normalizedUrl = normalizeMinioUrl(presignedUrl);
        const response = await fetch(normalizedUrl, {
          method: 'PUT',
          body: file,
          headers: {
            'Content-Type': file.type || 'application/octet-stream', // Fallback for missing type
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('File upload failed with status:', response.status);
          console.error('Error response body:', errorText);
          throw new Error(
            `File upload failed: ${response.status} ${errorText}`,
          );
        }
      }

      // Return both objectName and fileHash
      return { objectName, fileHash };
    } catch (error) {
      console.error('Error in file upload process:', error);
      throw error;
    }
  };

  return { uploadFileToMinio };
};
