type NameLike = {
  firstName?: string | null;
  lastName?: string | null;
  name?: string | null;
};

/**
 * Returns a trimmed display name for a user-like object using available fields.
 * Falls back to the provided placeholder when no name data is present.
 */
export const getUserDisplayName = <T extends NameLike>(
  user?: T | null,
  fallback = 'Unknown User',
): string => {
  if (!user) {
    return fallback;
  }

  const fallbackName = `${user.firstName ?? ''} ${user.lastName ?? ''}`
    .replace(/\s+/g, ' ')
    .trim();

  const resolvedName = user.name?.trim() || fallbackName;

  return resolvedName.length > 0 ? resolvedName : fallback;
};
