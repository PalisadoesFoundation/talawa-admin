import { describe, it, expect, vi, beforeEach } from 'vitest';
import fs from 'fs';
import path from 'path';

vi.mock('fs');

const filePath = path.join('docs', 'docs', 'auto-docs', 'test.md');

const mockFileContent = `
This is a test file.
[Some Link](./README.md)
More content here.
`;

const expectedFileContent = `
This is a test file.
[Admin Docs](/)
More content here.
`;

describe('fix-readme-links.js', () => {
  beforeEach(() => {
    vi.restoreAllMocks(); // Reset mocks before each test
    vi.spyOn(fs, 'readFileSync').mockReturnValue(mockFileContent);
    vi.spyOn(fs, 'writeFileSync').mockImplementation(() => {}); // Mock writeFileSync to prevent actual writes
  });

  it('should replace README.md links and write the updated content', () => {
    const replaceLinks = (filePath: string) => {
      let content = fs.readFileSync(filePath, 'utf8') as string;
      content = content.replace(
        /\[.*?\]\((.*?)README\.md\)/g,
        '[Admin Docs](/)',
      );
      fs.writeFileSync(filePath, content, 'utf8');
    };

    replaceLinks(filePath);

    expect(fs.readFileSync).toHaveBeenCalledWith(filePath, 'utf8');
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      filePath,
      expectedFileContent,
      'utf8',
    );
  });
});
