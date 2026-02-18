import { describe, it, expect, vi, afterEach } from 'vitest';
import { resolveAvatarFile } from './resolveAvatarFile';
import { urlToFile } from 'utils/urlToFile';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';

vi.mock('utils/urlToFile');
vi.mock('components/NotificationToast/NotificationToast', () => ({
  NotificationToast: {
    error: vi.fn(),
  },
}));

describe('resolveAvatarFile', () => {
  // --- Clear mocks after each test to ensure isolation ---
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('returns selectedAvatar when new avatar is uploaded', async () => {
    const file = new File(['img'], 'avatar.png', { type: 'image/png' });

    const result = await resolveAvatarFile({
      newAvatarUploaded: true,
      selectedAvatar: file,
      avatarURL: '',
    });

    expect(result).toBe(file);
  });

  it('converts avatarURL to File when no new avatar uploaded', async () => {
    const file = new File(['img'], 'from-url.png', { type: 'image/png' });
    vi.mocked(urlToFile).mockResolvedValueOnce(file);

    const result = await resolveAvatarFile({
      newAvatarUploaded: false,
      selectedAvatar: null,
      avatarURL: 'http://example.com/avatar.png',
    });

    expect(urlToFile).toHaveBeenCalledWith('http://example.com/avatar.png');
    expect(result).toBe(file);
  });

  it('shows error toast when urlToFile fails', async () => {
    vi.mocked(urlToFile).mockRejectedValueOnce(new Error('fail'));

    const result = await resolveAvatarFile({
      newAvatarUploaded: false,
      selectedAvatar: null,
      avatarURL: 'bad-url',
    });

    expect(NotificationToast.error).toHaveBeenCalled();
    expect(result).toBeNull();
  });

  // --- New test for the missing null-return path ---
  it('returns null when no avatar uploaded and no avatarURL provided', async () => {
    const result = await resolveAvatarFile({
      newAvatarUploaded: false,
      selectedAvatar: null,
      avatarURL: '',
    });

    expect(result).toBeNull();
    expect(urlToFile).not.toHaveBeenCalled();
    expect(NotificationToast.error).not.toHaveBeenCalled();
  });
});
