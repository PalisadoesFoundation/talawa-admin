/**
 * ESLint plugin for vitest isolation – TypeScript type declarations
 */
import type { Rule } from 'eslint';

interface InterfaceVitestIsolationPlugin {
  rules: Record<string, Rule.RuleModule>;
}

declare const plugin: InterfaceVitestIsolationPlugin;

export default plugin;
