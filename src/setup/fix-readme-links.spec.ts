import { describe, it, expect, vi, beforeEach } from 'vitest';
import fs from 'fs';
import path from 'path';

vi.mock('fs');

const filePath = path.join('docs', 'docs', 'auto-docs', 'test.md');

// Move the function outside the test
const replaceLinks = (filePath: string) => {
  let content = fs.readFileSync(filePath, 'utf8') as string;
  content = content.replace(/\[.*?\]\((.*?)README\.md\)/g, () => {
    return '[Admin Docs](/)';
  });
  fs.writeFileSync(filePath, content, 'utf8');
  return content;
};

describe('fix-readme-links.js', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should replace README.md links with Admin Docs link', () => {
    // Test case 1: Basic replacement
    const mockContent1 = '[Some Link](./README.md)';
    vi.spyOn(fs, 'readFileSync').mockReturnValue(mockContent1);
    vi.spyOn(fs, 'writeFileSync').mockImplementation(() => {});

    const result = replaceLinks(filePath);
    expect(result).toBe('[Admin Docs](/)');
  });

  it('should handle multiple README.md links', () => {
    // Test case 2: Multiple replacements
    const mockContent2 = '[Link1](README.md)[Link2](./docs/README.md)';
    vi.spyOn(fs, 'readFileSync').mockReturnValue(mockContent2);
    vi.spyOn(fs, 'writeFileSync').mockImplementation(() => {});

    const result = replaceLinks(filePath);
    expect(result).toBe('[Admin Docs](/)[Admin Docs](/)');
  });

  it('should handle content with no README.md links', () => {
    // Test case 3: No replacements needed
    const mockContent3 = 'No links here';
    vi.spyOn(fs, 'readFileSync').mockReturnValue(mockContent3);
    vi.spyOn(fs, 'writeFileSync').mockImplementation(() => {});

    const result = replaceLinks(filePath);
    expect(result).toBe('No links here');
  });
});
