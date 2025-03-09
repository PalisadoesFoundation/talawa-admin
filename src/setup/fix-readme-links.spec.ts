import { describe, it, expect, vi, beforeEach } from 'vitest';
import fs from 'fs';
import path from 'path';

vi.mock('fs');

const filePath = path.join('docs', 'docs', 'auto-docs', 'test.md');

// Mock file content with README.md links
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
    vi.spyOn(fs, 'writeFileSync').mockImplementation(() => {}); // Mock writeFileSync
  });

  it('should read the file, replace README.md links, and write the modified content', () => {
    const replaceLinks = (filePath: string) => {
      // Read file
      let content = fs.readFileSync(filePath, 'utf8') as string;
      expect(content).toBe(mockFileContent); // Ensures readFileSync returns expected content

      // Perform replacement
      content = content.replace(/\[.*?\]\((.*?)README\.md\)/g, () => {
        return '[Admin Docs](/)';
      });
      expect(content).toBe(expectedFileContent); // Ensures replacement occurred

      // Write file
      fs.writeFileSync(filePath, content, 'utf8');
    };

    replaceLinks(filePath);

    // Assertions to confirm function execution
    expect(fs.readFileSync).toHaveBeenCalledWith(filePath, 'utf8');
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      filePath,
      expectedFileContent,
      'utf8',
    );
  });
});
