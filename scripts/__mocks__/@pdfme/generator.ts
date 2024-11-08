import type { Template } from '@pdfme/common';
import { generate as pdfmeGenerate } from '@pdfme/generator';

export const generate = async ({
  template,
  inputs,
}: {
  template: Template;
  inputs: Record<string, string>[];
}): Promise<Uint8Array> => {
  return await pdfmeGenerate({ template: template, inputs });
};
