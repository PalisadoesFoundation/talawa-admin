import React, { useState } from 'react';
import styles from '../../../../style/app.module.css';
import convertToBase64 from 'utils/convertToBase64';
import { FaCamera } from 'react-icons/fa';

/**
 * Props for the `ImagePicker` component.
 */
interface InterfaceImagePickerProps {
  defaultImage?: string; // The default image to display in the preview.
  onImageSelect: (base64Image: string) => void; // Callback for when an image is selected.
  defaultPlaceholderImage: string;
}

/**
 * A component for selecting and previewing an image.
 * Converts the selected image to a Base64 string and invokes a callback.
 */
const ImagePicker: React.FC<InterfaceImagePickerProps> = ({
  defaultImage,
  onImageSelect,
}) => {
  const [previewImage, setPreviewImage] = useState<string | null>(
    defaultImage || null,
  );

  /**
   * Handles image file selection, converts it to Base64, and updates the preview.
   */
  const handleImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        // setIsLoading(true);
        const base64Image = await convertToBase64(file);
        setPreviewImage(base64Image);
        onImageSelect(base64Image);
      } catch (error) {
        console.error('Failed to convert image:', error);
      }
    }
  };

  return (
    <div className={styles.imagePicker}>
      <div className={styles.imagePickerContainer}>
        <img
          src={previewImage || '/path/to/default-image.jpg'} // Default placeholder image.
          alt="Preview"
          className={styles.previewImage}
        />
        <div className={styles.overlay}>
          <input
            type="file"
            accept="image/*"
            className={styles.fileInput}
            onChange={handleImageChange}
          />
          <FaCamera className={styles.cameraIcon} />
        </div>
      </div>
    </div>
  );
};

export default ImagePicker;
