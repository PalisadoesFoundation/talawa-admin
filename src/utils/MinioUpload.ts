import { PRESIGNED_URL } from 'GraphQl/Mutations/mutations';
import { useMutation } from '@apollo/client';

interface InterfaceMinioUpload {
  uploadFileToMinio: (
    file: File,
    organizationId: string,
  ) => Promise<{ fileUrl: string; objectName: string }>;
}

export const useMinioUpload = (): InterfaceMinioUpload => {
  const [generatePresignedUrl] = useMutation(PRESIGNED_URL);

  const uploadFileToMinio = async (
    file: File,
    organizationId: string,
  ): Promise<{ fileUrl: string; objectName: string }> => {
    // 1. Call the mutation to get presignedUrl & fileUrl
    const { data } = await generatePresignedUrl({
      variables: {
        input: {
          fileName: file.name,
          fileType: file.type,
          organizationId: organizationId,
        },
      },
    });
    if (!data || !data.createPresignedUrl) {
      throw new Error('Failed to get presigned URL');
    }
    const { presignedUrl, fileUrl, objectName } = data.createPresignedUrl;

    // 2. Upload the file directly to MinIO using the presigned URL
    const response = await fetch(presignedUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    });

    if (!response.ok) {
      throw new Error('File upload failed');
    }

    return { fileUrl, objectName };
  };

  return { uploadFileToMinio };
};
