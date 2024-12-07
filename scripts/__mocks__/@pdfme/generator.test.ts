import { generate } from './generator';
import type { Template } from '@pdfme/common';

describe('Testing mock generate util', () => {
  test('should return a Promise', () => {
    const result = generate({
      template: { schemas: [] } as Template,
      inputs: [],
    });
    expect(result).toBeInstanceOf(Promise);
  });

  test('should resolve to a Uint8Array', async () => {
    const result = generate({
      template: { schemas: [] } as Template,
      inputs: [],
    });

    const data = await result;
    expect(data).toBeInstanceOf(Uint8Array);
  });

  test('should generate PDF with valid template and inputs', async () => {
    const template = {
      schemas: [{ name: 'field1' }],
      // add other required template properties
    } as Template;
    const inputs = [{ field1: 'test value' }];

    const result = await generate({ template, inputs });

    expect(result).toBeInstanceOf(Uint8Array);
    expect(result.length).toBeGreaterThan(0);
  });

  describe('error cases', () => {
    test.each([
      {
        scenario: 'empty template',
        template: { schemas: [] } as Template,
        inputs: [{ field1: 'value1' }],
      },
      {
        scenario: 'empty inputs',
        template: { schemas: [{ name: 'field1' }] } as Template,
        inputs: [],
      },
      {
        scenario: 'both empty',
        template: { schemas: [] } as Template,
        inputs: [],
      },
    ])('should throw an error when $scenario', async ({ template, inputs }) => {
      await expect(generate({ template, inputs })).rejects.toThrow(
        'Template or inputs cannot be empty.',
      );
    });
  });
});
