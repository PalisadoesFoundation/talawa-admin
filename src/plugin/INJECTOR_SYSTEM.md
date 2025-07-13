# Plugin Injector System

This document describes the dynamic code injection system that allows plugins to inject code blocks into existing components without modifying core application code.

## Overview

The injector system provides a way for plugins to add functionality to existing components by injecting React components at specific points in the application. This is achieved through extension points that are rendered alongside existing content.

## Injector Extension Points

### G1 - General Injector 1

**Description**: General purpose code injection for components
**Use Case**: Injecting social media icons, additional buttons, or any UI elements
**Example**: Adding custom social media icons to the login page

### G2 - General Injector 2

**Description**: General purpose code injection for components
**Use Case**: Injecting additional functionality or UI elements
**Example**: Adding custom widgets or tools

### G3 - General Injector 3

**Description**: General purpose code injection for components
**Use Case**: Injecting additional functionality or UI elements
**Example**: Adding custom features or integrations

## Injector Extension Structure

### IInjectorExtension Interface

```typescript
{
  injector: string;          // Component name to inject
  description?: string;      // Description of what this injector does
  target?: string;           // Optional target identifier for specific injection points
  order?: number;            // Optional display order
}
```

## Usage Examples

### 1. Plugin Manifest Configuration

```json
{
  "name": "My Plugin",
  "pluginId": "my-plugin",
  "version": "1.0.0",
  "extensionPoints": {
    "G1": [
      {
        "injector": "MySocialIcon",
        "description": "Adds a custom social media icon to the login page"
      }
    ]
  }
}
```

### 2. Injector Component Implementation

```tsx
import React from 'react';

const MySocialIcon: React.FC = () => {
  return (
    <a
      href="https://example.com"
      target="_blank"
      rel="noopener noreferrer"
      data-testid="mySocialIcon"
    >
      <img src="/path/to/icon.png" alt="My Social" />
    </a>
  );
};

export default MySocialIcon;
```

### 3. Plugin Main Export

```tsx
import MySocialIcon from './components/MySocialIcon';

// Export the injector component
export { MySocialIcon };
```

### 4. Using PluginInjector in Components

```tsx
import { PluginInjector } from 'plugin';

const MyComponent = () => {
  return (
    <div>
      <h1>My Component</h1>
      {/* Existing content */}
      <div className="social-icons">
        {/* Existing social icons */}

        {/* Plugin injector for additional content */}
        <PluginInjector injectorType="G1" />
      </div>
    </div>
  );
};
```

## Integration Points

### LoginPage Integration

The LoginPage component demonstrates how to integrate the injector system:

```tsx
<div className={styles.socialIcons}>
  {socialIconsList}
  {/* Plugin injector for additional social media icons */}
  <PluginInjector injectorType="G1" />
</div>
```

This allows plugins to add custom social media icons without modifying the core LoginPage component.

## PluginInjector Component

The `PluginInjector` component is responsible for rendering injector extensions:

### Props

- `injectorType`: The type of injector to render ('G1', 'G2', 'G3')
- `className`: Optional CSS class name
- `style`: Optional inline styles

### Features

- Automatically loads and renders injector components
- Handles errors gracefully
- Supports multiple injectors of the same type
- Maintains proper React keys for rendering

## usePluginInjectors Hook

The `usePluginInjectors` hook provides access to injector extensions:

```tsx
import { usePluginInjectors } from 'plugin';

const MyComponent = () => {
  const injectors = usePluginInjectors('G1');

  // Use injectors data as needed
  return (
    <div>
      {injectors.map((injector, index) => (
        <div key={index}>{injector.description}</div>
      ))}
    </div>
  );
};
```

## Best Practices

1. **Use Descriptive Names**: Choose clear, descriptive names for your injector components
2. **Handle Errors**: Always handle potential errors in your injector components
3. **Follow Styling**: Ensure your injected components follow the existing styling patterns
4. **Test Thoroughly**: Test your injectors in different contexts and scenarios
5. **Document Purpose**: Always include descriptions in your manifest for clarity
6. **Consider Performance**: Keep injector components lightweight and efficient

## Error Handling

The injector system includes built-in error handling:

- Missing components are logged as warnings
- Rendering errors are caught and logged
- Failed injectors don't break the parent component
- Graceful degradation when plugins are unavailable

## Security Considerations

- Injector components run in the same context as the parent component
- Validate all data and props in your injector components
- Be cautious with user-provided content
- Follow React security best practices

## Testing

### Unit Testing Injector Components

```tsx
import { render, screen } from '@testing-library/react';
import MySocialIcon from './MySocialIcon';

test('renders social icon', () => {
  render(<MySocialIcon />);
  expect(screen.getByTestId('mySocialIcon')).toBeInTheDocument();
});
```

### Integration Testing

```tsx
import { render, screen } from '@testing-library/react';
import { PluginInjector } from 'plugin';

test('renders plugin injector', () => {
  render(<PluginInjector injectorType="G1" />);
  // Test that injector components are rendered
});
```

## Future Enhancements

1. **Targeted Injection**: Support for targeting specific DOM elements
2. **Conditional Injection**: Injectors that render based on conditions
3. **Priority System**: Order injectors by priority
4. **Dynamic Loading**: Lazy load injector components
5. **Configuration**: Allow injectors to accept configuration props
