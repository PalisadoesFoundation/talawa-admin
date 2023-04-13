const convertToBase64 = async (file: File): Promise<string> => {
  try {
    const res = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
    return `${res}`;
  } catch (error) {
    return '';
  }
};

export default convertToBase64;
