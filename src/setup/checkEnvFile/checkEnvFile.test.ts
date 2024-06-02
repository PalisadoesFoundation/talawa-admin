import fs from 'fs';
import { checkEnvFile } from './checkEnvFile';

jest.mock('fs');

describe('checkEnvFile', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should append missing keys to the .env file', () => {
    const envContent = 'EXISTING_KEY=existing_value\n';
    const envExampleContent =
      'EXISTING_KEY=existing_value\nNEW_KEY=default_value\n';

    jest
      .spyOn(fs, 'readFileSync')
      .mockReturnValueOnce(envContent)
      .mockReturnValueOnce(envExampleContent)
      .mockReturnValueOnce(envExampleContent);

    jest.spyOn(fs, 'appendFileSync');

    checkEnvFile();

    expect(fs.appendFileSync).toHaveBeenCalledWith(
      '.env',
      'NEW_KEY=default_value\n',
    );
  });

  it('should not append anything if all keys are present', () => {
    const envContent = 'EXISTING_KEY=existing_value\n';
    const envExampleContent = 'EXISTING_KEY=existing_value\n';

    jest
      .spyOn(fs, 'readFileSync')
      .mockReturnValueOnce(envContent)
      .mockReturnValueOnce(envExampleContent);

    jest.spyOn(fs, 'appendFileSync');

    checkEnvFile();

    expect(fs.appendFileSync).not.toHaveBeenCalled();
  });
});
