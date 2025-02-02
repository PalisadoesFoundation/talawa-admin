import { generate } from './generator';
import type { Template } from '@pdfme/common';

describe('Testing mock generate util', () => {
  test('should return a Promise', async () => {
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
    expect(result).toBeInstanceOf(Uint8Array);
  });

  it('should throw an error when template is empty', async () => {
    const emptyTemplate = { schemas: [] } as Template;
    const validInputs = [{ field1: 'value1' }];

    await expect(
      generate({ template: emptyTemplate, inputs: validInputs }),
    ).rejects.toThrow('Template or inputs cannot be empty.');
  });

  it('should throw an error when inputs are empty', async () => {
    const validTemplate = { schemas: [{ name: 'field1' }] } as Template;
    const emptyInputs: Record<string, string>[] = [];

    await expect(
      generate({ template: validTemplate, inputs: emptyInputs }),
    ).rejects.toThrow('Template or inputs cannot be empty.');
  });

  it('should throw an error when both template and inputs are empty', async () => {
    const emptyTemplate = { schemas: [] } as Template;
    const emptyInputs: Record<string, string>[] = [];

    await expect(
      generate({ template: emptyTemplate, inputs: emptyInputs }),
    ).rejects.toThrow('Template or inputs cannot be empty.');
  });
});
