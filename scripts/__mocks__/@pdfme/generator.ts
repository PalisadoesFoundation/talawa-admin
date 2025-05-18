import type { Template } from '@pdfme/common';

export const generate = async ({
  template,
  inputs,
}: {
  template: Template;
  inputs: Record<string, string>[];
}): Promise<Uint8Array> => {
  if (template.schemas.length === 0 || inputs.length === 0) {
    // console.log('pdf error: length : ', template, inputs, inputs.length);
    throw new Error('Template or inputs cannot be empty.');
  }
  // Generate mock PDF-like header bytes
  const pdfHeader = [0x25, 0x50, 0x44, 0x46]; // %PDF
  // Add some random content based on input size
  const contentSize = Math.min(template.schemas.length, inputs.length) * 10;
  const mockContent = Array.from({ length: contentSize }, () =>
    Math.floor(Math.random() * 256),
  );
  return Promise.resolve(new Uint8Array([...pdfHeader, ...mockContent]));
};
