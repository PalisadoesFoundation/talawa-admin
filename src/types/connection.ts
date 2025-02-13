export type ConnectionPageInfo = {
  endCursor?: string;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor?: string;
};

export type InvalidCursor = {
  message: string;
};

export type MaximumValueError = {
  limit: number;
  message: string;
  path: string[];
};

export type ConnectionError = InvalidCursor | MaximumValueError;
