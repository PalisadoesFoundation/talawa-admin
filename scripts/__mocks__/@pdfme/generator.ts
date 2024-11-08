import type { Template } from '@pdfme/common';

export const generate = async ({
  template,
  inputs,
}: {
  template: Template;
  inputs: Record<string, string>[];
}): Promise<Uint8Array> => {
  // return await pdfmeGenerate({ template: template, inputs });
  const mockLength = Math.min(template.schemas.length, inputs.length);
  const mockReturnList = [];
  for (let i = 1; i <= mockLength; i++) {
    mockReturnList.push(i);
  }
  return Promise.resolve(new Uint8Array(mockReturnList));
};
