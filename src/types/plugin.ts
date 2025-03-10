export const Status = {
  ACTIVE: 'ACTIVE',
  BLOCKED: 'BLOCKED',
  DELETED: 'DELETED',
} as const;

export type Status = (typeof Status)[keyof typeof Status];

export const Type = {
  PRIVATE: 'PRIVATE',
  UNIVERSAL: 'UNIVERSAL',
} as const;

export type Type = (typeof Type)[keyof typeof Type];
