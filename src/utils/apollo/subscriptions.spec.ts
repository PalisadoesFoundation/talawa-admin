import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';

let mockStorageData: Record<string, string> = {};
let shouldThrowOnGetItem = false;

const {
  splitMock,
  apolloLinkFromMock,
  getMainDefinitionMock,
  createClientMock,
  useLocalstorageMock,
  graphQLWsLinkConstructorMock,
} = vi.hoisted(() => ({
  splitMock: vi.fn(),
  apolloLinkFromMock: vi.fn(),
  getMainDefinitionMock: vi.fn(),
  createClientMock: vi.fn(),
  useLocalstorageMock: vi.fn(() => ({
    getItem: (k: string) => {
      try {
        if (shouldThrowOnGetItem) {
          throw new Error('localStorage unavailable');
        }
        return mockStorageData[k] || null;
      } catch {
        return null;
      }
    },
    setItem: (k: string, v: unknown) => {
      mockStorageData[k] = typeof v === 'string' ? v : JSON.stringify(v);
    },
    removeItem: (k: string) => {
      delete mockStorageData[k];
    },
    clearAllItems: () => {
      Object.keys(mockStorageData).forEach((key) => {
        delete mockStorageData[key];
      });
    },
  })),
  graphQLWsLinkConstructorMock: vi.fn(function graphQLWsLinkCtor(
    this: unknown,
    client: unknown,
  ) {
    return { kind: 'ws-link', client };
  }),
}));

vi.mock('@apollo/client', () => ({
  ApolloLink: {
    from: apolloLinkFromMock,
  },
  split: splitMock,
}));

vi.mock('@apollo/client/link/subscriptions', () => ({
  GraphQLWsLink: graphQLWsLinkConstructorMock,
}));

vi.mock('@apollo/client/utilities', () => ({
  getMainDefinition: getMainDefinitionMock,
}));

vi.mock('graphql-ws', () => ({
  createClient: createClientMock,
}));

vi.mock('utils/useLocalstorage', () => {
  const getStorageKey = (prefix: string, key: string): string => {
    return `${prefix}_${key}`;
  };

  const mockGetItem = <T>(prefix: string, key: string): T | null => {
    const prefixedKey = getStorageKey(prefix, key);
    try {
      if (shouldThrowOnGetItem) {
        throw new Error('localStorage unavailable');
      }
      const data = mockStorageData[prefixedKey];
      return data ? (JSON.parse(data) as T) : null;
    } catch {
      return null;
    }
  };

  const mockSetItem = (prefix: string, key: string, value: unknown): void => {
    const prefixedKey = getStorageKey(prefix, key);
    mockStorageData[prefixedKey] = JSON.stringify(value);
  };

  return {
    default: useLocalstorageMock,
    PREFIX: 'Talawa-admin',
    getItem: mockGetItem,
    setItem: mockSetItem,
    getStorageKey,
  };
});
vi.mock('utils/i18n', () => ({
  default: {
    language: 'en',
  },
}));

