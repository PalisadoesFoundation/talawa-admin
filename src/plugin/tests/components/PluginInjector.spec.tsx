import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { ComponentType } from 'react';
import { render, screen } from '@testing-library/react';
import PluginInjector from '../../components/PluginInjector';
import { usePluginInjectors } from '../../hooks';
import { getPluginComponent } from '../../registry';

// Mock the hooks
vi.mock('../../hooks', () => ({
  usePluginInjectors: vi.fn(),
}));

// Mock the registry
vi.mock('../../registry', () => ({
  getPluginComponent: vi.fn(),
}));

const TestComponent = ({
  content,
  postId,
}: {
  content?: string;
  postId?: string;
}) => (
  <div>
    {content !== undefined && postId !== undefined ? (
      <>
        <span>Content: {content}</span>
        <span>PostId: {postId}</span>
      </>
    ) : (
      <span>Mock Component</span>
    )}
  </div>
);

describe('PluginInjector', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render plugin injectors', () => {
    const mockInjectors = [
      {
        pluginId: 'test-plugin',
        injector: 'TestComponent',
        description: 'Test injector',
      },
    ];

    vi.mocked(usePluginInjectors).mockReturnValue(mockInjectors);
    vi.mocked(getPluginComponent).mockReturnValue(
      TestComponent as unknown as ComponentType<object>,
    );

    render(<PluginInjector injectorType="G1" />);

    expect(usePluginInjectors).toHaveBeenCalledWith('G1');
    expect(getPluginComponent).toHaveBeenCalledWith(
      'test-plugin',
      'TestComponent',
    );
  });

  it('should render multiple injectors', () => {
    const mockInjectors = [
      {
        pluginId: 'plugin-1',
        injector: 'Component1',
        description: 'First injector',
      },
      {
        pluginId: 'plugin-2',
        injector: 'Component2',
        description: 'Second injector',
      },
    ];

    vi.mocked(usePluginInjectors).mockReturnValue(mockInjectors);
    vi.mocked(getPluginComponent).mockReturnValue(
      TestComponent as unknown as ComponentType<object>,
    );

    render(<PluginInjector injectorType="G2" />);

    expect(usePluginInjectors).toHaveBeenCalledWith('G2');
    expect(getPluginComponent).toHaveBeenCalledWith('plugin-1', 'Component1');
    expect(getPluginComponent).toHaveBeenCalledWith('plugin-2', 'Component2');
  });

  it('should handle missing component gracefully', () => {
    const mockInjectors = [
      {
        pluginId: 'test-plugin',
        injector: 'MissingComponent',
        description: 'Missing component',
      },
    ];

    vi.mocked(usePluginInjectors).mockReturnValue(mockInjectors);
    vi.mocked(getPluginComponent).mockReturnValue(null);

    render(<PluginInjector injectorType="G3" />);

    expect(usePluginInjectors).toHaveBeenCalledWith('G3');
    expect(getPluginComponent).toHaveBeenCalledWith(
      'test-plugin',
      'MissingComponent',
    );
  });

  it('should handle empty injectors array', () => {
    vi.mocked(usePluginInjectors).mockReturnValue([]);

    const { container } = render(<PluginInjector injectorType="G1" />);

    expect(usePluginInjectors).toHaveBeenCalledWith('G1');
    expect(container.firstChild).toBeNull();
  });

  it('should handle null injectors', () => {
    vi.mocked(usePluginInjectors).mockReturnValue([]);

    const { container } = render(<PluginInjector injectorType="G1" />);

    expect(usePluginInjectors).toHaveBeenCalledWith('G1');
    expect(container.firstChild).toBeNull();
  });

  it('should handle undefined injectors', () => {
    vi.mocked(usePluginInjectors).mockReturnValue([]);

    const { container } = render(<PluginInjector injectorType="G1" />);

    expect(usePluginInjectors).toHaveBeenCalledWith('G1');
    expect(container.firstChild).toBeNull();
  });

  it('should apply custom className', () => {
    const mockInjectors = [
      {
        pluginId: 'test-plugin',
        injector: 'TestComponent',
        description: 'Test injector',
      },
    ];

    vi.mocked(usePluginInjectors).mockReturnValue(mockInjectors);
    vi.mocked(getPluginComponent).mockReturnValue(
      TestComponent as unknown as ComponentType<object>,
    );

    render(<PluginInjector injectorType="G1" className="custom-class" />);

    expect(usePluginInjectors).toHaveBeenCalledWith('G1');
  });

  it('should apply custom style', () => {
    const mockInjectors = [
      {
        pluginId: 'test-plugin',
        injector: 'TestComponent',
        description: 'Test injector',
      },
    ];

    const customStyle = { backgroundColor: 'red' };

    vi.mocked(usePluginInjectors).mockReturnValue(mockInjectors);
    vi.mocked(getPluginComponent).mockReturnValue(
      TestComponent as unknown as ComponentType<object>,
    );

    render(<PluginInjector injectorType="G1" style={customStyle} />);

    expect(usePluginInjectors).toHaveBeenCalledWith('G1');
  });

  it('should handle injector with missing pluginId', () => {
    const mockInjectors = [
      {
        injector: 'TestComponent',
        description: 'Test injector',
      },
    ] as unknown as ReturnType<typeof usePluginInjectors>;

    vi.mocked(usePluginInjectors).mockReturnValue(mockInjectors);
    vi.mocked(getPluginComponent).mockReturnValue(
      TestComponent as unknown as ComponentType<object>,
    );

    render(<PluginInjector injectorType="G1" />);

    expect(usePluginInjectors).toHaveBeenCalledWith('G1');
    expect(getPluginComponent).toHaveBeenCalledWith('', 'TestComponent');
  });

  it('should handle injector with missing injector name', () => {
    const mockInjectors = [
      {
        pluginId: 'test-plugin',
        description: 'Test injector',
      },
    ] as unknown as ReturnType<typeof usePluginInjectors>;

    vi.mocked(usePluginInjectors).mockReturnValue(mockInjectors);
    vi.mocked(getPluginComponent).mockReturnValue(
      TestComponent as unknown as ComponentType<object>,
    );

    render(<PluginInjector injectorType="G1" />);

    expect(usePluginInjectors).toHaveBeenCalledWith('G1');
    expect(getPluginComponent).toHaveBeenCalledWith('test-plugin', undefined);
  });

  it('should handle component rendering errors', () => {
    const mockInjectors = [
      {
        pluginId: 'test-plugin',
        injector: 'ErrorComponent',
        description: 'Error component',
      },
    ];

    vi.mocked(usePluginInjectors).mockReturnValue(mockInjectors);
    vi.mocked(getPluginComponent).mockImplementation(() => {
      throw new Error('Component error');
    });

    render(<PluginInjector injectorType="G1" />);

    expect(usePluginInjectors).toHaveBeenCalledWith('G1');
    expect(getPluginComponent).toHaveBeenCalledWith(
      'test-plugin',
      'ErrorComponent',
    );
  });

  it('should use G1 as default type', () => {
    const mockInjectors = [
      {
        pluginId: 'test-plugin',
        injector: 'TestComponent',
        description: 'Test injector',
      },
    ];

    vi.mocked(usePluginInjectors).mockReturnValue(mockInjectors);
    vi.mocked(getPluginComponent).mockReturnValue(
      TestComponent as unknown as ComponentType<object>,
    );

    render(<PluginInjector injectorType="G1" />);
    expect(usePluginInjectors).toHaveBeenCalledWith('G1');
  });

  it('should pass data prop to injected components', () => {
    const mockInjectors = [
      {
        pluginId: 'test-plugin',
        injector: 'TestComponent',
        description: 'Test injector',
      },
    ];

    const testData = {
      content: 'This is a test post content',
      postId: '12345',
    };

    vi.mocked(usePluginInjectors).mockReturnValue(mockInjectors);
    vi.mocked(getPluginComponent).mockReturnValue(
      TestComponent as unknown as ComponentType<object>,
    );

    render(<PluginInjector injectorType="G1" data={testData} />);

    expect(
      screen.getByText('Content: This is a test post content'),
    ).toBeInTheDocument();
    expect(screen.getByText('PostId: 12345')).toBeInTheDocument();
  });

  it('should work without data prop (backward compatibility)', () => {
    const mockInjectors = [
      {
        pluginId: 'test-plugin',
        injector: 'TestComponent',
        description: 'Test injector',
      },
    ];

    vi.mocked(usePluginInjectors).mockReturnValue(mockInjectors);
    vi.mocked(getPluginComponent).mockReturnValue(
      TestComponent as unknown as ComponentType<{}>,
    );

    render(<PluginInjector injectorType="G1" />);

    expect(screen.getByText('Mock Component')).toBeInTheDocument();
  });

  it('should pass complex data objects to injected components', () => {
    const mockInjectors = [
      {
        pluginId: 'ai-summarizer',
        injector: 'SummarizeButton',
        description: 'AI Summarize Button',
      },
    ];

    const complexData = {
      content: 'Long post content to summarize',
      postId: 'abc123',
      userId: 'user456',
      metadata: {
        timestamp: '2025-10-05',
        tags: ['ai', 'summary'],
      },
      callbacks: {
        onSummarize: vi.fn(),
      },
    };

    vi.mocked(usePluginInjectors).mockReturnValue(mockInjectors);
    vi.mocked(getPluginComponent).mockReturnValue(
      TestComponent as unknown as ComponentType<{}>,
    );

    render(<PluginInjector injectorType="G2" data={complexData} />);

    expect(usePluginInjectors).toHaveBeenCalledWith('G2');
  });
});
