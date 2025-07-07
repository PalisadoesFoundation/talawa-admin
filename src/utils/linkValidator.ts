export const isValidLink = (link: string): boolean => {
  try {
    new URL(link);
    return true;
  } catch {
    return false;
  }
};
