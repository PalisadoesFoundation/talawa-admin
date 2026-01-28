import { describe, it, expect } from 'vitest';
import plugin, { rules } from './index.ts';
import preferCrudModalTemplate from './rules/prefer-crud-modal-template.ts';

describe('ESLint Plugin Index', () => {
  describe('rules export', () => {
    it('should export a rules object', () => {
      expect(rules).toBeDefined();
      expect(typeof rules).toBe('object');
    });

    it('should contain the prefer-crud-modal-template rule', () => {
      expect(rules).toHaveProperty('prefer-crud-modal-template');
      expect(rules['prefer-crud-modal-template']).toBeDefined();
    });

    it('should map the prefer-crud-modal-template rule correctly', () => {
      expect(rules['prefer-crud-modal-template']).toBe(preferCrudModalTemplate);
    });

    it('should have the correct rule structure', () => {
      const rule = rules['prefer-crud-modal-template'];
      expect(rule).toHaveProperty('meta');
      expect(rule).toHaveProperty('create');
      expect(typeof rule.create).toBe('function');
    });
  });

  describe('default export', () => {
    it('should export a default plugin object', () => {
      expect(plugin).toBeDefined();
      expect(typeof plugin).toBe('object');
    });

    it('should contain a rules property in default export', () => {
      expect(plugin).toHaveProperty('rules');
      expect(plugin.rules).toBe(rules);
    });

    it('should have the same rules in both named and default exports', () => {
      expect(plugin.rules).toEqual(rules);
    });
  });
});
