// Function to convert URL to File (required for multipart file uploads)
export const urlToFile = async (url: string): Promise<File> => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const filename = url.split('/').pop() || 'avatar';
    const fileExtension = blob.type.split('/')[1];
    return new File([blob], `${filename}.${fileExtension}`, {
      type: blob.type,
    });
  } catch (error) {
    console.error('Error converting URL to File:', error);
    throw error;
  }
};