describe('subscriptions', () => {
  beforeEach(() => {
    mockStorageData = {};
    vi.resetModules();

    splitMock.mockReturnValue({ kind: 'split-link' });
    apolloLinkFromMock.mockReturnValue({ kind: 'composed-link' });
    createClientMock.mockReturnValue({ dispose: vi.fn() });
  });
  afterEach(() => {
    mockStorageData = {};
    shouldThrowOnGetItem = false;
    vi.resetModules();
    vi.restoreAllMocks();
  });

  it('does not initialize when dependencies are not configured', async () => {
    const { initializeSubscriptions } = await import('./subscriptions');

    initializeSubscriptions();

    expect(createClientMock).not.toHaveBeenCalled();
    expect(splitMock).not.toHaveBeenCalled();
    expect(apolloLinkFromMock).not.toHaveBeenCalled();
  });

  it('configures websocket and composed Apollo link on first initialization', async () => {
    const { configureSubscriptions, initializeSubscriptions } =
      await import('./subscriptions');
    const setLink = vi.fn();
    const errorLink = { kind: 'error-link' };
    const httpLink = { kind: 'http-link' };

    mockStorageData['Talawa-admin_token'] = JSON.stringify('test-token');

    configureSubscriptions({
      client: { setLink } as never,
      errorLink: errorLink as never,
      httpLink: httpLink as never,
      wsUrl: 'ws://example.test/graphql',
    });

    initializeSubscriptions();

    expect(createClientMock).toHaveBeenCalledTimes(1);
    const createClientArg = createClientMock.mock.calls[0]?.[0] as {
      url: string;
      connectionParams: () => Record<string, string>;
    };

    expect(createClientArg.url).toBe('ws://example.test/graphql');
    expect(createClientArg.connectionParams()).toEqual({
      authorization: 'Bearer test-token',
      'Accept-Language': 'en',
    });

    expect(graphQLWsLinkConstructorMock).toHaveBeenCalledTimes(1);
    expect(splitMock).toHaveBeenCalledTimes(1);
    expect(apolloLinkFromMock).toHaveBeenCalledWith([
      errorLink,
      { kind: 'split-link' },
    ]);
    expect(setLink).toHaveBeenCalledWith({ kind: 'composed-link' });
  });

  it('omits authorization header when token is missing', async () => {
    const { configureSubscriptions, initializeSubscriptions } =
      await import('./subscriptions');

    configureSubscriptions({
      client: { setLink: vi.fn() } as never,
      errorLink: {} as never,
      httpLink: {} as never,
      wsUrl: 'ws://example.test/graphql',
    });

    initializeSubscriptions();

    const createClientArg = createClientMock.mock.calls[0]?.[0] as {
      connectionParams: () => Record<string, string>;
    };

    expect(createClientArg.connectionParams()).toEqual({
      'Accept-Language': 'en',
    });
  });

  it('safely handles localStorage getItem errors in connection params', async () => {
    const { configureSubscriptions, initializeSubscriptions } =
      await import('./subscriptions');

    shouldThrowOnGetItem = true;

    configureSubscriptions({
      client: { setLink: vi.fn() } as never,
      errorLink: {} as never,
      httpLink: {} as never,
      wsUrl: 'ws://example.test/graphql',
    });

    initializeSubscriptions();

    const createClientArg = createClientMock.mock.calls[0]?.[0] as {
      connectionParams: () => Record<string, string>;
    };

    expect(createClientArg.connectionParams()).toEqual({
      'Accept-Language': 'en',
    });
  });

  it('routes only subscription operations to websocket via split predicate', async () => {
    const { configureSubscriptions, initializeSubscriptions } =
      await import('./subscriptions');

    configureSubscriptions({
      client: { setLink: vi.fn() } as never,
      errorLink: {} as never,
      httpLink: {} as never,
      wsUrl: 'ws://example.test/graphql',
    });

    initializeSubscriptions();

    const predicate = splitMock.mock.calls[0]?.[0] as (input: {
      query: unknown;
    }) => boolean;

    getMainDefinitionMock.mockReturnValue({
      kind: 'OperationDefinition',
      operation: 'subscription',
    });
    expect(predicate({ query: {} })).toBe(true);

    getMainDefinitionMock.mockReturnValue({
      kind: 'OperationDefinition',
      operation: 'query',
    });
    expect(predicate({ query: {} })).toBe(false);

    getMainDefinitionMock.mockReturnValue({
      kind: 'FragmentDefinition',
      operation: 'subscription',
    });
    expect(predicate({ query: {} })).toBe(false);
  });

  it('initializes only once even when called repeatedly', async () => {
    const { configureSubscriptions, initializeSubscriptions } =
      await import('./subscriptions');
    const setLink = vi.fn();

    configureSubscriptions({
      client: { setLink } as never,
      errorLink: {} as never,
      httpLink: {} as never,
      wsUrl: 'ws://example.test/graphql',
    });

    initializeSubscriptions();
    initializeSubscriptions();

    expect(createClientMock).toHaveBeenCalledTimes(1);
    expect(setLink).toHaveBeenCalledTimes(1);
  });

  describe('disposeWsClient', () => {
    it('safely disposes wsClient when it exists', async () => {
      const {
        configureSubscriptions,
        initializeSubscriptions,
        disposeWsClient,
      } = await import('./subscriptions');
      const setLink = vi.fn();
      const errorLink = { kind: 'error-link' };
      const httpLink = { kind: 'http-link' };
      const disposeMock = vi.fn();
      createClientMock.mockReturnValue({ dispose: disposeMock });

      configureSubscriptions({
        client: { setLink } as never,
        errorLink: errorLink as never,
        httpLink: httpLink as never,
        wsUrl: 'ws://example.test/graphql',
      });

      initializeSubscriptions();

      expect(disposeMock).not.toHaveBeenCalled();

      await disposeWsClient();

      expect(disposeMock).toHaveBeenCalledTimes(1);
      expect(apolloLinkFromMock).toHaveBeenLastCalledWith([
        errorLink,
        httpLink,
      ]);
      expect(setLink).toHaveBeenLastCalledWith({ kind: 'composed-link' });
    });

    it('is idempotent when wsClient is null', async () => {
      const { disposeWsClient } = await import('./subscriptions');

      await disposeWsClient();
      await disposeWsClient();

      expect(createClientMock).not.toHaveBeenCalled();
    });

    it('awaits promise result from dispose method', async () => {
      const {
        configureSubscriptions,
        initializeSubscriptions,
        disposeWsClient,
      } = await import('./subscriptions');
      const disposePromise = Promise.resolve();
      const disposeMock = vi.fn().mockReturnValue(disposePromise);
      createClientMock.mockReturnValue({ dispose: disposeMock });

      configureSubscriptions({
        client: { setLink: vi.fn() } as never,
        errorLink: {} as never,
        httpLink: {} as never,
        wsUrl: 'ws://example.test/graphql',
      });

      initializeSubscriptions();
      await disposeWsClient();

      expect(disposeMock).toHaveBeenCalledTimes(1);
    });

    it('handles non-promise dispose return value', async () => {
      const {
        configureSubscriptions,
        initializeSubscriptions,
        disposeWsClient,
      } = await import('./subscriptions');
      const disposeMock = vi.fn().mockReturnValue(undefined);
      createClientMock.mockReturnValue({ dispose: disposeMock });

      configureSubscriptions({
        client: { setLink: vi.fn() } as never,
        errorLink: {} as never,
        httpLink: {} as never,
        wsUrl: 'ws://example.test/graphql',
      });

      initializeSubscriptions();
      await disposeWsClient();

      expect(disposeMock).toHaveBeenCalledTimes(1);
    });

    it('catches and logs errors from dispose method', async () => {
      const {
        configureSubscriptions,
        initializeSubscriptions,
        disposeWsClient,
      } = await import('./subscriptions');
      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      const disposalError = new Error('Disposal failed');
      const disposeMock = vi.fn().mockImplementation(() => {
        throw disposalError;
      });
      createClientMock.mockReturnValue({ dispose: disposeMock });

      configureSubscriptions({
        client: { setLink: vi.fn() } as never,
        errorLink: {} as never,
        httpLink: {} as never,
        wsUrl: 'ws://example.test/graphql',
      });

      initializeSubscriptions();

      await expect(disposeWsClient()).resolves.not.toThrow();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error disposing WebSocket client:',
        disposalError,
      );

      consoleErrorSpy.mockRestore();
    });

    it('nullifies wsClient after disposal', async () => {
      const {
        configureSubscriptions,
        initializeSubscriptions,
        disposeWsClient,
      } = await import('./subscriptions');
      const disposeMock = vi.fn();
      createClientMock.mockReturnValue({ dispose: disposeMock });

      configureSubscriptions({
        client: { setLink: vi.fn() } as never,
        errorLink: {} as never,
        httpLink: {} as never,
        wsUrl: 'ws://example.test/graphql',
      });

      initializeSubscriptions();
      await disposeWsClient();

      // Second call should not call dispose again since wsClient is null
      await disposeWsClient();

      expect(disposeMock).toHaveBeenCalledTimes(1);
    });

    it('handles promise rejection from dispose method', async () => {
      const {
        configureSubscriptions,
        initializeSubscriptions,
        disposeWsClient,
      } = await import('./subscriptions');
      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      const rejectionError = new Error('Async disposal failed');
      const disposeMock = vi
        .fn()
        .mockImplementation(() => Promise.reject(rejectionError));
      createClientMock.mockReturnValue({ dispose: disposeMock });

      configureSubscriptions({
        client: { setLink: vi.fn() } as never,
        errorLink: {} as never,
        httpLink: {} as never,
        wsUrl: 'ws://example.test/graphql',
      });

      initializeSubscriptions();

      await expect(disposeWsClient()).resolves.not.toThrow();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error disposing WebSocket client:',
        rejectionError,
      );

      consoleErrorSpy.mockRestore();
    });
  });
});
