export type FieldError = {
  message: string;
  path: string[]; //non-nullable
};

export type MaximumLengthError = FieldError & {
  limit?: number;
};

export type MaximumValueError = FieldError & {
  limit: number;
};

export type MinimumLengthError = FieldError & {
  limit: number;
};

export type MinimumValueError = FieldError;
