import { describe, it, expect } from 'vitest';
import { validateFile } from './fileValidation';

describe('validateFile', () => {
  it('should return isValid true for a valid file', () => {
    // Create a valid file: 1MB JPEG image
    const validFile = new File([new ArrayBuffer(1024 * 1024)], 'test.jpg', {
      type: 'image/jpeg',
    });

    const result = validateFile(validFile);

    expect(result.isValid).toBe(true);
    expect(result.errorMessage).toBeUndefined();
  });

  it('should return isValid false when file size exceeds the maximum limit', () => {
    // Create a file larger than 5MB (default max size)
    const largeFile = new File(
      [new ArrayBuffer(6 * 1024 * 1024)],
      'large.jpg',
      {
        type: 'image/jpeg',
      },
    );

    const result = validateFile(largeFile);

    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toBe('File is too large. Maximum size is 5MB.');
  });

  it('should return isValid false when file type is not allowed', () => {
    // Create a file with an invalid type (PDF instead of image)
    const invalidTypeFile = new File(['content'], 'document.pdf', {
      type: 'application/pdf',
    });

    const result = validateFile(invalidTypeFile);

    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toBe(
      'Invalid file type. Please upload a file of type: JPEG, PNG, GIF.',
    );
  });

  it('should validate file size with custom maxSizeInMB parameter', () => {
    // Create a 3MB file
    const file = new File([new ArrayBuffer(3 * 1024 * 1024)], 'test.png', {
      type: 'image/png',
    });

    // Should pass with 5MB limit
    const resultPass = validateFile(file, 5);
    expect(resultPass.isValid).toBe(true);

    // Should fail with 2MB limit
    const resultFail = validateFile(file, 2);
    expect(resultFail.isValid).toBe(false);
    expect(resultFail.errorMessage).toBe(
      'File is too large. Maximum size is 2MB.',
    );
  });

  it('should validate file type with custom allowedTypes parameter', () => {
    // Create a PDF file
    const pdfFile = new File(['content'], 'document.pdf', {
      type: 'application/pdf',
    });

    // Should fail with default allowed types (images only)
    const resultFail = validateFile(pdfFile);
    expect(resultFail.isValid).toBe(false);

    // Should pass with custom allowed types including PDF
    const resultPass = validateFile(pdfFile, 5, ['application/pdf']);
    expect(resultPass.isValid).toBe(true);
  });

  it('should accept a file exactly at the size limit', () => {
    // Create a file exactly 5MB
    const file = new File([new ArrayBuffer(5 * 1024 * 1024)], 'test.gif', {
      type: 'image/gif',
    });

    const result = validateFile(file);

    expect(result.isValid).toBe(true);
    expect(result.errorMessage).toBeUndefined();
  });

  it('should reject a file one byte over the size limit', () => {
    // Create a file 5MB + 1 byte
    const file = new File([new ArrayBuffer(5 * 1024 * 1024 + 1)], 'test.jpg', {
      type: 'image/jpeg',
    });

    const result = validateFile(file);

    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toBe('File is too large. Maximum size is 5MB.');
  });

  it('should accept an empty file if type is valid', () => {
    // Create an empty file with valid type
    const emptyFile = new File([], 'empty.png', {
      type: 'image/png',
    });

    const result = validateFile(emptyFile);

    expect(result.isValid).toBe(true);
    expect(result.errorMessage).toBeUndefined();
  });

  it('should format multiple allowed types correctly in error message', () => {
    // Create a file with invalid type
    const file = new File(['content'], 'video.mp4', {
      type: 'video/mp4',
    });

    const result = validateFile(file, 5, [
      'image/jpeg',
      'image/png',
      'application/pdf',
    ]);

    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toBe(
      'Invalid file type. Please upload a file of type: JPEG, PNG, PDF.',
    );
  });

  it('should format MIME subtype with "+" correctly in error message', () => {
    // Test MIME type with special characters (svg+xml)
    const file = new File(['content'], 'test.txt', {
      type: 'text/plain',
    });

    const result = validateFile(file, 5, ['image/svg+xml']);

    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toBe(
      'Invalid file type. Please upload a file of type: SVG+XML.',
    );
  });
});
