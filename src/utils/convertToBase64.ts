const convertToBase64 = async (file: File): Promise<string> => {
  try {
    const res = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (): void => resolve(reader.result);
      reader.onerror = (error): void => reject(error);
    });
    return `${res}`;
  } catch {
    return '';
  }
};

export default convertToBase64;
