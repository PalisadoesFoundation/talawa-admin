declare module 'apollo-upload-client' {
  import { ApolloLink } from '@apollo/client';

  export interface UploadOptions {
    uri?: string | ((operation: any) => string);
    fetch?: typeof fetch;
    fetchOptions?: RequestInit;
    headers?: Record<string, string>;
    credentials?: string;
    includeExtensions?: boolean;
    useGETForQueries?: boolean;
    isExtractableFile?: (value: any) => boolean;
    formData?: any;
    formDataAppendFile?: (formData: any, fieldName: string, file: any) => void;
  }

  export class UploadHttpLink extends ApolloLink {
    constructor(options?: UploadOptions);
  }
}
