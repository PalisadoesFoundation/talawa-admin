import type {
    ApolloQueryResult,
    ApolloCache,
    DefaultContext,
    FetchResult,
    MutationFunctionOptions,
    OperationVariables,
} from '@apollo/client';
import type { TFunction } from 'i18next';
import type { NewChatType } from '../Chat/interface';

/**
 * Props for CreateDirectChat modal.
 */
export interface InterfaceCreateDirectChatProps {
    toggleCreateDirectChatModal: () => void;
    createDirectChatModalisOpen: boolean;
    chatsListRefetch: (
        variables?: Partial<{ id: string }> | undefined,
    ) => Promise<ApolloQueryResult<unknown>>;
    chats: NewChatType[];
}

/**
 * Parameters for creating a direct chat with another user.
 * Encapsulates user info, chat data, mutation functions, and UI handlers.
 */
export interface InterfaceHandleCreateDirectChatParams {
    id: string;
    userName: string;
    chats: NewChatType[];
    t: TFunction<'translation', 'userChat'>;
    tCommon: TFunction<'common', undefined>;
    createChat: (
        options?:
            | MutationFunctionOptions<
                unknown,
                OperationVariables,
                DefaultContext,
                ApolloCache<unknown>
            >
            | undefined,
    ) => Promise<FetchResult<unknown>>;
    createChatMembership: (
        options?:
            | MutationFunctionOptions<
                unknown,
                OperationVariables,
                DefaultContext,
                ApolloCache<unknown>
            >
            | undefined,
    ) => Promise<FetchResult<unknown>>;
    organizationId: string | undefined;
    userId: string | null;
    currentUserName: string;
    chatsListRefetch: (
        variables?: Partial<{ id: string }> | undefined,
    ) => Promise<ApolloQueryResult<unknown>>;
    toggleCreateDirectChatModal: () => void;
}
