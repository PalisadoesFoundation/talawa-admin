import { GET_FILE_PRESIGNEDURL } from 'GraphQl/Mutations/mutations';
import { useMutation } from '@apollo/client';

interface InterfaceMinioDownload {
  getFileFromMinio: (
    objectName: string,
    organizationId: string,
  ) => Promise<string>;
}

export const useMinioDownload = (): InterfaceMinioDownload => {
  const [generateGetFileUrl] = useMutation<{
    createGetfileUrl: {
      presignedUrl: string;
    };
  }>(GET_FILE_PRESIGNEDURL);

  const getFileFromMinio = async (
    objectName: string,
    organizationId: string,
  ): Promise<string> => {
    try {
      const { data } = await generateGetFileUrl({
        variables: {
          input: {
            objectName,
            organizationId,
          },
        },
      });

      if (!data?.createGetfileUrl?.presignedUrl) {
        throw new Error('Failed to get presigned URL');
      }

      const { presignedUrl } = data.createGetfileUrl;

      // Return the presigned URL which can be used directly in <img> tags or for display
      return presignedUrl;
    } catch (error) {
      console.error('Error fetching file from Minio:', error);
      throw error;
    }
  };

  return { getFileFromMinio };
};
