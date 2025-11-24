import { describe, it, expect, vi, beforeEach } from 'vitest';
import { calculateFileHash } from './filehash';

class MockFile {
  content: ArrayBuffer;
  name: string;
  type: string;

  constructor(
    content: string | ArrayBuffer,
    name: string,
    options: { type: string },
  ) {
    if (typeof content === 'string') {
      const encoder = new TextEncoder();
      this.content = encoder.encode(content).buffer as ArrayBuffer;
    } else {
      this.content = content;
    }
    this.name = name;
    this.type = options.type;
  }

  arrayBuffer(): Promise<ArrayBuffer> {
    return Promise.resolve(this.content);
  }
}

describe('calculateFileHash', () => {
  let mockDigest: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockDigest = vi.fn();

    mockDigest.mockImplementation(() => {
      const buffer = new ArrayBuffer(32);
      const view = new Uint8Array(buffer);
      for (let i = 0; i < 32; i++) {
        view[i] = i;
      }
      return Promise.resolve(buffer);
    });

    // Ensure crypto.subtle exists before trying to mock it
    if (!globalThis.crypto) {
      Object.defineProperty(globalThis, 'crypto', {
        value: {},
        writable: true,
        configurable: true,
      });
    }
    if (!globalThis.crypto.subtle) {
      Object.defineProperty(globalThis.crypto, 'subtle', {
        value: {},
        writable: true,
        configurable: true,
      });
    }

    Object.defineProperty(crypto.subtle, 'digest', {
      value: mockDigest,
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should calculate the correct SHA-256 hash for a file', async () => {
    const fileContent = 'test content';
    const file = new MockFile(fileContent, 'test.txt', {
      type: 'text/plain',
    }) as unknown as File;

    const hash = await calculateFileHash(file);

    const expectedHash =
      '000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f';

    expect(hash).toBe(expectedHash);

    expect(mockDigest).toHaveBeenCalledTimes(1);

    const args = mockDigest.mock.calls[0];
    expect(args[0]).toBe('SHA-256');

    expect(args[1]).toBeTruthy();

    expect(typeof args[1].byteLength).toBe('number');
  });

  it('should convert the file content to an ArrayBuffer before hashing', async () => {
    const file = new MockFile('test', 'test.txt', {
      type: 'text/plain',
    }) as unknown as File;
    const arrayBufferSpy = vi.spyOn(file, 'arrayBuffer');
    await calculateFileHash(file);
    expect(arrayBufferSpy).toHaveBeenCalledTimes(1);
  });

  it('should handle empty files', async () => {
    const emptyFile = new MockFile('', 'empty.txt', {
      type: 'text/plain',
    }) as unknown as File;

    const hash = await calculateFileHash(emptyFile);

    expect(hash).toBeTruthy();
    expect(typeof hash).toBe('string');
  });

  it('should propagate errors if file reading fails', async () => {
    const file = {
      arrayBuffer: () => Promise.reject(new Error('Failed to read file')),
    } as unknown as File;
    await expect(calculateFileHash(file)).rejects.toThrow(
      'Failed to read file',
    );
  });

  it('should propagate errors if hashing fails', async () => {
    const file = new MockFile('test', 'test.txt', {
      type: 'text/plain',
    }) as unknown as File;

    mockDigest.mockImplementation(() => {
      return Promise.reject(new Error('Hashing failed'));
    });

    await expect(calculateFileHash(file)).rejects.toThrow('Hashing failed');
  });
});
