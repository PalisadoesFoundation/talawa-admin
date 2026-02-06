declare module 'apollo-upload-client' {
  import { ApolloLink, Operation } from '@apollo/client';

  export interface InterfaceUploadOptions {
    uri?: string | ((operation: Operation) => string);
    fetch?: typeof fetch;
    fetchOptions?: RequestInit;
    headers?: Record<string, string>;
    credentials?: string;
    includeExtensions?: boolean;
    useGETForQueries?: boolean;
    isExtractableFile?: (value: unknown) => boolean;
    formData?: FormData;
    formDataAppendFile?: (
      formData: FormData,
      fieldName: string,
      file: File | Blob,
    ) => void;
  }

  export class UploadHttpLink extends ApolloLink {
    constructor(options?: InterfaceUploadOptions);
  }
}
